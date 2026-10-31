import { withSupabase } from "npm:@supabase/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, { status, headers: corsHeaders });

const handleEnquiry = withSupabase({ auth: "publishable" }, async (request, { supabaseAdmin }) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 12_000) return json({ error: "Request is too large" }, 413);

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const business = typeof payload.business === "string" ? payload.business.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const service = typeof payload.service === "string" ? payload.service.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || name.length > 150 || !email || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || business.length > 200 ||
      phone.length > 40 || service.length > 120 || message.length > 5000) {
    return json({ error: "Please check the enquiry details and try again" }, 400);
  }

  const { error } = await supabaseAdmin.from("contact_enquiries").insert({
    name, business: business || null, email, phone: phone || null,
    service: service || null, message: message || null,
  });

  if (error) {
    console.error("Could not save contact enquiry", error.message);
    return json({ error: "Could not save your enquiry" }, 500);
  }
  return json({ received: true }, 201);
});

export default {
  fetch: (request: Request) => request.method === "OPTIONS"
    ? new Response("ok", { headers: corsHeaders })
    : handleEnquiry(request),
};

