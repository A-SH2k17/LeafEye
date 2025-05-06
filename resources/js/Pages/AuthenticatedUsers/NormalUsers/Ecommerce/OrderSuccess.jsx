import { useState } from 'react';
import { ChevronLeft, CheckCircle, CreditCard, Calendar, Lock } from 'lucide-react';
import { useLanguage } from '@/multilanguage';
import { useTranslation } from 'react-i18next';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/NonPrimitive/Footer';




// Success page component
export default function SuccessPage({ onCreditPage, onReturnToStore }) {
    //multilangiage code
    const { lang, handleChange, languages } = useLanguage();
    const { t } = useTranslation();
    
    return (
      <>
        <Head title='Order Success' />
        <AuthenticatedLayout lang={lang}>
          <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-50 rounded-full p-4">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-green-800 mb-2">Success</h2>
              <p className="text-gray-600 mb-8">Your order has been successfully placed</p>
              
              <div className="space-y-3">
                <button
                  onClick={onReturnToStore}
                  className="w-full bg-green-100 text-green-800 font-medium py-2 px-4 rounded hover:bg-green-200 transition-colors"
                >
                  Return To Store
                </button>
                
                <button
                  onClick={onCreditPage}
                  className="w-full bg-red-500 text-white font-medium py-2 px-4 rounded hover:bg-red-600 transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </AuthenticatedLayout>
      </>
    );
  }


