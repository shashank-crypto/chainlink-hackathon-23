const method = args[0]
const username = args[1]
const ethereumAddress = args[2]
const userId = args[3]

// Get the API key from the environment variables
if (!secrets.apiSecret || !secrets.apiEndpoint) {
  throw Error("API_KEY or API_ENDPOINT environment variable is empty")
}

// Don't try if the username or ethereumAddress is empty
let result;
let targetAddress = "";
let createdUserId = "";
if (method == "GET") {
  if ( !userId ) throw Error("userId is empty")
  try{
    result = await userRequest.getUserIdByUsername(userId)
    targetAddress = result.ethAddress
  }
  catch(err) {
    throw Error("Could not retrieve the user")
  }
}
else if (method == "POST") {
  if ( !username || !ethereumAddress ) throw Error("YouTube username or Ethereum address is empty")
  try{
    result = await userRequest.createUser(username, ethereumAddress)
    createdUserId = result.userId
  }
  catch(err) {
    throw Error("Could not create the user")
  }
}
else {
  throw Error("Method is can only be GET or POST")
}

const userRequest = {
  // Function to signup a new user
  createUser: (username, ethereumAddress) =>
    Functions.makeHttpRequest({
      url: secrets.apiEndpoint,
      Headers: {
        "x-api-key": secrets.apiSecret,
      },
      data: {
        userName: username,
        ethAddress: ethereumAddress,
      },
      method: "POST",
    }),

  // Function to get the user ID by username
  getUserIdByUsername: (userId) =>
    Functions.makeHttpRequest({
      url: `${secrets.apiEndpoint}/${userId}`,
      Headers: {
        "x-api-key": secrets.apiSecret,
      },
      method: "GET",
    }),
}

// method to differentiate between the different requests

// Return the result along with the username and ethereumAddress
return Functions.encodeString(`${targetAddress}-${createdUserId}}`)

// return Buffer.concat([
//   Functions.encodeString(result),
//   Functions.encodeString(username),
//   Functions.encodeString(ethereumAddress),
//   Functions.encodeString(youtubeNames),
// ])
