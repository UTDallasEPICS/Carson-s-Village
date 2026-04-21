import { nanoid } from "nanoid"
const runtime = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const { user } = await auth.api.getSession({
    headers: event.headers
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  const body = await readBody(event) 

  // key used to retrieve image later on
  const key = nanoid() + "-"  + body.filename

  // gets presigned URL from aws.ts and returns it to the call from vue
  const uploadUrl = await getSignedFileUrl(body.contentType, key);
  const contentUrl = "https://s3.us-east-2.amazonaws.com/" + runtime.AWS_S3_BUCKET_NAME + "/" + key;

  // only signed in users may upload
  if(user.role == "admin" || user.role == "advocate" || user.role == "family") {
    try {
      // Creates a new entry in the database in the image model
      const image = await prisma.image.create({
        data: {
          url: contentUrl
        }
      });

      if(body.pageCuid != "0") {
        const queryRes = await prisma.image.update({
          where: {
            id: image.id
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
    } catch(e){
      console.error(e)
      throw createError({
        statusCode: 500,
        statusMessage: "Something went wrong",
        cause: e
      })
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: "Not authorized"
    })
  }
})
