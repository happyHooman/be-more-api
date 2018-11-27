import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
    const params = {
        TableName: tables.badges
    };

    try {
        const result = await dynamoDbLib.call("scan", params);
        callback(null, success(result.Items));
    } catch (e) {
        callback(null, failure({ status: false }));
    }
}