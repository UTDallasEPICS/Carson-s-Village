export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers
  })
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }
  const user = session.user

  const {replyData, suspended} = await readBody(event)

  const family = await prisma.family.findFirst({
    where: { id: replyData.familyCuid }
  })
  if (!family) {
    console.log('The reply is not attached to a family')
    throw createError({
      statusCode: 400,
      message: 'The reply is not attached to a family'
    });
  }

  //------ Auth Guard ---------------------------
  if (user.role !== 'admin' || (user.role === 'advocate' && family.advocateCuid !== user.id) || (user.role === 'family' && user.familyId === family.id)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized'
    })
  }

  const newReply = await prisma.reply.update({ 
      where: { id: replyData.id } ,
      data: { suspended: suspended } 
  });

  return newReply;
});
