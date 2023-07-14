// This file contains the code for handling the POST request to the image upload endpoint

import { nanoid } from "nanoid"
import { getSignedFileUrl } from "./integrations/aws"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/EditPage/cuid (image replace)
*	file:		/Pages/EditPage.vue
*	function:	PUT
*	Replace family page image from the database.
*/

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const replaced_image_cuid = body.replacedImage.cuid
    console.log(replaced_image_cuid)
    console.log(body)
    try {
        // Replaces entry in the database in the image model for a specfic image

        await prisma.$transaction([
            prisma.image.delete({
            where: {
                cuid: body.imageUploaded.cuid
            }
        }), prisma.image.update({
            where: {
                cuid: replaced_image_cuid
            },
            data: {
                url:  body.imageUploaded.url,
        
                }
            }
        ) ]);

        return true;
    } catch (e) {
        console.error(e);
    }
})