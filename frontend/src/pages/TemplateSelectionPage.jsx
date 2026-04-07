"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react';

// ✅ Importation de tes images .webp
import imgLorna from '../assets/templates/lorna.webp';
import imgThomas from '../assets/templates/thomas.webp';
import imgAlfred from '../assets/templates/alfred.webp';
import imgBenjamin from '../assets/templates/benjamin.webp';
import imgSebastian from '../assets/templates/sebastian.webp';
import imgModern from '../assets/templates/modern.webp';

export default function TemplateSelectionPage() {
  const navigate = useNavigate();

  const templates = [
    { id: 'lorna-style', name: 'Lorna', desc: 'Minimaliste & Colonnes', image: imgLorna },
    { id: 'thomas-style', name: 'Thomas', desc: 'Moderne & Couleurs', image: imgThomas },
    { id: 'alfred-style', name: 'Alfred', desc: 'Classique & Sobre', image: imgAlfred },
    { id: 'benjamin-style', name: 'Benjamin', desc: 'Créatif & Graphique', image: imgBenjamin },
    { id: 'sebastian-style', name: 'Sebastian', desc: 'Épuré & Timeline', image: imgSebastian },
{ id: 'sacha-style', name: 'Sacha', desc: 'Tech & Iconique', image: imgModern },  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4 transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Retour Dashboard
          </button>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Choisir un Style</h1>
          <p className="text-slate-500 font-medium">Sélectionnez la mise en page idéale pour votre prochain poste.</p>
        </div>

        {/* Grille de Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[40px] p-2 shadow-2xl shadow-indigo-100/50 border border-slate-100 group cursor-pointer"
              onClick={() => navigate(`/cvs/create?template=${template.id}`)}
            >
              {/* Box Image */}
              <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100">
                <img 
                  src={template.image} 
                  alt={template.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy" // ✅ Optimisation pour le chargement
                />

                {/* Overlay au Hover */}
                <div className="absolute inset-0 bg-indigo-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white p-8">
                    <CheckCircle2 size={48} className="mb-4 scale-50 group-hover:scale-100 transition-transform duration-500" />
                    <p className="font-black text-xl mb-2">Sélectionner</p>
                    <p className="text-sm text-indigo-100 text-center font-medium tracking-tight">Cliquer pour utiliser ce style</p>
                </div>
              </div>

              {/* Titre et Info */}
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{template.name}</h3>
                  <p className="text-sm text-slate-400 font-medium">{template.desc}</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}