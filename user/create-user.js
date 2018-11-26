import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);

    const params = {
        TableName: "be-more-user-details",
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            picture: data.picture,
            title: data.title,
            userName: data.userName,
            createdAt: Date.now()
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        callback(null, failure({status: false}));
    }
}