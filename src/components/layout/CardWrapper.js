import CardInput from "@/components/layout/CardInput"
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "../css/Card.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export default function CardWrapper({cartProducts}) {
    const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({cartProducts}),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div id="payment-container" className="flex justify-center">
      <div className="grow">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CardInput />
            </Elements>
          )}
      </div>
    </div>
  );
}