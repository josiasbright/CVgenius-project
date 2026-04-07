"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Mail, 
  Lock, 
  User,
  ShieldCheck,
  ArrowRight, 
  Cloud, 
  CheckCircle2, 
  UserPlus 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  // On récupère 'register' en plus de 'login' depuis le contexte
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Vérification de sécurité locale
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    
    try {
      console.log("Tentative d'inscription pour:", formData.email);

      // 2. ON CRÉE LE COMPTE (Appel au register du AuthContext)
      // On envoie bien le nom complet, l'email et le mot de passe
      await register(formData.fullName, formData.email, formData.password); 
      
      console.log("Compte créé et utilisateur connecté !");
      
      // 3. ON REDIRIGE
      navigate('/dashboard');
    } catch (error) {
      // On affiche l'erreur précise du serveur (ex: "Cet email est déjà utilisé")
      const errorMsg = error.response?.data?.message || "Erreur lors de l'inscription";
      console.error("Détails de l'erreur:", errorMsg);
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 md:p-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}
      </style>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-white rounded-[40px] flex flex-col lg:flex-row overflow-hidden min-h-[750px] shadow-xl border border-slate-100"
      >
        
        {/* --- SECTION GAUCHE (FORMULAIRE) --- */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-between bg-white">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-[800] tracking-tight text-slate-900 italic">CVGenius</span>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-[800] text-slate-900 mb-4 tracking-tight leading-tight">
              Rejoignez <br /><span className="text-indigo-600">l'aventure</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Créez votre compte pour booster votre carrière.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Nom Complet */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Nom complet"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-900 border border-slate-200 focus:border-indigo-500 outline-none transition-all"
                />
                <User className="absolute right-5 top-5 text-slate-400" size={18} />
              </div>

              {/* Email */}
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-900 border border-slate-200 focus:border-indigo-500 outline-none transition-all"
                />
                <Mail className="absolute right-5 top-5 text-slate-400" size={18} />
              </div>

              {/* Mot de passe */}
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-900 border border-slate-200 focus:border-indigo-500 outline-none transition-all"
                />
                <Lock className="absolute right-5 top-5 text-slate-400" size={18} />
              </div>

              {/* Confirmation */}
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-900 border border-slate-200 focus:border-indigo-500 outline-none transition-all"
                />
                <ShieldCheck className="absolute right-5 top-5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold text-sm px-1 py-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" required className="w-5 h-5 rounded-md accent-indigo-600 border-slate-300" />
                <span className="text-xs">J'accepte les conditions d'utilisation</span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20"
            >
              Créer mon compte <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 font-bold text-slate-400 text-sm">
            Déjà inscrit ? <Link to="/login" className="text-indigo-600 hover:underline underline-offset-4">Se connecter</Link>
          </div>
        </div>

        {/* --- SECTION DROITE --- */}
        <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center relative">
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 rounded-[35px] relative overflow-hidden flex items-center justify-center shadow-inner">
            <motion.div animate={{ x: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 6 }} className="absolute top-10 left-10 text-white/20"><Cloud size={100} fill="currentColor" /></motion.div>
            
            <motion.div 
              initial={{ y: 30, rotate: -5 }}
              animate={{ y: 0, rotate: 0 }}
              className="relative z-10 w-60 h-[420px] bg-slate-950 rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-6 border border-white/20"
            >
              <div className="w-12 h-1.5 bg-slate-800 rounded-full mb-12" />
              <div className="w-24 h-24 bg-fuchsia-500/20 rounded-full flex items-center justify-center mb-8 border border-fuchsia-400/30">
                <UserPlus size={48} className="text-fuchsia-300" />
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400" 
                />
              </div>
              <p className="text-[10px] font-bold text-fuchsia-300 tracking-widest uppercase opacity-60">Création du profil...</p>
            </motion.div>

            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-[15%] right-[20%] z-20 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
              <CheckCircle2 size={28} className="text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}