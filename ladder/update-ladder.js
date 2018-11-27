import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: tables.ladders,
        Key: {
	        ladderId: event.pathParameters.id
        },
        UpdateExpression: "SET ladderName = :ladderName",
        ExpressionAttributeValues: {
            ":ladderName": data.ladderName ? data.ladderName : null,
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        await dynamoDbLib.call("update", params);
        callback(null, success({status: true}));
    } catch (e) {
        callback(null, failure({status: false}));
    }
}