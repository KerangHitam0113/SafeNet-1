import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
    if (req.method !== "POST") {
        return new Response("Method not allowed", {
            status: 405
        });
    }

    const { name, message } = await req.json();

    if (
        typeof name !== "string" ||
        typeof message !== "string" ||
        name.length > 40 ||
        message.length > 600
    ) {
        return new Response("Invalid input", {
            status: 400
        });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");

    if (!apiKey) {
        return new Response("Email service not configured", {
            status: 503
        });
    }

    const response = await fetch(
        "https://api.resend.com/emails",
        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                from: "SafeNet Website <onboarding@resend.dev>",
                to: ["pluviophilefoxglove@gmail.com"],
                subject: "Respon baru dari SafeNet",

                text:
                    `Nama: ${name}\n\n` +
                    `Pendapat:\n${message}`
            })
        }
    );

    if (!response.ok) {
        return new Response("Email gagal dikirim", {
            status: 502
        });
    }

    return new Response(
        JSON.stringify({ success: true }),
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
});
