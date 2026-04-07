"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

// ✅ Importation de tes images PNG avec tes noms de fichiers exacts
import imgClassique from '../assets/templates/lettres/lettreclassique.png';
import imgModerne from '../assets/templates/lettres/lettremoderne.png';

export default function LetterTemplateSelectionPage() {
  const navigate = useNavigate();

  const templates = [
    { 
      id: 'classique', 
      name: 'Style Classique', 
      desc: 'Une mise en page formelle et structurée, idéale pour les secteurs institutionnels.', 
      image: imgClassique 
    },
    { 
      id: 'moderne', 
      name: 'Style Moderne', 
      desc: 'Un design plus aéré et contemporain, parfait pour les startups et le digital.', 
      image: imgModerne 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Retour Dashboard
          </button>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Modèle de Lettre</h1>
          <p className="text-slate-500 font-medium">Sélectionnez le design qui accompagnera votre CV.</p>
        </div>

        {/* --- GRILLE DE TEMPLATES (2 COLONNES) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[40px] p-3 shadow-2xl shadow-indigo-100/50 border border-slate-100 group cursor-pointer"
              onClick={() => navigate(`/letters/select-cv?template=${template.id}`)}
            >
              {/* Conteneur Image PNG */}
              <div className="relative aspect-[1/1.3] rounded-[32px] overflow-hidden bg-white border border-slate-100 shadow-inner">
                <img 
                  src={template.image} 
                  alt={template.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay au Hover */}
                <div className="absolute inset-0 bg-indigo-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                        <CheckCircle2 size={32} className="text-white" />
                    </div>
                    <p className="font-black text-2xl mb-2">Sélectionner ce style</p>
                    <p className="text-indigo-100 font-medium tracking-tight">Cliquez pour personnaliser la lettre</p>
                </div>
              </div>

              {/* Infos Template */}
              <div className="p-8 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-[800] text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{template.desc}</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
                  <ArrowRight size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        
      </div>
    </div>
  );
}