// This file contains the code for handling the POST request to the image upload endpoint

import { nanoid } from "nanoid"
import { getSignedFileUrl } from "./integrations/aws"
const runtime = useRuntimeConfig()
export default defineEventHandler(async (event) => {
    const body = await readBody(event) 
    // key used to retrieve image later on
    const key = nanoid()
    // gets presigned URL from aws.ts and returns it to the call from vue
    const uploadUrl =  await getSignedFileUrl(body.contentLength, body.contentType, key);
    const contentUrl =  "https://" + runtime.AWS_S3_BUCKET_NAME + "/" + key;
    
  
  // only signed in users may upload
  if(event.context.user?.cuid != "") {
  //try{
  // Creates a new entry in the database in the image model
    const image = await event.context.client.image.create({
      data: {
        url: contentUrl
        }
      });

    if(body.pageCuid != "0") {
      const queryRes = await event.context.client.image.update({
        where: {
          cuid: image.cuid
        },
        data: {
          pageCuid: body.pageCuid
          }
        });
    }
    return  {
      uploadUrl: uploadUrl,
      image
    } 
    }
  //}
  /*} catch(e){
    console.error(e)
  }*/
    

 // } catch (err) { 
 //   console.error(err)
 //   alert("Error Uploading Image")
    //event.status(500).send('Error uploading image')
  //}
})


// everything about getting presign url is in integrations aws.ts
// create url in aws.ts, import into route handler, route handler gets data out of body pass into getsign url, return result to front end*/