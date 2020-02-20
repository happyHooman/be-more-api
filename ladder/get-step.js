import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
	const params = {
		TableName: tables.ladders,
		Key: {
			ladderId: event.pathParameters.ladder
		}
	};

	try {
		const result = await dynamoDbLib.call("get", params);
		if (result.Item) {
			let step = result.Item.steps.filter(step => step.stepId === event.pathParameters.step);
			callback(null, success(step));
		} else {
			callback(null, failure({error: "Item not found."}));
		}
	} catch (e) {
		callback(null, failure({status: false}));
	}
}