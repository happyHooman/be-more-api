import uuid from 'uuid'
import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
	const data = JSON.parse(event.body);

	const params = {
		TableName: tables.frames,
		Item: {
			badgeId: uuid.v1(),
			picture: data.picture
		}
	};

	try {
		await dynamoDbLib.call("put", params);
		callback(null, success(params.Item));
	} catch (e) {
		callback(null, failure({status: false}));
	}
}