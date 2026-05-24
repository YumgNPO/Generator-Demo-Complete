'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function VerifyCertificate() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [certData, setCertData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Hitting the backend API using the ID from the URL
        const response = await fetch(`http://localhost:5000/api/certificates/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Certificate not found or server is offline.');
        }

        const databaseRecord = await response.json();
        setCertData(databaseRecord);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to authenticate record. Please ensure the backend server is running and the ID is valid.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, [params.id]);

  // STATE 1: Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Authenticating Record...</h2>
        <p className="text-slate-500 text-center max-w-xs">Querying secure database for ID: {params.id}</p>
      </div>
    );
  }

  // STATE 2: Error / Not Found
  if (error || !certData) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 text-4xl">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Authentication Failed</h2>
        <p className="text-slate-500 text-center max-w-xs">{error}</p>
      </div>
    );
  }

  // STATE 3: Success (The A4 Document)
  return (
    <div className="min-h-screen bg-slate-200 py-8 px-2 md:px-8 font-sans text-black">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl min-h-[1056px] relative overflow-hidden border border-gray-300">
        
        {/* Top Branding & Verified Stamp */}
        <div className="pt-16 px-12 flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-blue-900 tracking-wider mb-2">ICON</h1>
            <p className="text-xs font-bold uppercase text-slate-700 max-w-sm leading-relaxed">
              Icon Lifting & Rigging Inspections Limited<br/>
              <span className="text-[10px] font-normal">Lifting and Rigging Inspections, NDT Inspections, Certification of Lifting equipment</span>
            </p>
          </div>

          <div className="flex flex-col items-end">
             <div className="border-4 border-green-600 rounded-lg px-6 py-2 rotate-[12deg] shadow-sm bg-green-50/50 mt-4">
                <p className="text-green-700 font-black text-2xl tracking-widest text-center uppercase">VERIFIED</p>
                <p className="text-green-800 font-bold text-[10px] text-center tracking-widest border-t-2 border-green-600 pt-1 mt-1">
                  SECURE DIGITAL RECORD
                </p>
             </div>
             <p className="text-[9px] text-slate-400 mt-6 mr-4 font-mono">ID: {params.id}</p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-widest underline underline-offset-8">Test Certificate</h2>
        </div>

        {/* Dynamic Data Grid */}
        <div className="px-16 space-y-4 text-sm font-medium">
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Certificate Number:</span>
            <span className="font-bold text-base">{certData.certificateNumber || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Equipment Owner:</span>
            <span className="font-bold">{certData.equipmentOwner || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Equipment:</span>
            <span className="font-bold">{certData.equipmentName || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Manufacturer:</span>
            <span className="font-bold">{certData.manufacturer || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Serial Number:</span>
            <span className="font-bold">{certData.serialNumber || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Environmental Conditions:</span>
            <span className="font-bold">{certData.ambientTemperature || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Calibration Date:</span>
            <span className="font-bold">{certData.calibrationDate || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Next Due Date:</span>
            <span className="font-bold">{certData.nextDueDate || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] items-baseline">
            <span className="text-slate-600">Location:</span>
            <span className="font-bold">{certData.location || 'N/A'}</span>
          </div>
        </div>

        {/* Dynamic Standard Instrument Table */}
        <div className="px-16 mt-12">
          <p className="text-xs font-bold italic mb-4">STANDARD INSTRUMENT USED:</p>
          <table className="w-full text-sm border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 p-2 text-left">DESCRIPTION/MAKE</th>
                <th className="border border-slate-400 p-2 text-left">SERIAL NO</th>
                <th className="border border-slate-400 p-2 text-left">CALIBRATION DATE</th>
                <th className="border border-slate-400 p-2 text-left">DUE DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-400 p-2">{certData.refInstrumentMake || 'N/A'}</td>
                <td className="border border-slate-400 p-2">{certData.refSerialNumber || 'N/A'}</td>
                <td className="border border-slate-400 p-2">{certData.refCalDate || 'N/A'}</td>
                <td className="border border-slate-400 p-2">{certData.refDueDate || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-16 mt-12">
          <p className="text-sm">
            <span className="font-bold italic">Remark: </span>
            Icon Lifting & Rigging Inspections Limited certifies that the pressure gauge meets the rating specification and is certified <span className="font-bold">FIT</span> for use.
          </p>
        </div>

      </div>
    </div>
  );
}