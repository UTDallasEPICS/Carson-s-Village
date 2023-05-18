import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default defineEventHandler(async event => {

  const body = await readBody(event)
  console.log(body);
  //setCookie(event, 'cvuser',(JSON.stringify(body)))
  try{
    
  const queryRes = await prisma.page.create({
    data: {
      ...body,
      User: {
        connect: {
          cuid: body.family_cuid || "0"
        }
      
        }
      }
    });
  }catch(error) {
    console.log(error);
  }
 // const router = useRouter();
  //const data = computed(() => parseInt(router.params || "{}"));
    return body;
});


  /*  const body = await readBody(event)
  setCookie(event, "cv", body.id_token)
  
});*/
