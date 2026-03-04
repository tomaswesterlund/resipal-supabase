import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { record } = await req.json() // Webhooks send the data in a 'record' object

  // Extract data from the row that was just inserted
  const { email, name, message } = record

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Resipal <hola@resipal.app',
      to: [email],
      subject: 'Invitación a la comunidad',
      html: `
        <h1>Hola ${name}!</h1>
        <p>Has sido invitado a unirte a nuestra comunidad en Resipal.</p>
        <p><strong>Mensaje del administrador:</strong></p>
        <blockquote style="padding: 10px; background: #f4f4f4; border-left: 4px solid #ccc;">
          ${message}
        </blockquote>
        <p>Para completar tu registro, descarga la app o haz clic en el siguiente botón:</p>
        <a href="https://tu-app.com/registro" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Completar Registro
        </a>
      `,
    }),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } })
})