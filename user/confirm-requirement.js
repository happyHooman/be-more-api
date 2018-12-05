import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
	const data = JSON.parse(event.body);
	const params = {
		TableName: tables.users,
		Key: {
			userId: event.pathParameters.id
		}
	};

	try {
		const result = await dynamoDbLib.call("get", params);
		if (result.Item) {
			let requirementsList = result.Item.confirmedRequirements || [];

			// next line is the only different part from
			if (requirementsList.indexOf(data.requirementId) > -1) {
				callback(null, failure({status: false, error: 'Requirement already confirmed'}));
			}
			requirementsList.push(data.requirementId);

			const params = {
				TableName: tables.users,
				Key: {
					userId: event.pathParameters.id
				},
				UpdateExpression: "SET confirmedRequirements = :requirementsList",
				ExpressionAttributeValues: {
					":requirementsList": requirementsList
				},
				ReturnValues: "ALL_NEW"
			};

			try {
				await dynamoDbLib.call("update", params);
				callback(null, success({status: true}));
			} catch (e) {
				callback(null, failure({status: false, error: 'Something went wrong'}));
			}
		} else {
			callback(null, failure({status: false, error: "User not found"}));
		}
	} catch (e) {
		callback(null, failure({status: false}));
	}
}