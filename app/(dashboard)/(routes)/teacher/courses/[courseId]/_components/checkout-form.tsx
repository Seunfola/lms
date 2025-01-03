'use client';
import { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import convertToSubCurrency from "@/lib/convertToSubcurrency";


const CheckoutForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [state, setState] = useState({
    clientSecret: null as string | null,
    errorMessage: null as string | null,
    loading: false,
  });

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: convertToSubCurrency(amount) }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent. Please try again.");
        }

        const { clientSecret: fetchedClientSecret } = await response.json();
        setState((prevState) => ({ ...prevState, clientSecret: fetchedClientSecret || null }));
      } catch (error: unknown) {
        setState((prevState) => ({
          ...prevState,
          errorMessage: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        }));
      }
    };

    fetchClientSecret();
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || !state.clientSecret) {
      Swal.fire("Error", "Payment initialization failed. Please refresh and try again.", "error");
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));

    const { error: submitError } = await elements.submit();

    if (submitError) {
      Swal.fire("Error", submitError.message || "An error occurred during submission.", "error");
      setState((prevState) => ({ ...prevState, loading: false }));
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: state.clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/success?amount=${amount}`,
      },
    });

    if (error) {
      Swal.fire("Payment Failed", error.message || "An error occurred during payment confirmation.", "error");
      setState((prevState) => ({ ...prevState, loading: false }));
      return;
    }

    Swal.fire("Success", "Your payment was successful!", "success");
    setState((prevState) => ({ ...prevState, loading: false }));
  };

  const { clientSecret, errorMessage, loading } = state;

  return (
    <div className="max-w-md h-screen mx-auto p-6 bg-gray-700 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
      {!stripe || !elements || !clientSecret ? (
        <div className="flex justify-center items-center h-40">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-blue-500" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border border-gray-300 rounded-lg">
            {clientSecret && <PaymentElement />}

            {errorMessage && (
              <div className="text-red-500 text-sm font-semibold mt-2">{errorMessage}</div>
            )}
          </div>
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-2 px-4 text-white rounded-lg font-semibold 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin size="lg" />
            ) : (
              `Pay $${amount}`
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
