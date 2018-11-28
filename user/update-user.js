import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
	const data = JSON.parse(event.body);
	const params = {
		TableName: tables.users,
		Key: {
			userId: event.requestContext.identity.cognitoIdentityId
		},
		UpdateExpression: "SET  userName = :userName, picture = :picture",
		ExpressionAttributeValues: {
			":userName": data.userName ? data.userName : null,
			":picture": data.picture ? data.picture : null
		},
		ReturnValues: "ALL_NEW"
	};

	try {
		await dynamoDbLib.call("update", params);
		callback(null, success({status: true}));
	} catch (e) {
		console.log(e);
		callback(null, failure({status: false}));
	}
}