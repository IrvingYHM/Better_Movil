import React, { useState } from 'react';
import { IonButton, IonInput, IonLabel, IonCard, IonCardContent, IonToast } from '@ionic/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
const stripePromise  = loadStripe('pk_test_51QF7CwP4u0AspHWqVkcLHlGObKirereYBP7bQJOetZ3Bgv1HQDXfCaEQBWM8cv3kvJ69rNvjdOwsMw4nzqgSxGhN00ik1ViWMd'); // Reemplaza con tu clave pública

import axios from 'axios';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data: { clientSecret } } = await axios.post('http://localhost:3000/crear-pago', {
      amount: 1000, // Monto en centavos (10 USD)
      currency: 'usd',
    });

    const cardElement = elements.getElement(CardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error("Error en el pago:", error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log("Pago exitoso!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || !elements}>
        Pagar
      </button>
    </form>
  );
};

export default Payment;
