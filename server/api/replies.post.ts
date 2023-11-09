import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const pageCuid = body.pageCuid;
    const familyCuid = body.familyCuid;

    const page = await prisma.page.findFirst({
      where: {
        cuid: pageCuid,
      },
    });

    if (!page) {
      console.error(`Page with cuid ${pageCuid} not found`);
      return { status: "error", message: "Page not found" };
    }

    const newReply = await prisma.reply.create({
      data: {
        reply: body.replyData.reply,
        name: body.replyData.name,
        Page: {
          connect: {
            cuid: pageCuid,
          },
        },
        familyCuid: familyCuid,
      },
    });

    // You can return a response or handle success accordingly
    return { status: "success", reply: newReply };
  } catch (error) {
    console.error('An error occurred while submitting the reply:', error);
    // Handle error, e.g., show an error message to the user
    return { status: "error", message: "An error occurred" };
  } finally {
    await prisma.$disconnect();
  }
});
