'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode'; // Make sure this is here!

export default function GenerateCertificate() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // THE MASTER STATE: Pre-filled with the exact Saipem/ICON demo data
  const [formData, setFormData] = useState({
    certificateNumber: 'ILRIL/SCNL/PSV/T7 BONNY/05/26/07',
    equipmentOwner: 'Saipem Contracting Nigeria Limited',
    calibrationDate: '2026-05-17',
    nextDueDate: '2027-05-16',
    location: 'T7 PROJECT NLNG BONNY SITE',
    
    equipmentName: 'PRESSURE SAFETY VALVE',
    manufacturer: 'RAJTECH',
    serialNumber: 'PSV 004',
    assetNumber: 'NOT SEEN',
    equipmentRange: '0-10 BAR',
    setPressure: '10 BAR',
    
    ambientTemperature: '30°C',
    refInstrumentMake: 'Ashcroft Test Gauge',
    refInstrumentModel: 'DPG224',
    refSerialNumber: '2831125818',
    refCalDate: '2025-12-14',
    refDueDate: '2026-12-13',
    
    displayStatus: 'Excellent',
    flangeStatus: 'Excellent',
    calibrationRemark: 'Ok',
    fitForUse: true,
  });

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (!auth) router.push('/');
    else setIsAuthorized(true);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Send data to backend
      const response = await fetch('http://localhost:5000/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Backend connection failed");

      // 2. Get Database ID
      const dbData = await response.json();
      const certificateId = dbData.id; 

      // 3. Generate QR Code for Verification URL
      const verificationUrl = `http://localhost:3000/verify/${certificateId}`;
      const qrImage = await QRCode.toDataURL(verificationUrl);
      console.log("Success! QR Code generated for:", verificationUrl);
      
      // 4. Open Demo PDF
      window.open('/demo-certificate.pdf', '_blank');

    } catch (error) {
      console.error("Error saving certificate:", error);
      alert("Note: Backend server is not running yet. PDF will not open.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthorized) return <div className="min-h-screen flex items-center justify-center">Verifying access...</div>;

  // The universal CSS string for all our inputs to fix the invisible text issue
  const inputCSS = "w-full p-2 border border-slate-300 rounded-md text-slate-900 bg-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Certificate Generator</h1>
            <p className="text-slate-500 mt-1">Review and finalize equipment details.</p>
          </div>
          <button onClick={() => { localStorage.removeItem('isAuthenticated'); router.push('/'); }} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border rounded-lg hover:bg-slate-100">
            Log Out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: Core Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">1. Core Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Number</label>
                <input type="text" name="certificateNumber" value={formData.certificateNumber} onChange={handleChange} className={inputCSS} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Equipment Owner</label>
                <input type="text" name="equipmentOwner" value={formData.equipmentOwner} onChange={handleChange} className={inputCSS} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputCSS} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cal Date</label>
                  <input type="date" name="calibrationDate" value={formData.calibrationDate} onChange={handleChange} className={inputCSS} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} className={inputCSS} required />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Equipment Specs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">2. Equipment Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Equipment Name</label>
                <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
                <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Number</label>
                <input type="text" name="assetNumber" value={formData.assetNumber} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Range</label>
                <input type="text" name="equipmentRange" value={formData.equipmentRange} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Set Pressure</label>
                <input type="text" name="setPressure" value={formData.setPressure} onChange={handleChange} className={inputCSS} />
              </div>
            </div>
          </div>

          {/* SECTION 3: Reference Instrument */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">3. Reference Instrument</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Make</label>
                <input type="text" name="refInstrumentMake" value={formData.refInstrumentMake} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <input type="text" name="refInstrumentModel" value={formData.refInstrumentModel} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
                <input type="text" name="refSerialNumber" value={formData.refSerialNumber} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ambient Temp</label>
                <input type="text" name="ambientTemperature" value={formData.ambientTemperature} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ref Cal Date</label>
                <input type="date" name="refCalDate" value={formData.refCalDate} onChange={handleChange} className={inputCSS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ref Due Date</label>
                <input type="date" name="refDueDate" value={formData.refDueDate} onChange={handleChange} className={inputCSS} />
              </div>
            </div>
          </div>

          {/* SECTION 4: Inspection Results */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">4. Inspection Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Status</label>
                <select name="displayStatus" value={formData.displayStatus} onChange={handleChange} className={inputCSS}>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Flange Integrity</label>
                <select name="flangeStatus" value={formData.flangeStatus} onChange={handleChange} className={inputCSS}>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Calibration Remark</label>
                <input type="text" name="calibrationRemark" value={formData.calibrationRemark} onChange={handleChange} className={inputCSS} />
              </div>
              <div className="md:col-span-3 flex items-center mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <input type="checkbox" name="fitForUse" checked={formData.fitForUse} onChange={handleChange} className="w-6 h-6 text-green-600 rounded cursor-pointer" />
                <label className="ml-3 text-lg font-bold text-green-800 cursor-pointer">CERTIFIED FIT FOR USE</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-12">
            <button type="submit" disabled={isLoading} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors text-lg w-full md:w-auto">
              {isLoading ? 'Processing...' : 'Generate Certificate'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}