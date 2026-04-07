"use client";

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, User, Briefcase, Mail, Phone, MapPin, Globe, 
  GraduationCap, Code, Globe2, Heart, Plus, Trash2, 
  ChevronRight, ChevronLeft, Zap, ListChecks, Upload, ImageIcon, Users
} from 'lucide-react';
import cvService from '../services/cvService';

// 1️⃣ MAPPING PRÉCIS
const TEMPLATE_CAPABILITIES = {
  'alfred-style': { photo: true, summary: false, web: true, langs: true, hobbies: true, skills: true, refs: false, hobbyType: 'simple' },
  'thomas-style': { photo: true, summary: true, web: true, langs: false, hobbies: true, skills: false, refs: false, hobbyType: 'category' },
  'benjamin-style': { photo: true, summary: true, web: false, langs: true, hobbies: false, skills: true, refs: false, hobbyType: 'simple' },
  'lorna-style': { photo: false, summary: true, web: true, langs: true, hobbies: false, skills: true, refs: true, skillField: 'softwareSkills' },
  'sebastian-style': { photo: false, summary: true, web: false, langs: false, hobbies: false, skills: true, refs: false },
  'sacha-style': { photo: true, summary: false, web: false, langs: true, hobbies: true, skills: true, refs: false, hobbyType: 'simple' },
};

const LANGUAGE_LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Courant", "Maternel"];
const COMMON_LANGUAGES = ["Français", "Anglais", "Espagnol", "Allemand", "Chinois", "Arabe", "Portugais", "Italien", "Russe"];

// Suggestions de métiers pour l'auto-complétion
const JOB_SUGGESTIONS = [
  "Développeur Full-Stack", "Développeur Front-End", "Développeur Back-End", 
  "Designer UX/UI", "Data Scientist", "Gestionnaire de Projet", 
  "Commercial", "Comptable", "Assistant Administratif", "Infirmier", "Ingénieur Civil"
];

export default function CreateCvPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedTemplate = searchParams.get('template') || 'thomas-style';
  const can = TEMPLATE_CAPABILITIES[selectedTemplate] || TEMPLATE_CAPABILITIES['thomas-style'];

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: 'Mon CV Professionnel',
    templateName: selectedTemplate,
    cvData: {
      personal_info: { first_name: '', last_name: '', job_title: '', email: '', phone: '', address: '', website: '', photo_url: '', summary: '' },
      experiences: [], education: [], skills: [], languages: [], hobbies: [], references: []
    }
  });

  // --- LOGIQUE DE NAVIGATION ---
  const availableSteps = [
    { id: 1, label: "Infos", show: true },
    { id: 2, label: "Expériences", show: true },
    { id: 3, label: "Formation & Skills", show: true },
    { id: 4, label: "Finitions", show: (can.langs || can.hobbies || can.refs) }
  ].filter(s => s.show);

  const currentIdx = availableSteps.findIndex(s => s.id === step);
  const isLastStep = currentIdx === availableSteps.length - 1;

  const handleNext = () => !isLastStep && setStep(availableSteps[currentIdx + 1].id);
  const handlePrev = () => currentIdx > 0 && setStep(availableSteps[currentIdx - 1].id);

  // --- HANDLERS ---
  const updatePersonalInfo = (f, v) => setFormData(p => ({...p, cvData: {...p.cvData, personal_info: {...p.cvData.personal_info, [f]: v}}}));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updatePersonalInfo('photo_url', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const updateArrayItem = (collection, index, field, value) => {
    const newList = [...formData.cvData[collection]];
    newList[index][field] = value;
    setFormData({...formData, cvData: {...formData.cvData, [collection]: newList}});
  };

  const removeArrayItem = (collection, index) => {
    setFormData(p => ({...p, cvData: {...p.cvData, [collection]: p.cvData[collection].filter((_, i) => i !== index)}}));
  };

  // ✅ LOGIQUE SKILLS : Accepter virgules ou entrée
  const handleSkillsChange = (e) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newSkills = value.split(',').map(s => s.trim()).filter(s => s !== "");
      setFormData(p => ({...p, cvData: {...p.cvData, skills: [...p.cvData.skills, ...newSkills]}}));
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const finalData = JSON.parse(JSON.stringify(formData));
    
    finalData.cvData.experiences = finalData.cvData.experiences.map(exp => ({
      ...exp,
      years: `${exp.start_date} - ${exp.end_date || 'Présent'}`,
      tasks: exp.missionRaw ? exp.missionRaw.split('\n').filter(l => l.trim() !== '') : [],
      description: exp.missionRaw || ''
    }));

    finalData.cvData.education = finalData.cvData.education.map(edu => ({
      ...edu,
      years: `${edu.start_date} - ${edu.end_date || 'Présent'}`
    }));

    if (can.skillField === 'softwareSkills') {
      finalData.cvData.softwareSkills = finalData.cvData.skills;
    }

    try {
      await cvService.createCv(finalData);
      navigate('/cvs');
    } catch (e) { alert('Erreur de sauvegarde'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* DATALIST POUR LES SUGGESTIONS DE MÉTIERS */}
      <datalist id="jobs-list">
        {JOB_SUGGESTIONS.map(job => <option key={job} value={job} />)}
      </datalist>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-[100] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/cvs')} className="p-2 text-slate-400 hover:text-indigo-600"><ArrowLeft /></button>
          <div>
            <input className="text-xl font-black text-slate-900 bg-transparent outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Modèle : {selectedTemplate.replace('-style', '')}</p>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xl">
          {loading ? 'Enregistrement...' : 'Terminer'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto pt-10 px-6">
        <div className="mb-10 bg-white p-6 rounded-[32px] border border-slate-200">
          <StepIndicator current={step} steps={availableSteps} />
        </div>

        <AnimatePresence mode="wait">
          {/* ÉTAPE 1 : INFOS */}
          {step === 1 && (
            <FormSection key="step1" title="Coordonnées" icon={<User size={20}/>}>
              {can.photo && (
                <div className="mb-10 flex flex-col items-center">
                  <div className="relative group w-32 h-32 mb-4">
                    <div className="w-full h-full rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center">
                      {formData.cvData.personal_info.photo_url ? (
                        <img src={formData.cvData.personal_info.photo_url} className="w-full h-full object-cover" alt="Avatar" />
                      ) : <ImageIcon size={32} className="text-slate-300" />}
                    </div>
                    <button onClick={() => document.getElementById('p-up').click()} className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-xl shadow-xl hover:bg-indigo-600 transition-all"><Upload size={16}/></button>
                  </div>
                  <input id="p-up" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Prénom" value={formData.cvData.personal_info.first_name} onChange={v => updatePersonalInfo('first_name', v)} />
                <FormInput label="Nom" value={formData.cvData.personal_info.last_name} onChange={v => updatePersonalInfo('last_name', v)} />
                
                {/* ✅ CHAMP MÉTIER AVEC SUGGESTIONS */}
                <div className="md:col-span-2">
                   <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Titre du CV / Poste visé</label>
                   <input list="jobs-list" type="text" value={formData.cvData.personal_info.job_title} onChange={e => updatePersonalInfo('job_title', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-semibold text-slate-700" placeholder="Ex: Développeur Full-Stack" />
                </div>

                <FormInput label="Email" value={formData.cvData.personal_info.email} onChange={v => updatePersonalInfo('email', v)} />
                <FormInput label="Téléphone" value={formData.cvData.personal_info.phone} onChange={v => updatePersonalInfo('phone', v)} />
                <FormInput label="Adresse" value={formData.cvData.personal_info.address} onChange={v => updatePersonalInfo('address', v)} />
                {can.web && <FormInput label="Site Web / Portfolio" value={formData.cvData.personal_info.website} onChange={v => updatePersonalInfo('website', v)} />}
                {can.summary && <FormTextArea label="Profil / Résumé" value={formData.cvData.personal_info.summary} onChange={v => updatePersonalInfo('summary', v)} />}
              </div>
            </FormSection>
          )}

          {/* ÉTAPE 2 : EXPERIENCES */}
          {step === 2 && (
            <FormSection key="step2" title="Expériences" icon={<Briefcase size={20}/>}>
              {formData.cvData.experiences.map((exp, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-200 mb-6 relative">
                  <button onClick={() => removeArrayItem('experiences', i)} className="absolute top-6 right-6 text-rose-400"><Trash2 size={20}/></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Poste" value={exp.position} onChange={v => updateArrayItem('experiences', i, 'position', v)} />
                    <FormInput label="Entreprise" value={exp.company} onChange={v => updateArrayItem('experiences', i, 'company', v)} />
                    
                    {/* ✅ DATES AVEC CALENDRIER (TYPE MONTH) */}
                    <FormInput label="Début" type="month" value={exp.start_date} onChange={v => updateArrayItem('experiences', i, 'start_date', v)} />
                    <FormInput label="Fin" type="month" value={exp.end_date} onChange={v => updateArrayItem('experiences', i, 'end_date', v)} placeholder="Laissez vide si présent" />
                    
                    <div className="md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block flex items-center gap-2"><ListChecks size={14}/> Missions (une par ligne)</label>
                       <textarea className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-medium" rows="4" value={exp.missionRaw || ''} onChange={e => updateArrayItem('experiences', i, 'missionRaw', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <AddButton label="Ajouter une expérience" onClick={() => setFormData(p => ({...p, cvData: {...p.cvData, experiences: [...p.cvData.experiences, {position:'', company:'', start_date:'', end_date:'', missionRaw:''}]}}))} />
            </FormSection>
          )}

          {/* ÉTAPE 3 : EDUCATION & SKILLS */}
          {step === 3 && (
            <div className="space-y-10">
              <FormSection title="Formation" icon={<GraduationCap size={20}/>}>
                {formData.cvData.education.map((edu, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-[24px] border border-slate-200 mb-4 relative">
                    <button onClick={() => removeArrayItem('education', i)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput label="Diplôme" value={edu.degree} onChange={v => updateArrayItem('education', i, 'degree', v)} />
                      <FormInput label="École" value={edu.institution} onChange={v => updateArrayItem('education', i, 'institution', v)} />
                      
                      {/* ✅ DATES AVEC CALENDRIER */}
                      <FormInput label="Début" type="month" value={edu.start_date} onChange={v => updateArrayItem('education', i, 'start_date', v)} />
                      <FormInput label="Fin" type="month" value={edu.end_date} onChange={v => updateArrayItem('education', i, 'end_date', v)} />
                    </div>
                  </div>
                ))}
                <AddButton label="Ajouter un diplôme" onClick={() => setFormData(p => ({...p, cvData: {...p.cvData, education: [...p.cvData.education, {degree:'', institution:'', start_date:'', end_date:''}]}}))} />
              </FormSection>

              {can.skills && (
                <FormSection title="Compétences" icon={<Code size={20}/>}>
                  {/* ✅ LOGIQUE SKILLS : AJOUT EN MASSE PAR VIRGULE */}
                  <input 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-semibold" 
                    placeholder="Saisissez vos compétences séparées par des virgules (ex: React, Node, Git)" 
                    onChange={handleSkillsChange}
                    onKeyDown={e => {
                      if(e.key === 'Enter' && e.target.value) {
                        setFormData(p => ({...p, cvData: {...p.cvData, skills: [...p.cvData.skills, e.target.value]}})); e.target.value = '';
                      }
                    }} 
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.cvData.skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-2">
                        {s} <button onClick={() => setFormData(p => ({...p, cvData: {...p.cvData, skills: p.cvData.skills.filter((_, idx) => idx !== i)}}))}><Trash2 size={10}/></button>
                      </span>
                    ))}
                  </div>
                </FormSection>
              )}
            </div>
          )}

          {/* ÉTAPE 4 : LANGUES (ALIGNÉES) */}
          {step === 4 && (
            <div className="space-y-10">
              {can.langs && (
                <FormSection title="Langues" icon={<Globe2 size={20}/>}>
                  {formData.cvData.languages.map((l, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-4 mb-4 items-center bg-slate-50 p-6 rounded-[24px] relative border border-slate-100">
                      
                      {/* ✅ SELECT POUR LANGUE */}
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Langue</label>
                        <select className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none font-semibold text-slate-700 shadow-sm" value={l.name} onChange={e => updateArrayItem('languages', i, 'name', e.target.value)}>
                          <option value="">Choisir une langue...</option>
                          {COMMON_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                        </select>
                      </div>

                      {/* ✅ SELECT POUR NIVEAU (ALIGNÉ) */}
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 px-1">Niveau</label>
                        <select className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none font-semibold text-slate-700 shadow-sm" value={l.level} onChange={e => updateArrayItem('languages', i, 'level', e.target.value)}>
                          {LANGUAGE_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                      </div>

                      <button onClick={() => removeArrayItem('languages', i)} className="mt-6 md:mt-0 p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={20}/></button>
                    </div>
                  ))}
                  <AddButton label="Ajouter une langue" onClick={() => setFormData(p => ({...p, cvData: {...p.cvData, languages: [...p.cvData.languages, {name:'', level:'Intermédiaire'}]}}))} />
                </FormSection>
              )}

              {/* ... Hobbies et Références inchangés ... */}
              {can.hobbies && (
                <FormSection title="Centres d'intérêt" icon={<Heart size={20}/>}>
                   {can.hobbyType === 'category' ? (
                     <>
                      {formData.cvData.hobbies.map((h, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-3xl mb-4 relative">
                          <button onClick={() => removeArrayItem('hobbies', i)} className="absolute top-4 right-4 text-rose-400"><Trash2 size={16}/></button>
                          <FormInput label="Catégorie (ex: Sport)" value={h.category} onChange={v => updateArrayItem('hobbies', i, 'category', v)} />
                          <FormInput label="Éléments (ex: Basket, Foot)" value={h.items} onChange={v => updateArrayItem('hobbies', i, 'items', v)} />
                        </div>
                      ))}
                      <AddButton label="Ajouter une catégorie" onClick={() => setFormData(p => ({...p, cvData: {...p.cvData, hobbies: [...p.cvData.hobbies, {category:'', items:''}]}}))} />
                     </>
                   ) : (
                     <>
                      <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-semibold" placeholder="Loisir + Entrée" onKeyDown={e => {
                        if(e.key === 'Enter' && e.target.value) {
                          setFormData(p => ({...p, cvData: {...p.cvData, hobbies: [...p.cvData.hobbies, {name: e.target.value}]}})); e.target.value = '';
                        }
                      }} />
                      <div className="flex flex-wrap gap-2 mt-4">
                        {formData.cvData.hobbies.map((h, i) => <span key={i} className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold">{h.name}</span>)}
                      </div>
                     </>
                   )}
                </FormSection>
              )}
            </div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-between">
          <button onClick={handlePrev} className={`px-8 py-4 font-bold text-slate-400 ${currentIdx === 0 ? 'invisible' : ''}`}><ChevronLeft className="inline mr-2"/> Précédent</button>
          <button onClick={isLastStep ? handleSubmit : handleNext} className="px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3">
            {isLastStep ? <><Zap size={18} fill="currentColor" className="text-indigo-400"/> Finaliser</> : <>Suivant <ChevronRight size={18}/></>}
          </button>
        </div>
      </main>
    </div>
  );
}

// ✅ COMPOSANT INPUT AMÉLIORÉ POUR LES DATES
function FormInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="w-full mb-4">
      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
      <input 
        type={type} 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-semibold text-slate-700" 
      />
    </div>
  );
}

function FormSection({ title, icon, children }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-sm">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">{icon}</div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function FormTextArea({ label, value, onChange }) {
  return (
    <div className="w-full md:col-span-2">
      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
      <textarea rows="4" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 resize-none font-semibold text-slate-700" />
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button onClick={onClick} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:bg-slate-50 transition-all">+ {label}</button>
  );
}

function StepIndicator({ current, steps }) {
  return (
    <div className="flex justify-between w-full px-4 overflow-x-auto gap-4">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3 shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${current === s.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
          <span className={`text-[11px] font-black uppercase tracking-widest hidden lg:block ${current === s.id ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
          {i < steps.length - 1 && <div className="h-px bg-slate-100 w-8 hidden md:block" />}
        </div>
      ))}
    </div>
  );
}