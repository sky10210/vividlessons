// Deliberately disabled until Stripe, verified webhooks, D1, and paid-content protection are configured.
export async function onRequestPost() {
  return Response.json(
    { error: "Checkout is not available yet. No payment was taken." },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}
export async function onRequestGet() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
