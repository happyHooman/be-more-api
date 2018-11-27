import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
    const params = {
        TableName: tables.ladders,
        Key: {
	        ladderId: event.pathParameters.id
        }
    };

    try {
        await dynamoDbLib.call("delete", params);
        callback(null, success({status: true}));
    } catch (e) {
        callback(null, failure({status: false}));
    }
}