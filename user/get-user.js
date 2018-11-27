import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
    const params = {
        TableName: tables.users,
        Key: {
            userId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDbLib.call("get", params);
        if (result.Item) {
            callback(null, success(result.Item));
        } else {
            callback(null, failure({status: false, error: "Item not found."}));
        }
    } catch (e) {
        callback(null, failure({status: false}));
    }
}