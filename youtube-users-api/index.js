const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
const { v4: uuidv4 } = require("uuid");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());
app.use((req, res, next) => {
    if (req.headers["x-api-key"] !== process.env.API_KEY) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }
    next();
});

app.get("/users/:userId", async function (req, res) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            userId: req.params.userId,
        },
    };

    try {
        const { Item } = await dynamoDbClient.send(new GetCommand(params));
        if (Item) {
            const { userId, userName, ethAddress } = Item;
            res.json({ userId, userName, ethAddress });
        } else {
            res.status(404).json({
                error: 'Could not find user with provided "userId"',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retreive user" });
    }
});

app.post("/users", async function (req, res) {
    const userId = uuidv4();
    const { userName, ethAddress } = req.body;
    if (typeof userName !== "string") {
        res.status(400).json({ error: '"userName" must be a string' });
    } else if (typeof ethAddress !== "string") {
        res.status(400).json({ error: '"ethAddress" must be a string' });
    }

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: userId,
            userName: userName,
            ethAddress: ethAddress,
        },
    };

    try {
        await dynamoDbClient.send(new PutCommand(params));
        res.json({ userId, userName });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not create user" });
    }
});

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);
