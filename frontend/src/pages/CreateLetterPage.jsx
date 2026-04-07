"use client";

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Building2, Briefcase, Type, Info, Zap, ChevronRight } from 'lucide-react';
import letterService from '../services/letterService'; 

export default function CreateLetterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const cvId = searchParams.get('cvId');
  const templateName = searchParams.get('template') || 'classique';

  const [formData, setFormData] = useState({
    title: 'Ma Lettre de Motivation',
    targetCompany: '',
    targetPosition: '',
    companyType: 'pme',
    jobOfferText: '',
    templateName: templateName
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.targetCompany || !formData.targetPosition) return alert("Remplissez l'entreprise et le poste.");

    setLoading(true);
    try {
      // ✅ Envoi au backend (createFromCv gère le cas sans offre d'emploi)
      await letterService.createFromCv(cvId, formData);
      navigate('/letters'); 
    } catch (error) {
      alert('Erreur lors de la génération. Vérifiez votre backend.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[100] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/letters/select-cv')} className="p-2 text-slate-400 hover:text-indigo-600 transition-all"><ArrowLeft /></button>
          <input className="font-black text-slate-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-500/10 rounded px-2 w-64" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2">
          <Zap size={18} fill="currentColor"/> {loading ? 'Rédaction...' : 'Générer la Lettre'}
        </button>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-6">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Rédigez votre lettre</h1>
          <p className="text-slate-500 font-medium">Ciblez une entreprise pour obtenir un texte sur-mesure.</p>
        </div>

        <div className="space-y-8">
          <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8"><Building2 className="text-indigo-600" /><h2 className="text-xl font-black text-slate-900">L'entreprise visée</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Nom de l'entreprise" value={formData.targetCompany} onChange={(v) => setFormData({...formData, targetCompany: v})} placeholder="ex: KEO Tech" />
              <FormInput label="Poste" value={formData.targetPosition} onChange={(v) => setFormData({...formData, targetPosition: v})} placeholder="ex: Développeur React" icon={<Briefcase size={16}/>} />
            </div>
            <div className="mt-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Type d'entreprise</label>
              <div className="flex gap-3">
                {['startup', 'pme', 'grande_entreprise'].map(type => (
                  <button key={type} onClick={() => setFormData({...formData, companyType: type})} className={`px-6 py-3 rounded-2xl font-bold text-xs capitalize border transition-all ${formData.companyType === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'}`}>{type.replace('_', ' ')}</button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3"><Sparkles className="text-amber-500" /><h2 className="text-xl font-black text-slate-900">Annonce (Optionnel)</h2></div>
              <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-400 uppercase">Spontanée possible</span>
            </div>
            <div className="bg-amber-50/50 p-4 rounded-2xl mb-6 flex gap-3 border border-amber-100">
               <Info size={18} className="text-amber-600 shrink-0" />
               <p className="text-xs text-amber-800 font-medium leading-relaxed">Collez l'offre d'emploi ici pour une personnalisation IA parfaite. Laissez vide pour une candidature spontanée.</p>
            </div>
            <textarea rows="6" placeholder="Copiez l'annonce ici..." value={formData.jobOfferText} onChange={(e) => setFormData({...formData, jobOfferText: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:bg-white focus:border-indigo-600 transition-all font-medium text-sm leading-relaxed" />
          </section>

          <button onClick={handleSubmit} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[28px] font-black text-xl shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3">
            {loading ? 'Traitement par CVGenius...' : 'Finaliser ma lettre'} <ChevronRight />
          </button>
        </div>
      </main>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, icon }) {
  return (
    <div className="w-full">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
      <div className="relative">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 shadow-sm" />
        {icon && <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
      </div>
    </div>
  );
}