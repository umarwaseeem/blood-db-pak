import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const APPROVE_SECRET = Deno.env.get('APPROVE_SECRET') || 'change-me-to-something-secure'

serve(async (req) => {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const secret = url.searchParams.get('secret')

    if (secret !== APPROVE_SECRET) {
        return new Response('Unauthorized', { status: 401 })
    }

    if (!id) {
        return new Response('Missing ID', { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', id)

    if (error) {
        return new Response(`Error: ${error.message}`, { status: 500 })
    }

    return new Response(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8fafc;">
        <div style="text-align: center; background: white; padding: 40px; border-radius: 20px; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h1 style="color: #10b981;">Approved!</h1>
          <p style="color: #64748b;">The testimonial is now live on the website.</p>
          <p style="font-size: 40px;">✅</p>
        </div>
      </body>
    </html>
  `, {
        headers: { 'Content-Type': 'text/html' },
        status: 200
    })
})
