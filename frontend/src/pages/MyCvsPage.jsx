"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Plus, Download, Eye, Trash2, Search, 
  Clock, Zap, Layout, Sparkles
} from 'lucide-react';
import cvService from '../services/cvService';

export default function MyCvsPage() {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const aestheticImages = [
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"
  ];

  useEffect(() => { loadCvs(); }, []);

  const loadCvs = async () => {
    try {
      setLoading(true);
      const data = await cvService.getAllCvs();
      setCvs(data.cvs || []);
    } catch (error) { 
      console.error('Erreur chargement CV:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer définitivement ce document ?')) return;
    try { 
      await cvService.deleteCv(id); 
      loadCvs(); 
    } catch (error) { 
      console.error('Erreur suppression:', error); 
    }
  };

  const handlePreview = async (id) => {
    try {
      const pdfBlob = await cvService.generatePdf(id);
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (error) { 
      alert('Impossible d\'afficher l\'aperçu');
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const pdfBlob = await cvService.generatePdf(id);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'mon-cv'}.pdf`;
      a.click();
    } catch (error) { 
      console.error('Erreur téléchargement:', error); 
    }
  };

  const filteredCvs = cvs.filter(cv => 
    cv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full shadow-lg shadow-blue-200"
        />
        <p className="mt-6 text-slate-500 font-bold tracking-tight">Accès à vos créations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-6 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Portfolio</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <Layout size={12}/> {cvs.length} Documents
                </span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Ma Bibliothèque <span className="text-blue-600">.</span>
            </h1>
          </div>
          
          <Link
  to="/cvs/templates"
            className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[24px] font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
>
  <Plus className="w-5 h-5" strokeWidth={3} /> Nouveau CV
</Link>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-12 relative max-w-xl">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Rechercher une création..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-16 pr-6 py-5 bg-white/60 backdrop-blur-xl border border-white rounded-[28px] focus:border-blue-500 focus:ring-0 outline-none transition-all font-semibold text-slate-700 shadow-xl shadow-slate-100/40" 
            />
          </div>
        </div>

        {/* GRID SECTION */}
        {cvs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredCvs.map((cv, index) => (
                <CvCard 
                  key={cv.id} 
                  cv={cv} 
                  image={aestheticImages[index % aestheticImages.length]}
                  onDelete={() => handleDelete(cv.id)} 
                  onDownload={() => handleDownload(cv.id, cv.title)}
                  onPreview={() => handlePreview(cv.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
function CvCard({ cv, onDelete, onDownload, onPreview, index }) {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ y: -15 }}
      // L'ombre est maintenant Indigo, ce qui fait ressortir la carte du fond gris
      className="relative bg-white rounded-[45px] p-1 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] group transition-all"
    >
      {/* --- BORDURE LUMINEUSE (Identité Visuelle Forte) --- */}
      <div className="absolute inset-0 rounded-[45px] p-[2px] bg-gradient-to-br from-indigo-500/20 via-transparent to-blue-500/20 group-hover:from-indigo-500 group-hover:to-blue-600 transition-all duration-500" />
      
      {/* CONTENU INTERNE */}
      <div className="relative bg-white rounded-[43px] overflow-hidden">
        
        {/* HEADER DE LA CARTE (L'aperçu stylisé) */}
        <div className="relative aspect-[4/5] m-2 rounded-[35px] overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
          
          {/* Background Dynamique (Aura de ta couleur principale) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent animate-pulse" />
          </div>

          {/* DOCUMENT HOLOGRAPHIQUE (Plus contrasté) */}
          <motion.div 
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            className="relative z-10 w-36 h-48 bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(79,70,229,0.2)] border border-indigo-50 flex flex-col p-5"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-indigo-100 rounded-full" />
              <div className="h-1.5 w-5/6 bg-slate-50 rounded-full" />
              <div className="pt-4 space-y-2">
                 <div className="h-1 w-full bg-slate-50 rounded-full" />
                 <div className="h-1 w-2/3 bg-slate-50 rounded-full" />
              </div>
            </div>
            
            {/* Ligne de scan "Laser Indigo" */}
            <motion.div 
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_10px_#4f46e5] opacity-50"
            />
          </motion.div>

          {/* ACTIONS AU SURVOL */}
          <div className="absolute inset-0 bg-indigo-950/5 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-30">
              <button onClick={onPreview} className="p-4 bg-white text-indigo-600 rounded-2xl shadow-xl hover:bg-indigo-50 transition-all">
                <Eye size={22} strokeWidth={2.5} />
              </button>
              <button onClick={onDownload} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
                <Download size={22} strokeWidth={2.5} />
              </button>
          </div>
        </div>

        {/* FOOTER (Identité textuelle) */}
        <div className="p-6 pt-2">
          <div className="flex justify-between items-center">
            <div className="max-w-[75%]">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 block">
                {cv.templateName?.split('-')[0] || 'Genius Design'}
              </span>
              <h3 className="text-xl font-black text-slate-900 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                {cv.title || "Projet IA"}
              </h3>
            </div>
            <button 
              onClick={onDelete} 
              className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
    return (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bg-white/40 backdrop-blur-md rounded-[50px] p-24 text-center border-2 border-dashed border-white/60 shadow-xl"
        >
            <div className="w-32 h-32 bg-blue-50/50 rounded-[40px] flex items-center justify-center mx-auto mb-10 rotate-3 border border-white">
                <FileText className="w-16 h-16 text-blue-200" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Aucun document trouvé.</h2>
            <p className="text-slate-500 font-medium text-xl max-w-sm mx-auto mb-12 leading-relaxed">
              Prêt à créer votre prochain chef-d'œuvre professionnel ?
            </p>
            <Link to="/cvs/templates" className="inline-flex items-center gap-4 px-12 py-6 bg-blue-600 text-white rounded-[30px] font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200/50 hover:-translate-y-1">
                Lancer le Builder <Zap size={20} fill="white" />
            </Link>
        </motion.div>
    );
}