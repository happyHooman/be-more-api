import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "be-more-user-details",
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId
        },
        UpdateExpression: "SET name = :name, picture = :picture, title = :title",
        ExpressionAttributeValues: {
            ":name": data.name ? data.name : null,
            ":picture": data.picture ? data.picture : null,
            ":title": data.title ? data.title : null
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