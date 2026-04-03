'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Price from '@/components/Price';

interface ReceiptClientProps {
  transactionData: any;
  reference: string;
}

export default function VerifyReceiptClient({ transactionData, reference }: ReceiptClientProps) {
  const [downloading, setDownloading] = useState(false);

  // Fallbacks if data fails locally
  const USD_TO_GHS_RATE = 13.5;
  const amountPaid = transactionData ? ((transactionData.amount / 100) / USD_TO_GHS_RATE) : 0;
  const tDate = transactionData ? new Date(transactionData.paid_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pending';
  
  // Custom Metadata
  const metadata = transactionData?.metadata?.custom_fields || [];
  const extractMeta = (varName: string) => metadata.find((f: any) => f.variable_name === varName)?.value || '';

  const guestName = extractMeta('guest_name');
  const tourName = extractMeta('tour_name');
  const travelDate = extractMeta('travel_date');
  const passengers = extractMeta('passengers') || 1;
  const paymentOption = extractMeta('payment_option') === 'pay_deposit' ? 'DEPOSIT' : 'FULL PAYMENT';

  const downloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
       window.print();
       setDownloading(false);
    }, 500);
  };

  return (
    <>
    <style dangerouslySetInnerHTML={{__html: `
      @media print {
        body * {
          visibility: hidden;
        }
        #receipt-container, #receipt-container * {
          visibility: visible;
        }
        #receipt-container {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 100%;
          max-width: 800px;
          margin: 0;
          padding: 40px;
          border: none !important;
          box-shadow: none !important;
          background-color: #1A241B !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-hide {
           display: none !important;
        }
      }
    `}} />
    
    <div className="flex flex-col items-center justify-center w-full gap-8">
       <div 
         id="receipt-container"
         className="w-full max-w-2xl bg-[#1A241B] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl mt-4"
       >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none w-full flex justify-center">
             <img src="/logo.png" alt="" className="w-80 h-auto grayscale filter invert" />
          </div>
          
          <div className="relative z-10 flex flex-col gap-6 text-left">
             {/* Header */}
             <div className="flex justify-between items-start border-b border-white/10 pb-6">
                <div className="flex flex-col text-left">
                   <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">Status</span>
                   <span className="text-[#178548] font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#178548] animate-pulse" />
                     Payment Confirmed
                   </span>
                </div>
                <div className="flex flex-col items-end text-right">
                   <h2 className="text-2xl font-serif text-[#E8D3A2] leading-none">Roots & Rhythm</h2>
                   <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-medium mt-1">Official Itinerary Receipt</span>
                </div>
             </div>

             {/* Core Information Grid */}
             <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="flex flex-col">
                   <span className="text-[#B8860B] text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Name</span>
                   <span className="text-white text-base font-medium">{guestName || 'Valued Traveler'}</span>
                </div>
                <div className="flex flex-col items-end text-right">
                   <span className="text-[#B8860B] text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Transaction Ref</span>
                   <span className="text-white text-xs font-mono">{reference || 'Pending'}</span>
                </div>

                <div className="flex flex-col">
                   <span className="text-[#B8860B] text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Amount </span>
                   <Price amount={amountPaid} className="text-white text-lg font-serif" />
                </div>
                <div className="flex flex-col items-end text-right">
                   <span className="text-[#B8860B] text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Tier Config</span>
                   <span className="text-white text-xs font-bold uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full">{paymentOption}</span>
                </div>

                <div className="flex flex-col col-span-2 my-2 border-t border-white/5 pt-4 justify-center items-center">
                   <span className="text-[#B8860B] text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Expedition Package</span>
                   <span className="text-[#E8D3A2] text-xl font-serif">{tourName || 'Authentic Ghana Journey'}</span>
                </div>

                <div className="flex flex-col border-t border-white/5 pt-4 mt-2">
                   <span className="text-[#B8860B] text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Expedition Date</span>
                   <span className="text-white text-sm font-medium">{travelDate || 'TBD'}</span>
                </div>
                <div className="flex flex-col items-end text-right">
                   <span className="text-[#B8860B] text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Total Manifest</span>
                   <span className="text-white text-sm font-medium">{passengers} Guest(s)</span>
                </div>
             </div>

             <div className="mt-4 pt-6 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40 font-mono">
                <span>Timestamp: {tDate}</span>
                <span className="uppercase tracking-widest">Digital Ticket Validated</span>
             </div>
          </div>
       </div>

       <div className="flex items-center gap-4 w-full max-w-2xl px-2 print-hide">
          <button 
             onClick={downloadPDF} 
             disabled={downloading || !transactionData}
             className="flex-1 bg-[#FAFAF8] text-[#131A14] hover:bg-[#E8D3A2] py-4 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
             {downloading ? <Loader2 size={16} className="animate-spin text-[#131A14]" /> : <Download size={16} className="group-hover:-translate-y-1 transition-transform" />}
             Download Offline PDF
          </button>
       </div>
    </div>
    </>
  );
}
