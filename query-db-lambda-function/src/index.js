const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDBClient = new DynamoDBClient({ region: "us-west-1" });

exports.handler = async (event) => {
    const params = {
        TableName: "Youtube-Donations",
    };

    try {
        const data = await dynamoDBClient.send(new ScanCommand(params));
        if (data.Items) {
            // Extract youtubeNames from the Items
            const youtubeNames = data.Items.map((item) => item.youtubeName.S);
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
};
