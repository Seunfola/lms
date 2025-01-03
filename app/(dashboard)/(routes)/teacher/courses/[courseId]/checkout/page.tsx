'use client';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import convertToSubCurrency from "@/lib/convertToSubcurrency";
import CheckoutForm from "../_components/checkout-form";

// Ensure the Stripe publishable key is provided
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.error("Error: Stripe publishable key is missing. Ensure it is set in the environment variables.");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");



export default function CheckoutPageComponent() {
  const searchParams = useSearchParams();
  const queryAmount = searchParams.get("amount");

  const [state, setState] = useState({
    amount: null as number | null,
    isClient: false,
  });

  useEffect(() => {
    setState((prevState) => ({ ...prevState, isClient: true }));

    if (queryAmount) {
      const parsedAmount = parseFloat(queryAmount as string);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setState((prevState) => ({ ...prevState, amount: parsedAmount }));
      } else {
        console.error("Error: Invalid or negative amount passed in query parameters.");
        setState((prevState) => ({ ...prevState, amount: null }));
      }
    } else {
      console.error("Error: No amount found in query parameters.");
      setState((prevState) => ({ ...prevState, amount: null }));
    }
  }, [queryAmount]);

  // Render error message if the amount is invalid
  if (state.amount === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div>Invalid or missing payment amount. Please verify your input and try again.</div>
      </div>
    );
  }

  // Render the checkout form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-lg p-6 bg-gray-700 rounded-lg shadow-lg">
        {state.isClient && (
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              currency: "usd",
              amount: convertToSubCurrency(state.amount), 
            }}
          >
            <CheckoutForm amount={state.amount} />
          </Elements>
        )}
      </div>
    </div>
  );
}
