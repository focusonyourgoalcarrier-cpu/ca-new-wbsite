# Piyush CA website: Supabase setup

The contact form posts to the `submit-enquiry` Supabase Edge Function. The function writes submissions into `public.contact_enquiries`. Row level security is enabled and browser roles have no table access. The function uses the Supabase secret key on the server only; never put that key in the website.

## Hosted project status

The **Piyush CA Website** project was created in the Mumbai region. The `contact_enquiries` table and migration are applied. The `submit-enquiry` Edge Function uses Supabase's `@supabase/server` SDK to validate the publishable key and writes with its server-side admin client. The website is configured with this project's URL and publishable key.

When the site has a production domain, set the function's `ALLOWED_ORIGIN` environment variable to that exact origin.

The publishable key is intended for browser use; the secret key is not. The secret key is never added to the website.

