const AWS = require("aws-sdk");

const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-1" });

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const youtubeName = event.pathParameters && event.pathParameters.youtubeName;

    if (httpMethod === "GET" && youtubeName) {
        return getUser(youtubeName);
    } else if (httpMethod === "GET") {
        return getAllUsers();
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Invalid request",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    }
};

async function getUser(youtubeName) {
    const params = {
        TableName: "Youtube-Donations",
        Key: {
            youtubeName: youtubeName,
        },
    };

    try {
        const data = await dynamoDBClient.get(params).promise();
        if (data.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    ethereumAddress: data.Item.ethereumAddress,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: "User not found",
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    }
}

async function getAllUsers() {
    const params = {
        TableName: "Youtube-Donations",
    };

    try {
        const data = await dynamoDBClient.scan(params).promise();
        if (data.Items) {
            // Extract youtubeNames from the Items
            const youtubeNames = data.Items.map((item) => item.youtubeName);
            return {
                statusCode: 200,
                body: JSON.stringify(youtubeNames),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: "No users found",
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    }
}
