"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, ArrowRight, Search, Clock } from 'lucide-react';
import cvService from '../services/cvService';

export default function SelectCvForLetterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // On récupère le template choisi à l'étape précédente
  const selectedTemplate = searchParams.get('template') || 'classique';
  
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        setLoading(true);
const data = await cvService.getAllCvs();  // ✅        // On s'assure de prendre la bonne clé selon ton backend (cvs ou userCvs)
        setCvs(data.cvs || data.userCvs || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des CV:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCvs();
  }, []);

  const handleCvSelection = (cvId) => {
    console.log(`🚀 CV sélectionné : ${cvId} | Template : ${selectedTemplate}`);
    // Redirection vers la page de création avec les deux paramètres
    navigate(`/letters/create?template=${selectedTemplate}&cvId=${cvId}`);
  };

  const filteredCvs = cvs.filter(cv => 
    cv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER --- */}
        <button 
          onClick={() => navigate('/letters/templates')} 
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8 transition-all"
        >
          <ChevronLeft size={16} /> Retour aux modèles
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Sur quel CV se baser ?</h1>
          <p className="text-slate-500 font-medium">Choisissez le CV dont nous extrairons vos expériences pour la lettre.</p>
        </div>

        {/* --- RECHERCHE --- */}
        <div className="mb-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher parmi vos CV..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 shadow-sm transition-all font-medium"
          />
        </div>

        {/* --- LISTE DES CV --- */}
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400 font-bold text-sm uppercase">Chargement de vos CV...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCvs.length > 0 ? (
              filteredCvs.map((cv) => (
                <motion.div 
                  key={cv.id}
                  whileHover={{ x: 10, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCvSelection(cv.id)}
                  className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer group hover:border-indigo-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-1">
                        {cv.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Clock size={12}/> {new Date(cv.updated_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span>{cv.cv_data?.personal_info?.job_title || 'Sans titre'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold">Aucun CV ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}