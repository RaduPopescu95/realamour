import Stripe from "stripe";
import { NextResponse } from "next/server";

// Inițializează Stripe cu cheia secretă
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

// Definirea rutei GET pentru obținerea detaliilor abonamentului
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subscription_id = searchParams.get("subscription_id");

  try {
    // Obține detaliile abonamentului pe baza subscription_id
    const subscription = await stripe.subscriptions.retrieve(subscription_id);

    // Returnează abonamentul ca răspuns
    return NextResponse.json(subscription, { status: 200 });
  } catch (err) {
    // Returnează eroarea în caz de eșec
    return NextResponse.json(
      { error: "Failed to retrieve subscription details" },
      { status: 500 }
    );
  }
}
