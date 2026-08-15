'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MockCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams.get('amount') || '0';
  const currency = searchParams.get('currency') || 'USD';
  const error = searchParams.get('error');

  const [status, setStatus] = useState<'pending' | 'success'>('pending');

  const handleSimulatePayment = () => {
    setStatus('success');
    setTimeout(() => {
      router.push('/wallet');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 max-w-md w-full text-center shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Secure Payment Gateway</h1>
        
        {error ? (
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-sm">
            Note: The external payment gateway is currently down or rate-limited. You are viewing the fallback mock checkout page for testing purposes.
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm">
            Test Mode: You are viewing the mock checkout page.
          </div>
        )}

        <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
          <p className="text-gray-400 text-sm mb-1">Total Amount to Pay</p>
          <p className="text-4xl font-bold text-white">
            ${amount} <span className="text-lg text-gray-500">{currency}</span>
          </p>
        </div>

        {status === 'pending' ? (
          <button
            onClick={handleSimulatePayment}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Simulate Successful Payment
          </button>
        ) : (
          <div className="w-full bg-emerald-500/20 text-emerald-400 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Payment Successful! Redirecting...
          </div>
        )}
        
        <button
          onClick={() => router.push('/wallet')}
          className="w-full mt-4 bg-transparent hover:bg-gray-700 text-gray-400 font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Cancel and Return
        </button>
      </div>
    </div>
  );
}
