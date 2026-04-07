"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  FileText, 
  ChevronLeft,
  ArrowRight,
  Zap
} from 'lucide-react';
import axios from 'axios';

export default function CvScoringPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/cv-score/analyze',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error('Erreur analyse:', error);
      alert("Une erreur est survenue lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreInfo = (score) => {
    if (score >= 80) return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Excellent' };
    if (score >= 60) return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Améliorable' };
    return { color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', label: 'Critique' };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* --- HEADER --- */}
              <div className="text-center mb-16">
                
                <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
                  Score <span className="text-indigo-600">ATS</span> 
                </h1>
                <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                  Découvrez instantanément comment les algorithmes de recrutement perçoivent votre profil.
                </p>
              </div>

              {/* --- FORMULAIRE D'UPLOAD --- */}
              <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl shadow-indigo-100/50 border border-slate-100">
                <form onSubmit={handleSubmit}>
                  <div className="border-4 border-dashed border-slate-100 rounded-[30px] p-16 text-center group hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      id="file-upload"
                    />
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <Upload className="text-indigo-600" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-3">
                      Déposez votre CV ici
                    </h3>
                    <p className="text-slate-400 font-medium mb-8">
                      Formats acceptés : PDF, DOCX (Max 5Mo)
                    </p>
                    
                    {file && (
                      <div className="inline-flex items-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg animate-bounce">
                        <FileText size={18} /> {file.name}
                      </div>
                    )}
                  </div>

                  {file && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[25px] font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 disabled:opacity-50"
                    >
                      {loading ? (
                          <>
                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Analyse en cours...
                          </>
                      ) : (
                          <>
                            Lancer l'audit <ArrowRight size={24} />
                          </>
                      )}
                    </button>
                  )}
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* --- RÉSULTATS --- */}
              <button 
                onClick={() => { setResult(null); setFile(null); }}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors mb-4"
              >
                <ChevronLeft size={18} /> Analyser un autre document
              </button>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Score Card */}
                <div className="lg:col-span-1 bg-white rounded-[40px] p-10 shadow-2xl shadow-indigo-100 border border-slate-100 text-center flex flex-col justify-center">
                  <div className="relative w-40 h-40 mx-auto mb-8">
                     <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-slate-100 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50"/>
                        <motion.circle 
                          initial={{ pathLength: 0 }} 
                          animate={{ pathLength: result.score / 100 }} 
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`${getScoreInfo(result.score).color} stroke-current`} 
                          strokeWidth="8" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50"
                        />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-5xl font-black text-slate-900">{result.score}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">sur 100</span>
                     </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Score Global</h2>
                  <span className={`inline-block px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest ${getScoreInfo(result.score).bg} ${getScoreInfo(result.score).color} border ${getScoreInfo(result.score).border}`}>
                    {getScoreInfo(result.score).label}
                  </span>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Points Forts */}
                  <div className="bg-white rounded-[35px] p-8 shadow-xl shadow-indigo-100/30 border border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <TrendingUp className="text-emerald-500" size={18} /> Points d'Excellence
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {result.strengths.map((str, i) => (
                        <div key={i} className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                          <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
                          <span className="text-sm font-bold text-slate-700">{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Points Faibles */}
                  {result.weaknesses?.length > 0 && (
                    <div className="bg-white rounded-[35px] p-8 shadow-xl shadow-indigo-100/30 border border-slate-100">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <AlertCircle className="text-rose-500" size={18} /> Zones de Risque
                      </h3>
                      <div className="space-y-3">
                        {result.weaknesses.map((weak, i) => (
                          <div key={i} className="flex items-center gap-3 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                            <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">!</div>
                            <span className="text-sm font-bold text-slate-700">{weak}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommandations  */}
              <div className="bg-slate-900 rounded-[40px] p-10 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Target size={120} />
                </div>
                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                  <Lightbulb size={20} />  
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-[25px] border border-white/10 flex items-start gap-4 hover:bg-white/10 transition-all">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0 font-bold">
                        {i + 1}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed font-medium">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">
                
            </p>
        </div>
      </div>
    </div>
  );
}