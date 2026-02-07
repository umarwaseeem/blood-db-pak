import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const DISCORD_WEBHOOK_URL = Deno.env.get('DISCORD_WEBHOOK_URL')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
    try {
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // Get start of today (UTC)
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)
        const todayISO = today.toISOString()

        // Fetch counts
        const [donorsRes, requestsRes] = await Promise.all([
            supabase
                .from('donors')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', todayISO),
            supabase
                .from('blood_requests')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', todayISO)
        ])

        const donorCount = donorsRes.count || 0
        const requestCount = requestsRes.count || 0

        // Send to Discord
        await fetch(DISCORD_WEBHOOK_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "📊 Daily Impact Summary",
                    description: `Here is the activity for ${today.toLocaleDateString('en-GB')} (UTC)`,
                    color: 0x3b82f6, // Blue
                    fields: [
                        { name: "🆕 New Donors", value: `**${donorCount}**`, inline: true },
                        { name: "🩸 New Blood Requests", value: `**${requestCount}**`, inline: true }
                    ],
                    footer: { text: "Blood Donors Pakistan - Auto Summary" },
                    timestamp: new Date().toISOString()
                }]
            }),
        })

        return new Response("Summary sent", { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
