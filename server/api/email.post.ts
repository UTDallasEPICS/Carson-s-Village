export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { email, first_name, last_name } = body;

    const token = await event.context.client.CC_Token.findUnique({})
    
    console.log(token.token, "test")

    const response = await fetch(`https://api.cc.email/v3/contacts`, {
        method: 'POST',
        body: {
            email_address: email,
            first_name: first_name,
            last_name: last_name,
            list_memberships: [
                "07936f78-662a-11eb-af0a-fa163e56c9b0"
            ]
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token}`
        },
        
    })
    console.log("test")

    const respBody = await response.json()
    
    console.log(respBody)

    await sendRedirect(event, `/EmailList?success=3`)
})
