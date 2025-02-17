const runtime = useRuntimeConfig()

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { email, first_name, last_name } = body;

    const token = await event.context.client?.CC_Token.findUnique({
        where: {
            cuid: "0"
        }
    })

    const response = await fetch(`https://api.cc.email/v3/contacts/sign_up_form`, {
        method: 'POST',
        body: JSON.stringify({
            "email_address": email,
            "first_name": first_name,
            "last_name": last_name,
            "list_memberships": [
                `${runtime.CONSTANT_CONTACTS_LIST_MEMBERSHIP}`
            ]
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token}`
        },
    })

    const respBody = await response.json()

    return { 
        success: true 
    }
})
