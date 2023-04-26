// Import the useFetch function
const { useFetch } = require("@nuxtjs/composition-api")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigned")
const{ S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")

// creating instance of S3 client
const S3ClientUE2 = new S3Client({
  region: "us-east-2"
})

export async function getSignedFileUrl({ contentLength: ContentLength, contentType: ContentType }, image_key) { // specify the key of the file that will be uploaded to the S3 bucket

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: image_key, // must generate 
      Body: "",
      ContentLength,  // delivered as arguments in function
      ContentType,  // capitalized bc aws expects capitalized
      })

  return await getSignedUrl(S3ClientUE2, command, {
    expiresin: 3600,
  })
}