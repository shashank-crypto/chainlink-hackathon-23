// Get the arguments from the request config
const username = args[0] // YouTube username
const ethereumAddress = args[1] // Ethereum address
const requiredStringIncluded = `This video accepts donations at ${ethereumAddress}` // String to target videos
const MAX_RESULTS = 10 // Number of videos to check

// Initialize the result to -1 (error)
let result = -1

// Get the API key from the environment variables
if (!secrets.apiKey) {
  throw Error("YOUTUBE_API_KEY environment variable not set for YouTube API.")
}

// Don't try if the username or ethereumAddress is empty
if (!username || !ethereumAddress) {
  throw Error("YouTube username or Ethereum address is empty")
}

// Prepare the API requests
const youtubeRequest = {
  // Function to get the user ID by username
  userIdByUsername: () =>
    Functions.makeHttpRequest({
      url: "https://www.googleapis.com/youtube/v3/channels",
      params: {
        part: "snippet",
        forUsername: username,
        key: secrets.apiKey,
      },
    }),
  // Function to get the last videos by user ID
  lastVideosByUserId: (userId) =>
    Functions.makeHttpRequest({
      url: "https://www.googleapis.com/youtube/v3/search",
      params: {
        part: "snippet",
        channelId: userId,
        type: "video",
        key: secrets.apiKey,
        maxResults: MAX_RESULTS,
      },
    }),
}

// Request user ID by username
const idRes = await new Promise((resolve, reject) => {
  youtubeRequest.userIdByUsername().then((res) => {
    if (!res.error) {
      resolve(res)
    } else {
      reject(res)
    }
  })
})

// Throw an error if requets has failed
if (idRes.error || !idRes.data.items || idRes.data.items.length === 0) {
  throw Error("YouTube API request failed - could not get user id")
}

// Get the user ID from the response
const userId = idRes.data.items[0].id || null

// If the user ID is null, throw an error
if (!userId) {
  throw Error("YouTube API request failed - user id is null")
}

// Request the last videos by user ID
const videosRes = await new Promise((resolve, reject) => {
  youtubeRequest.lastVideosByUserId(userId).then((res) => {
    if (!res.error) {
      resolve(res)
    } else {
      reject(res)
    }
  })
})

// Throw an error if the request has failed
if (videosRes.error) {
  throw Error("YouTube API request failed - could not get videos")
}

// If there are no items or the items array is empty, log the message and set result to 0
if (!videosRes.data.items || videosRes.data.items.length === 0) {
  console.log("No videos found for user:", username)
  result = 0
} else {
  // If there are videos, check if any of them include the required string
  const videos = videosRes.data.items
  const videoTitles = videos.map((video) => video.snippet.title)

  const res = videoTitles.some((title) => title.toLowerCase().includes(requiredStringIncluded.toLowerCase()))

  // Set the result based on whether the required string is found or not
  result = res ? 1 : 0
}

// Return the result along with the username and ethereumAddress
return Functions.encodeString(`${result},${username},${ethereumAddress}`)
