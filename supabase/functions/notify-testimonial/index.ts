// supabase/functions/notify-testimonial/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DISCORD_WEBHOOK_URL = Deno.env.get('DISCORD_WEBHOOK_URL')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const APPROVE_SECRET = Deno.env.get('APPROVE_SECRET')

serve(async (req) => {
  try {
    const { record } = await req.json()
    const approveUrl = `${SUPABASE_URL}/functions/v1/approve-testimonial?id=${record.id}&secret=${APPROVE_SECRET}`

    await fetch(DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: "🆕 New Testimonial for Review",
          color: 0xef4444,
          fields: [
            { name: "From", value: record.full_name, inline: true },
            { name: "Message", value: record.message },
            { 
              name: "Moderation", 
              value: `\n[**✅ APPROVE TESTIMONIAL**](${approveUrl})\n*Clicking this will make the story live instantly.*` 
            }
          ],
          thumbnail: record.image_url ? { url: record.image_url } : null,
          timestamp: new Date().toISOString()
        }]
      }),
    })

    return new Response("OK", { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})