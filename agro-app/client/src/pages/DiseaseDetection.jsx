// import React from 'react';
// import { useAnalyzeImageMutation } from '../features/imaging/imageApi';
// import useTranslation from '../hooks/useTranslation';

// export default function DiseaseDetection() {
//   const t = useTranslation();
//   const [file, setFile] = React.useState(null);
//   const [preview, setPreview] = React.useState(null);
//   const [crop, setCrop] = React.useState('');
//   const [districtId, setDistrictId] = React.useState('');
//   const [analyze, { data, isLoading, error, reset }] = useAnalyzeImageMutation();

//   const onPick = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setFile(f);
//     setPreview(URL.createObjectURL(f));
//     reset();
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;
//     await analyze({ file, crop, districtId });
//   };

//   const detections = React.useMemo(() => {
//     if (!data?.detections) return [];
//     return Array.isArray(data.detections) ? data.detections : [data.detections];
//   }, [data]);

//   return (
//     <div className="max-w-7xl mx-auto px-4">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-blue-50 to-teal-100 p-10 md:p-16 mb-12 shadow-lg">
//         <div className="absolute -top-28 -right-28 w-96 h-96 bg-emerald-300/30 blur-3xl rounded-full animate-pulse-custom" />
//         <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-blue-300/30 blur-3xl rounded-full animate-pulse-custom" />

//         <div className="relative grid md:grid-cols-2 gap-10 items-center">
//           <div className="space-y-5 animate-slideIn">
//             <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
//               <span className="bg-gradient-to-r from-emerald-600 to-blue-700 bg-clip-text text-transparent">
//                 🔍 {t('diseaseDetection')}
//               </span>
//             </h1>
//             <p className="text-gray-700 leading-relaxed text-lg">
//               {t('dd_intro') || t('uploadSoilLeaf')}
//             </p>
//             <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow p-5 border border-emerald-100">
//               <h3 className="font-medium text-gray-800 mb-2">{t('dd_tips') || 'Tips for best results:'}</h3>
//               <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
//                 <li>{t('dd_hint_clear_leaf') || 'Use a clear, close image of the affected leaf'}</li>
//                 <li>{t('dd_hint_single_leaf') || 'Prefer a single leaf in frame to reduce noise'}</li>
//                 <li>{t('dd_hint_good_light') || 'Shoot in natural light without heavy shadows'}</li>
//               </ul>
//             </div>
//           </div>

//           {/* Upload Form */}
//           <div className="relative">
//             <div className="rounded-3xl border bg-white/80 backdrop-blur-xl p-8 shadow-2xl animate-fadeIn">
//               <form onSubmit={onSubmit} className="space-y-6">
//                 {/* Inputs */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('cropLabel')}</label>
//                     <input
//                       value={crop}
//                       onChange={(e) => setCrop(e.target.value)}
//                       className="form-input w-full p-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-emerald-500"
//                       placeholder="e.g., Tomato, Wheat"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">{t('district')}</label>
//                     <input
//                       value={districtId}
//                       onChange={(e) => setDistrictId(e.target.value)}
//                       className="form-input w-full p-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-emerald-500"
//                       placeholder="UP-XYZ or name"
//                     />
//                   </div>
//                 </div>

//                 {/* File Upload + Preview */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <label className="block">
//                     <span className="block text-sm font-semibold text-gray-700 mb-2">{t('uploadSoilLeaf')}</span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       capture="environment"
//                       onChange={onPick}
//                       className="block w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
//                     />
//                     <p className="text-xs text-gray-500 mt-2">
//                       {t('dd_camera_hint') || 'Uses device camera on mobile; otherwise choose a file.'}
//                     </p>
//                   </label>

//                   <div className="relative border-2 border-dashed rounded-2xl overflow-hidden bg-gray-50 min-h-48 flex items-center justify-center">
//                     {preview ? (
//                       <img src={preview} alt="preview" className="max-h-56 object-contain rounded-xl" />
//                     ) : (
//                       <span className="text-gray-400 text-sm">{t('dd_no_image') || 'No image selected'}</span>
//                     )}
//                     {isLoading && (
//                       <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500"></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Submit */}
//                 <button
//                   type="submit"
//                   className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
//                   disabled={isLoading || !file}
//                 >
//                   {isLoading ? t('analyzing') : (t('analyzePhoto') || 'Analyze Image')}
//                 </button>

//                 {/* Error */}
//                 {error && (
//                   <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-lg text-sm">
//                     {t('dd_error') || 'Failed to analyze. Please try another photo.'}
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Results Section */}
//       {data && (
//         <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
//           {/* Diagnosis */}
//           <div className="lg:col-span-2 rounded-3xl border bg-white shadow-lg p-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('dd_results') || 'Results'}</h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-gray-50 p-5 rounded-xl border">
//                 <div className="text-sm text-gray-500 uppercase">{t('dd_disease') || 'Disease'}</div>
//                 <div className="text-lg font-semibold text-emerald-700">
//                   {detections?.disease || t('dd_unknown') || 'Unknown'}
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   {t('dd_confidence') || 'Confidence'}: {((detections?.confidence ?? 0) * 100).toFixed(1)}%
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-5 rounded-xl border">
//                 <div className="text-sm text-gray-500 uppercase">{t('cropLabel')}</div>
//                 <div className="text-lg font-semibold">{data?.crop || crop || '-'}</div>
//               </div>
//               <div className="bg-gray-50 p-5 rounded-xl border">
//                 <div className="text-sm text-gray-500 uppercase">{t('dd_model') || 'Model'}</div>
//                 <div className="text-lg font-semibold">{data?.model?.name} {data?.model?.version ? `v${data.model.version}` : ''}</div>
//               </div>
//             </div>

//             {data?.advice?.summary && (
//               <div className="mt-8">
//                 <h3 className="font-semibold text-lg mb-3">{t('dd_summary') || 'Summary'}</h3>
//                 <p className="text-gray-700 leading-relaxed">{data.advice.summary}</p>
//               </div>
//             )}

//             {detections.length > 1 && (
//               <details className="mt-6 bg-gray-50 p-4 rounded-xl border cursor-pointer">
//                 <summary className="font-medium text-gray-700">{t('dd_other_possible') || 'Other possible diseases'}</summary>
//                 <ul className="list-disc pl-6 mt-3 space-y-1 text-sm text-gray-600">
//                   {detections.slice(1).map((d, i) => (
//                     <li key={i}>{d.disease} — {((d.confidence ?? 0) * 100).toFixed(1)}%</li>
//                   ))}
//                 </ul>
//               </details>
//             )}
//           </div>

//           {/* Recommendations */}
//           <div className="rounded-3xl border bg-white shadow-lg p-8">
//             <h3 className="text-xl font-semibold text-gray-800 mb-5">{t('dd_actions') || 'What to do next'}</h3>

//             <div className="space-y-6">
//               <div className="rounded-xl p-5 bg-emerald-50 border border-emerald-200">
//                 <div className="font-medium text-emerald-800 mb-2">{t('dd_fertilizers') || 'Recommended fertilizers'}</div>
//                 {Array.isArray(data?.advice?.fertilizers) && data.advice.fertilizers.length > 0 ? (
//                   <ul className="list-disc pl-5 space-y-1 text-sm text-emerald-900">
//                     {data.advice.fertilizers.map((f, i) => <li key={i}>{f}</li>)}
//                   </ul>
//                 ) : (
//                   <div className="text-sm text-emerald-700">{t('dd_check_local') || 'Check local advisory for product availability.'}</div>
//                 )}
//               </div>

//               <div className="rounded-xl p-5 bg-amber-50 border border-amber-200">
//                 <div className="font-medium text-amber-800 mb-2">{t('dd_home_remedies') || 'Natural/home remedies'}</div>
//                 {Array.isArray(data?.advice?.homeRemedies) && data.advice.homeRemedies.length > 0 ? (
//                   <ul className="list-disc pl-5 space-y-1 text-sm text-amber-900">
//                     {data.advice.homeRemedies.map((h, i) => <li key={i}>{h}</li>)}
//                   </ul>
//                 ) : (
//                   <div className="text-sm text-amber-800">{t('dd_basic_hygiene') || 'Remove affected leaves and improve airflow.'}</div>
//                 )}
//               </div>

//               <div className="rounded-xl p-5 bg-blue-50 border border-blue-200">
//                 <div className="font-medium text-blue-800 mb-2">{t('dd_followup') || 'Follow-up'}</div>
//                 <ul className="list-disc pl-5 space-y-1 text-sm text-blue-900">
//                   <li>{t('dd_followup_retake') || 'Retake a photo after 5–7 days to track progress.'}</li>
//                   <li>{t('dd_followup_isolate') || 'Isolate heavily diseased plants to prevent spread.'}</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }
import React, { useState, useMemo } from 'react';
import { Camera, Upload, MapPin, Leaf, AlertCircle, CheckCircle, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { useAnalyzeImageMutation } from '../features/imaging/imageApi';
import useTranslation from '../hooks/useTranslation';

export default function DiseaseDetection() {
  const t = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [provider, setProvider] = useState('groq');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [analyze, { data, isLoading, error, reset }] = useAnalyzeImageMutation();

  // Get user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(f.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }
    
    // Validate file size (10MB)
    if (f.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    setFile(f);
    setPreview(URL.createObjectURL(f));
    reset();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    const payload = {
      file,
      crop,
      district,
      state,
      provider,
      ...(location.latitude && { latitude: location.latitude }),
      ...(location.longitude && { longitude: location.longitude })
    };
    
    await analyze(payload);
   

  };
  console.log(data?.data)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {t('diseaseDetection')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('dd_intro')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('cropLabel')}
                  </label>
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Tomato, Wheat, Rice"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('district')}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your district"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('state')}
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    AI Provider
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="groq">Groq (Recommended)</option>
                    <option value="gemini">Google Gemini</option>
                    {/* <option value="huggingface">Hugging Face</option> */} 
                    {/* some backend issue need to be resolve we can integrate but later */}
                  </select>
                </div>
              </div>

              {/* Location Services */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {location.latitude ? 'Location captured' : 'Location not set'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={getLocation}
                  className="px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
                >
                  Get Location
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('uploadSoilLeaf')}
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                  {preview ? (
                    <div className="space-y-4">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                          reset();
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-green-600 font-semibold hover:text-green-700">
                            Choose an image
                          </span>
                          <span className="text-gray-500"> or drag and drop</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={onPick}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        JPEG, PNG, WebP up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!file || isLoading}
                className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('analyzing')}
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    {t('analyzePhoto')}
                  </>
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    {t('dd_error')}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {data?.data && (
              <>
                {/* Status Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Analysis Status
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(data.status)}
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {data?.data?.status}
                      </span>
                    </div>
                  </div>
                  
                  {data?.data?.detection && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Disease</div>
                        <div className="font-semibold text-gray-900">
                          {data?.data?.detection.disease}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">Confidence</div>
                        <div className="font-semibold text-gray-900">
                          {data?.data?.confidence}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {data?.data?.detection?.severity && (
                    <div className="mt-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(data?.data?.detection.severity)}`}>
                        Severity: {data?.data?.detection.severity.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {data?.data?.recommendations && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      {t('dd_actions')}
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Treatments */}
                      {data?.data?.recommendations.treatment && data?.data?.recommendations.treatment.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {t('dd_treatments')}
                          </h4>
                          <div className="space-y-3">
                            {data?.data?.recommendations.treatment.map((treatment, i) => (
                              <div key={i} className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="font-medium text-red-800">
                                    {treatment.method}
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    treatment.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    treatment.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {treatment.priority} priority
                                  </span>
                                </div>
                                <p className="text-red-700 text-sm">
                                  {treatment.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fertilizers */}
                      {data?.data?.recommendations.fertilizers && data?.data?.recommendations.fertilizers.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {t('dd_fertilizers')}
                          </h4>
                          <div className="grid gap-2">
                            {data?.data?.recommendations.fertilizers.map((fertilizer, i) => (
                              <div key={i} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <span className="text-green-800 text-sm font-medium">
                                  {fertilizer}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Home Remedies */}
                      {data?.data?.recommendations.homeRemedies && data?.data?.recommendations.homeRemedies.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            {t('dd_home_remedies')}
                          </h4>
                          <div className="grid gap-2">
                            {data?.data?.recommendations.homeRemedies.map((remedy, i) => (
                              <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <span className="text-amber-800 text-sm">
                                  {remedy}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prevention */}
                      {data?.data?.recommendations.preventiveMeasures && data?.data?.recommendations.preventiveMeasures.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {t('dd_prevention')}
                          </h4>
                          <div className="grid gap-2">
                            {data?.data?.recommendations.preventiveMeasures.map((measure, i) => (
                              <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <span className="text-blue-800 text-sm">
                                  {measure}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Loading State */}
            {isLoading && !data?.data && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analyzing Your Plant
                </h3>
                <p className="text-gray-600">
                  Our AI is examining the image for disease detection...
                </p>
              </div>
            )}

            {/* Welcome State */}
            {!data?.data && !isLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-600">
                  Upload a plant image to get started with disease detection and treatment recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}