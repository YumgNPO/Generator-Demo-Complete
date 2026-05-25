'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function VerificationPage() {
  const params = useParams();
  const [certificate, setCertificate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the certificate data from your mock server using the ID in the URL
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certificates/${params.id}`);
        if (!response.ok) {
          throw new Error('Certificate not found or invalid.');
        }
        const data = await response.json();
        setCertificate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCertificate();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-600 font-medium">Verifying certificate...</p>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h2>
          <p className="text-slate-600">{error || "This certificate ID does not exist in our records."}</p>
        </div>
      </div>
    );
  }

  // Tailwind CSS classes for the table rows to keep it DRY
  const rowCss = "py-4 flex flex-col sm:flex-row sm:items-center border-b border-slate-100 last:border-0";
  const labelCss = "text-xs font-bold text-slate-500 uppercase tracking-wider w-full sm:w-1/3 mb-1 sm:mb-0";
  const valueCss = "text-sm font-semibold text-slate-900 w-full sm:w-2/3";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Certificate Verification</h1>
        <p className="text-slate-500 text-sm">Scan the QR code on the certificate or enter the Certificate ID to verify.</p>
      </div>

      {/* Verification Status Badge */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-green-600">Certificate Verified</h2>
          <p className="text-slate-600 text-sm max-w-md">
            This certificate is valid and has been issued by <br className="hidden sm:block"/>
            <span className="font-bold text-slate-800">ICON Lifting & Rigging Inspections Limited.</span>
          </p>
        </div>
      </div>

      {/* Main Data Card */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6">
        <div className="p-8">
          
          <div className={rowCss}>
            <div className={labelCss}>Certificate NO</div>
            <div className={valueCss}>{certificate.certificateNumber}</div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Equipment Holder / Company</div>
            <div className={valueCss}>{certificate.equipmentOwner}</div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Equipment</div>
            <div className={valueCss}>{certificate.equipmentName}</div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Manufacturer</div>
            <div className={valueCss}>{certificate.manufacturer}</div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Serial Number</div>
            <div className={valueCss}>{certificate.serialNumber}</div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Environmental Conditions</div>
            <div className={valueCss}>{certificate.ambientTemp}</div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Status</div>
            <div className={valueCss}>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wide bg-green-50 text-green-700 border border-green-200">
                VALID
              </span>
            </div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Calibration Date</div>
            <div className={valueCss}>{certificate.calibrationDate}</div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Expiry Date</div>
            <div className={valueCss}>{certificate.nextDueDate}</div>
          </div>

          <div className={rowCss}>
            <div className={labelCss}>Location</div>
            <div className={valueCss}>{certificate.location}</div>
          </div>

        </div>

        {/* Support Banner inside card */}
        <div className="bg-green-50/50 border-t border-green-100 p-6 flex gap-4">
          <div className="text-green-600 mt-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            This certificate is issued in accordance with ICON Lifting & Rigging Inspections Limited standards. 
            For any inquiries, please contact us at <a href="mailto:icon.inspections@yahoo.com" className="font-bold text-blue-600 hover:underline">icon.inspections@yahoo.com</a> or <span className="font-bold">+234 803 310 3530</span>.
          </p>
        </div>
      </div>

      {/* Footer Official Page Banner (Removed the right side button) */}
      <div className="w-full max-w-3xl bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-indigo-900">This is an official verification page.</h3>
          <p className="text-xs text-indigo-700 mt-0.5">All certificates can be verified by scanning the QR code displayed on the original certificate.</p>
        </div>
      </div>

    </div>
  );
}