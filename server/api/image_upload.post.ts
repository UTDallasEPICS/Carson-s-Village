// This file contains the code for handling the POST request to the image upload endpoint

import { nanoid } from "nanoid"
import { getSignedFileUrl } from "./integrations/aws"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Read the request body
    const data = await readBody(event)

    // Log the incoming request body
    console.log(data)

    // key used to retrieve image later on
    const key = nanoid()
    // gets presigned URL from aws.ts and returns it to the call from vue
    const uploadUrl =  await getSignedFileUrl(data.contentLength,data.contentType, key);
    const contentUrl = import.meta.env.IMAGES_URL + key;
    const body = await readBody(event)
    const url = body.url
  //const page_cuid = body.cuid;
  //delete body.cuid;

  try{
  // Creates a new entry in the database in the page model to a specfic user
  /*const queryRes = await prisma.image.create({
    data: {
      ...body,cuid: undefined,
      User: {
        connect: {
          PageCuid : page_cuid || "0"
        }
      
        }
      }
    });*/
  } catch(e){
    console.error(e)
  }
    return  {
      
      uploadUrl: await getSignedFileUrl(data.contentLength, data.contentType, key),
      contentUrl: import.meta.env.IMAGES_URL + key
    }

  } catch (err) {
    console.error(err)
    alert("Error Uploading Image")
    //event.status(500).send('Error uploading image')
  }
})


// everything about getting presign url is in integrations aws.ts
// create url in aws.ts, import into route handler, route handler gets data out of body pass into getsign url, return result to front end*/