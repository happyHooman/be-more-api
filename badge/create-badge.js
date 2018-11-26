import uuid from 'uuid'
import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);

    const params = {
        TableName: "be-more-badges",
        Item: {
            badgeId: uuid.v1(),
            picture: data.picture,
            title: data.title
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        callback(null, failure({status: false}));
    }
}