import uuid from 'uuid'
import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables"

export async function main(event, context, callback) {
	const data = JSON.parse(event.body);
	const steps = data.steps;

	let action = 'update';
	if (!data.ladderId) {
		data.ladderId = uuid.v1();
		action = "put";
	}

	steps.forEach(async item => {
		if (!item.stepId) {
			item.stepId = uuid.v1();
		}

		item.requirements.forEach(requirement => {
			if (!requirement.id) {
				requirement.id = uuid.v1();
			}
		});

	});

	let params = {};
	if (action === "put") {
		params = {
			TableName: tables.ladders,
			Item: {
				ladderId: data.ladderId,
				ladderName: data.name,
				steps: steps
			}
		};
	} else {
		params = {
			TableName: tables.ladders,
			Key: {
				ladderId: data.ladderId
			},
			UpdateExpression: "SET ladderName = :ladderName, steps = :steps",
			ExpressionAttributeValues: {
				":ladderName": data.ladderName ? data.ladderName : null,
				":steps": data.steps ? data.steps : null
			},
			ReturnValues: "ALL_NEW"
		}
	}


	try {
		await dynamoDbLib.call(action, params);
		callback(null, success(data));
	} catch (e) {
		console.log(e);
		callback(null, failure({error: 'Something went wrong. Could not add ladder to DB'}));
	}
}