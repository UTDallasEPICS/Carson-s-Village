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
    const url = body.url
    const pageCuid = body.pageCuid;
    const ImageCuid = body.cuid

    try {
        // Replaces entry in the database in the image model for a specfic image
        /*const queryRes = await prisma.page.update({
            where: {
                cuid: pageCuid
            },
            data: {
                profileImage: {
                    url: url,
                    pageCuid: pageCuid,
                    
                }
                profileImageCuid: imageCuid
                }
        });*/

        return true;
    } catch (e) {
        console.error(e);
    }
})