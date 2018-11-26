import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";

export async function main(event, context, callback) {
	const data = JSON.parse(event.body);
	const params = {
		TableName: "be-more-user-details",
		Key: {
			userId: event.pathParameters.id
		},
		UpdateExpression: "SET  userName = :userName, picture = :picture, title = :title",
		ExpressionAttributeValues: {
			":userName": data.userName ? data.userName : null,
			":picture": data.picture ? data.picture : null,
			":title": data.title ? data.title : null
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