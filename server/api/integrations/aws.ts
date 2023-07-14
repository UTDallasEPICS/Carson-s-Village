//Import the useFetch function
//import { useFetch } from '@nuxtjs/composition-api'
//import { getSignedUrl }  from '@aws-sdk/s3-request-presigned'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
// creating instance of S3 client
const S3ClientUE2 = new S3Client({
  region: "us-east-2"
})
const runtime = useRuntimeConfig()

export async function getSignedFileUrl( contentLength: number, contentType: string , image_key: string) { // specify the key of the file that will be uploaded to the S3 bucket

    const command = new PutObjectCommand({
      Bucket: runtime.AWS_S3_BUCKET_NAME,
      Key: image_key, // must generate 
      Body: "",
      ContentLength : contentLength,  // delivered as arguments in function
      ContentType : contentType,  // capitalized bc aws expects capitalized
      })

  return await getSignedUrl(S3ClientUE2, command, {
    expiresIn: 3600,
  })
}