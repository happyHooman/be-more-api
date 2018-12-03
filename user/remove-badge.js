import * as dynamoDbLib from "../libs/dynamodb-lib";
import {success, failure} from "../libs/response-lib";
import tables from "../libs/tables";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: tables.users,
        Key: {
            userId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDbLib.call("get", params);
        if (result.Item) {
            let badgeList = result.Item.badges || [];

            // next 2 lines are the only different part
            let i = badgeList.indexOf(data.badgeId);
            badgeList.splice(i, 1);

            const params = {
                TableName: tables.users,
                Key: {
                    userId: event.pathParameters.id
                },
                UpdateExpression: "SET badges = :badgeList",
                ExpressionAttributeValues: {
                    ":badgeList": badgeList
                },
                ReturnValues: "ALL_NEW"
            };

            try {
                await dynamoDbLib.call("update", params);
                callback(null, success({status: true}));
            } catch (e) {
                console.log(e);
                callback(null, failure({status: false}));
            }
        } else {
            callback(null, failure({status: false, error: "User not found"}));
        }
    } catch (e) {
        callback(null, failure({status: false}));
    }
}