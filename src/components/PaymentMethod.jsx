"use client"
import React, { useState } from 'react';

function PaymentMethod({ onPaymentSelect }) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSelection = (method) => {
    setSelectedMethod(method);
    onPaymentSelect(method);
  };

  return (
    <section className='w-full h-[80vh] items-center flex flex-col gap-10 justify-center'>
      <div className={`shadow-xl border rounded-lg p-10 w-1/3 flex justify-between items-center ${selectedMethod === 'mastercard' ? 'border-blue-500' : ''}`} onClick={() => handleSelection('mastercard')}>
        <div className='flex items-center gap-2'>
          <svg width="40" height="40" fill="currentColor" className="bi bi-credit-card" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
            <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
          </svg>
          <p>MasterCard</p>
        </div>
        <input
          id="radio-mastercard"
          type="radio"
          name="payment-method"
          checked={selectedMethod === 'mastercard'}
          onChange={() => handleSelection('mastercard')}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      <div className={`shadow-xl border rounded-lg p-10 w-1/3 flex justify-between items-center ${selectedMethod === 'visa' ? 'border-blue-500' : ''}`} onClick={() => handleSelection('visa')}>
        <div className='flex items-center gap-2'>
          <svg width="40" height="40" fill="currentColor" className="bi bi-credit-card-2-front" viewBox="0 0 16 16">
            <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
            <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5" />
          </svg>
          <p>Visa Card</p>
        </div>
        <input
          id="radio-visa"
          type="radio"
          name="payment-method"
          checked={selectedMethod === 'visa'}
          onChange={() => handleSelection('visa')}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

    </section>
  );
}

export default PaymentMethod;