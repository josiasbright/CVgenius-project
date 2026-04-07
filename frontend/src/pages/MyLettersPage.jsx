"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Calendar, 
  Search, 
  Clock, 
  Zap, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import letterService from '../services/letterService';

export default function MyLettersPage() {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLetters();
  }, []);

  const loadLetters = async () => {
    try {
      setLoading(true);
      const data = await letterService.getAllLetters();
      // ✅ CORRECTION : Le backend envoie 'coverLetters', pas 'letters'
      setLetters(data.coverLetters || []); 
    } catch (error) {
      console.error('Erreur chargement lettres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette lettre définitivement ?')) return;
    try {
      await letterService.deleteLetter(id);
      loadLetters();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const pdfBlob = await letterService.generatePdf(id);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pdf`;
      a.click();
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  // ✅ NOUVELLE FONCTION : Aperçu comme pour les CVs
  const handlePreview = async (id) => {
    try {
      const pdfBlob = await letterService.generatePdf(id);
      const url = window.URL.createObjectURL(pdfBlob);
      // Ouvrir le PDF dans un nouvel onglet
      window.open(url, '_blank');
    } catch (error) { 
      console.error('Erreur preview:', error); 
      alert('Impossible d\'afficher l\'aperçu de la lettre');
    }
  };

  const filteredLetters = letters.filter(letter => 
    letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.target_company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-500 font-bold">Récupération de vos lettres...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4 transition-colors"
            >
              <ChevronLeft size={16} /> Retour Dashboard
            </button>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Mes Lettres</h1>
            <p className="text-slate-500 font-medium">Vos lettres de motivation optimisées par l'IA.</p>
          </div>
          <Link
            to="/letters/templates"
            className="flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[24px] font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
            Nouvelle Lettre
          </Link>
        </div>

        {/* --- RECHERCHE --- */}
        <div className="mb-10 relative max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une entreprise ou un titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-medium shadow-sm"
          />
        </div>

        {/* --- GRID --- */}
        {letters.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] p-20 text-center shadow-2xl shadow-indigo-100/50 border border-slate-100"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
                <Mail className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Aucune lettre rédigée</h2>
            <p className="text-slate-500 font-medium mb-10 text-lg max-w-md mx-auto">
                Transformez vos CV en lettres de motivation percutantes en quelques secondes.
            </p>
            <Link to="/letters/templates">
              <button className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-3xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl">
                Créer ma première lettre
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredLetters.map((letter, index) => (
                <LetterCard
                  key={letter.id}
                  letter={letter}
                  index={index}
                  onDelete={() => handleDelete(letter.id)}
                  onDownload={() => handleDownload(letter.id, letter.title)}
                  onPreview={() => handlePreview(letter.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function LetterCard({ letter, index, onDelete, onDownload, onPreview }) {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ y: -15 }}
      className="relative bg-white rounded-[45px] p-1 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] group transition-all"
    >
      {/* BORDURE LUMINEUSE */}
      <div className="absolute inset-0 rounded-[45px] p-[2px] bg-gradient-to-br from-indigo-500/20 via-transparent to-blue-500/20 group-hover:from-indigo-500 group-hover:to-blue-600 transition-all duration-500" />

      {/* CONTENU INTERNE */}
      <div className="relative bg-white rounded-[43px] overflow-hidden">

        {/* APERÇU */}
        <div className="relative aspect-[4/5] m-2 rounded-[35px] overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">

          {/* Aura au survol */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent animate-pulse" />
          </div>

          {/* DOCUMENT LETTRE */}
          <motion.div
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            className="relative z-10 w-36 h-48 bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(79,70,229,0.2)] border border-indigo-50 flex flex-col p-5"
          >
            {/* Icône Mail */}
            <div className="w-8 h-8 bg-indigo-600 rounded-lg mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Mail size={16} className="text-white" />
            </div>

            {/* Simulation lignes de lettre */}
            <div className="space-y-2">
              <div className="h-1.5 w-3/4 bg-indigo-100 rounded-full" />
              <div className="pt-2 space-y-1.5">
                <div className="h-1 w-full bg-slate-100 rounded-full" />
                <div className="h-1 w-full bg-slate-100 rounded-full" />
                <div className="h-1 w-5/6 bg-slate-100 rounded-full" />
                <div className="h-1 w-full bg-slate-100 rounded-full" />
                <div className="h-1 w-4/6 bg-slate-100 rounded-full" />
              </div>
              <div className="pt-2 space-y-1.5">
                <div className="h-1 w-full bg-slate-50 rounded-full" />
                <div className="h-1 w-2/3 bg-slate-50 rounded-full" />
              </div>
            </div>

            {/* Ligne de scan laser */}
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

        {/* FOOTER */}
        <div className="p-6 pt-2">
          <div className="flex justify-between items-center">
            <div className="max-w-[75%]">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 block">
                {letter.target_company || 'Lettre de motivation'}
              </span>
              <h3 className="text-xl font-black text-slate-900 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                {letter.title || "Lettre sans titre"}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                <Clock size={10} /> {formatDate(letter.updated_at)}
              </p>
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