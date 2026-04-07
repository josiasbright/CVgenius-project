"use client";

import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Target, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  Cpu,
  Mail,
  Mic,
  BarChart3,
  Users,
  Trophy,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PremiumHomePage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-violet-500/30" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* --- IMPORT DE LA POLICE INTER --- */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}
      </style>

      {/* --- EFFETS LUMINEUX --- */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-xl z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CV<span className="text-violet-500">Genius</span></span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition">Connexion</Link>
            <Link to="/register" className="bg-white text-black px-7 py-2.5 rounded-full font-bold text-sm hover:bg-violet-600 hover:text-white transition-all shadow-xl shadow-white/5">
              Essai Gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-48 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-black uppercase tracking-[0.2em] mb-10">
              <Sparkles size={14} className="animate-pulse" /> Certifié Recrutement 2026
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]">
              Ne postulez plus. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">Soyez choisi.</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              CVGenius n'est pas qu'un éditeur. C'est un moteur d'optimisation de carrière pour aligner votre profil sur les attentes des recruteurs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register">
                <button className="px-10 py-5 bg-violet-600 text-white rounded-full font-bold text-lg hover:bg-violet-700 transition-all shadow-2xl shadow-violet-600/20 flex items-center gap-3 group">
                  Bâtir mon CV <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              {/* MODIFICATION ICI : Ajout du Link vers /login */}
              <Link to="/login">
                <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-3">
                  Rapport ATS Gratuit <Target size={20} />
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
            <div className="relative z-10 p-2 bg-gradient-to-b from-white/15 to-transparent rounded-[40px] shadow-2xl border border-white/10 backdrop-blur-sm">
              <div className="rounded-[32px] overflow-hidden border border-white/5 bg-[#0F1219] aspect-video">
                 <img 
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" 
                    alt="CVGenius Aesthetic Preview" 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700" 
                 />
              </div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-6 -right-6 z-20 bg-white text-black px-6 py-3 rounded-2xl shadow-2xl font-black text-sm flex items-center gap-3"
            >
              <Users size={18} className="text-violet-600" /> 15,000+ UTILISATEURS
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* --- STATISTIQUES --- */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatBox value="15.4k" label="Membres Actifs" />
            <StatBox value="45k+" label="CV Optimisés" />
            <StatBox value="94%" label="Taux d'embauche" />
            <StatBox value="98/100" label="Score ATS Moyen" />
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
              Une technologie <br /><span className="text-violet-500">sans compromis.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Nous avons déconstruit le processus de recrutement pour vous donner un avantage technologique décisif.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<FileText size={26} className="text-violet-400" />}
              title="Générateur CV"
              desc="Notre IA analyse l'offre et réécrit vos compétences pour correspondre aux attentes réelles."
            />
            <FeatureCard 
              icon={<Mail size={26} className="text-fuchsia-400" />}
              title="Lettre IA"
              desc="Des structures optimisées pour la lecture humaine et algorithmique instantanée."
            />
            <FeatureCard 
              icon={<Mic size={26} className="text-emerald-400" />}
              title="Entretien Vocale"
              desc="Pratiquez avec notre coach vocal sur des scénarios spécifiques à votre secteur."
            />
            <FeatureCard 
              icon={<BarChart3 size={26} className="text-indigo-400" />}
              title="Analyse ATS"
              desc="Testez votre compatibilité avec les algorithmes du Fortune 500."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 bg-[#080A0F]">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <Zap className="mx-auto mb-8 text-violet-500/40" size={32} />
           <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600">
             © 2026 CVGENIUS — THE FUTURE OF RECRUITMENT
           </p>
        </div>
      </footer>
    </div>
  );
}

// --- SOUS-COMPOSANTS (INCHANGÉS) ---
function StatBox({ value, label }) {
  return (
    <div className="space-y-2">
      <p className="text-5xl font-black tracking-tighter text-white">{value}</p>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -8, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      className="p-10 rounded-[35px] border border-white/5 bg-white/[0.03] transition-all"
    >
      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8">
        {icon}
      </div>
      <h3 className="text-lg font-black mb-4 uppercase tracking-tight">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}