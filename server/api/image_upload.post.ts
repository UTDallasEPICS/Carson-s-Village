// This file contains the code for handling the POST request to the image upload endpoint
/*
import { nanoid } from "nanoid"
import { getSignedFileUrl } from "./integrations/aws"

export default defineEventHandler(async (event) => {
  try {
    // Read the request body
    const data = await readBody(event)

    // Log the incoming request body
    console.log(data)

    // key used to retrieve image later on
    const key = nanoid()

    return  {
      // gets presigned URL from aws.ts and returns it to the call from vue
      uploadUrl: await getSignedFileUrl(data, key),
      contentUrl: import.meta.env.IMAGES_URL + key
    }

  } catch (err) {
    console.error(err)
    event.status(500).send('Error uploading image')
  }
})


// everything about getting presign url is in integrations aws.ts
// create url in aws.ts, import into route handler, route handler gets data out of body pass into getsign url, return result to front end*/