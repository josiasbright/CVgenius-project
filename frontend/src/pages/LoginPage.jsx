"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Mail, Lock, ArrowRight, Cloud, Fingerprint, 
  ChevronLeft, CheckCircle2, Sparkles 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import authService from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // États du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Gestion de la Connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard'); 
    } catch (error) {
      alert(error.response?.data?.message || "Identifiants incorrects");
    }
  };

  // Gestion du Mot de passe oublié
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await authService.forgotPassword(email);
      setMessageSent(true);
    } catch (error) {
      alert("Erreur : " + (error.response?.data?.message || "Impossible d'envoyer l'email"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-white rounded-[40px] flex flex-col lg:flex-row overflow-hidden min-h-[700px] shadow-2xl shadow-slate-200 border border-slate-100"
      >
        
        {/* --- SECTION GAUCHE --- */}
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-between bg-white relative">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">CVGenius</span>
          </div>

          <AnimatePresence mode="wait">
            {!isForgotPassword ? (
              // FORMULAIRE DE CONNEXION
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Content de vous revoir.</h1>
                <p className="text-slate-500 font-medium mb-10 text-lg">Accédez à vos documents et analyses IA.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder="votre@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-900 border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                      />
                      <Mail className="absolute right-5 top-5 text-slate-400" size={18} />
                    </div>
                    <div className="relative">
                      <input 
                        type="password" 
                        placeholder="Mot de passe"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-900 border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                      />
                      <Lock className="absolute right-5 top-5 text-slate-400" size={18} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-bold text-xs px-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-900 transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-indigo-600" />
                      <span>Rester connecté</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <button type="submit" className="w-full md:w-56 bg-slate-900 text-white p-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200">
                    Se connecter <ArrowRight size={20} />
                  </button>
                </form>
              </motion.div>
            ) : (
              // FORMULAIRE MOT DE PASSE OUBLIÉ
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button 
                  onClick={() => {setIsForgotPassword(false); setMessageSent(false);}}
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-6 transition-colors"
                >
                  <ChevronLeft size={18} /> Retour à la connexion
                </button>

                {!messageSent ? (
                  <>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Récupération.</h1>
                    <p className="text-slate-500 font-medium mb-10 text-lg">Entrez votre email pour recevoir un lien de réinitialisation.</p>

                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div className="relative">
                        <input 
                          type="email" 
                          placeholder="votre@email.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-4 bg-slate-50 rounded-2xl font-semibold text-slate-900 border border-slate-200 focus:border-indigo-600 outline-none transition-all"
                        />
                        <Mail className="absolute right-5 top-5 text-slate-400" size={18} />
                      </div>
                      <button type="submit" className="w-full md:w-64 bg-indigo-600 text-white p-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100">
                        Envoyer le lien <ArrowRight size={20} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[30px] text-center">
                    <CheckCircle2 className="text-emerald-500 mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-black text-slate-900 mb-2">Email envoyé !</h2>
                    <p className="text-slate-600 font-medium">Consultez votre boîte de réception pour réinitialiser votre mot de passe.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 font-bold text-slate-400 text-sm">
            Pas encore de compte ? <Link to="/register" className="text-indigo-600 hover:underline">S'inscrire gratuitement</Link>
          </div>
        </div>

        {/* --- SECTION DROITE --- */}
        <div className="flex-1 bg-slate-50 p-8 flex items-center justify-center relative">
           <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-[35px] relative overflow-hidden flex items-center justify-center shadow-inner">
               <motion.div 
                 initial={{ y: 20 }}
                 animate={{ y: 0 }}
                 className="relative z-10 w-64 h-[440px] bg-slate-950 rounded-[45px] shadow-2xl flex flex-col items-center justify-center p-8 border border-white/10"
               >
                 <div className="w-12 h-1.5 bg-slate-800 rounded-full mb-16" />
                 <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10">
                   <Fingerprint size={48} className="text-indigo-400" />
                 </div>
                 <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-4">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                    />
                 </div>
                 <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">Sécurisation...</p>
               </motion.div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}