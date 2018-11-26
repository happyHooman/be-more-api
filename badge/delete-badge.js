import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";

export async function main(event, context, callback) {
    const params = {
        TableName: "be-more-badges",
        Key: {
            badgeId: event.pathParameters.id
        }
    };

    try {
        await dynamoDbLib.call("delete", params);
        callback(null, success({status: true}));
    } catch (e) {
        callback(null, failure({status: false}));
    }
}