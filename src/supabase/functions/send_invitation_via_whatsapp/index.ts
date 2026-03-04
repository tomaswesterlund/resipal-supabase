import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_TOKEN')
const PHONE_NUMBER_ID = Deno.env.get('PHONE_NUMBER_ID')

serve(async (req) => {
  try {
    const { record } = await req.json()
    // Formatting the number: Meta needs '521...' for Mexico, no '+'
    const cleanPhone = record.phone_number.replace(/\D/g, '')

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: cleanPhone,
          type: "template",
          template: {
            name: "invitation_template", // Use your exact template name from Meta
            language: { code: "es_MX" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: record.name },
                  { type: "text", text: record.message }
                ],
              },
            ],
          },
        }),
      }
    )

    const data = await res.json()
    return new Response(JSON.stringify(data), { 
      status: res.status, 
      headers: { "Content-Type": "application/json" } 
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})