import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
	let idList = event.pathParameters.id.split(',');

	if (idList.length > 1) {
		const params = {
			TableName: tables.badges
		};

		try {
			const result = await dynamoDbLib.call("scan", params);
			const badgesList = result.Items.filter(badge => idList.indexOf(badge.badgeId) > -1);
			callback(null, success(badgesList));
		} catch (e) {
			callback(null, failure({status: false}));
		}
	} else {
		const params = {
			TableName: tables.badges,
			Key: {
				badgeId: idList[0]
			}
		};

		try {
			const result = await dynamoDbLib.call("get", params);
			if (result.Item) {
				callback(null, success([result.Item]));
			} else {
				callback(null, failure({status: false, error: "Item not found."}));
			}
		} catch (e) {
			callback(null, failure({status: false}));
		}
	}

}