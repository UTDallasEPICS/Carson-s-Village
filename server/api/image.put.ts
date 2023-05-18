// This file contains the code for handling the POST request to the image upload endpoint

import { nanoid } from "nanoid"
import { getSignedFileUrl } from "./integrations/aws"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

/*
*	/api/image/cuid
*	file:		/Pages/EditPage.vue
*	function:	PUT
*	Replace family page image from the database.
*/

export default defineEventHandler(async event => {
    const body = await readBody(event)
    const url = body.url
    const image_cuid = body.cuid;
    delete body.cuid;

    try {
        // Replaces entry in the database in the image model for a specfic image
        const queryRes = await prisma.image.update({
            where: {
                cuid: image_cuid
            },
            data: {
                ...body,
                User: {
                    connect: {
                        UserCuid: body.user_cuid || "0"
                    },
                    Page: {
                        connect: {
                            PageCuid: body.page_cuid || "0"
                        }
                    }

                }
            }
        });

        return true;
    } catch (e) {
        console.error(e);
    }
})