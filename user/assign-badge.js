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
			let badgeList = result.Item.badges || [];

			// next line is the only different part from
			badgeList.push(data.badgeId);

			const params = {
				TableName: tables.users,
				Key: {
					userId: event.pathParameters.id
				},
				UpdateExpression: "SET badges = :badgeList",
				ExpressionAttributeValues: {
					":badgeList": badgeList
				},
				ReturnValues: "ALL_NEW"
			};

			try {
				const result = await dynamoDbLib.call("update", params);
				callback(null, success({result}));
			} catch (e) {
				callback(null, failure({error: 'Something went wrong'}));
			}
		} else {
			callback(null, failure({error: "User not found"}));
		}
	} catch (e) {
		callback(null, failure({status: false}));
	}
}