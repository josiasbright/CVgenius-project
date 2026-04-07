"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, FileText, Search, LayoutDashboard, Settings, LogOut, 
  History, Star, Zap, ChevronRight, 
  Target, Sparkles, Wand2, Mail 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api'; // Import de ton instance axios

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- LOGIQUE DYNAMIQUE ---
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDocuments = async () => {
      try {
        // On récupère les vrais CV de l'utilisateur depuis le backend
        const response = await api.get('/cvs');
        setDocuments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDocuments();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* --- SIDEBAR (DESIGN INCHANGÉ) --- */}
      <aside className="w-72 bg-white border-r border-slate-200/60 flex flex-col p-6 hidden lg:flex relative z-20">
        <div onClick={() => navigate('/dashboard')} className="flex items-center gap-3 mb-10 px-2 cursor-pointer group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-[800] tracking-tight text-slate-900">CVGenius</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-4 px-4">Menu Principal</p>
          <NavItem icon={<LayoutDashboard size={20}/>} label="Tableau de bord" active={isActive('/dashboard')} onClick={() => navigate('/dashboard')} />
          <NavItem icon={<FileText size={20}/>} label="Mes Documents" active={isActive('/cvs')} onClick={() => navigate('/cvs')} />
          <NavItem icon={<Mail size={20}/>} label="Mes Lettres" active={isActive('/letters')} onClick={() => navigate('/letters')} />
          <NavItem icon={<Star size={20}/>} label="Entretien" active={isActive('/interview')} onClick={() => navigate('/interview')} />
          <NavItem icon={<History size={20}/>} label="Analyses ATS" active={isActive('/cv-scoring')} onClick={() => navigate('/cv-scoring')} />
        </nav>

        <div className="mt-auto space-y-1 pt-6 border-t border-slate-100">
          <NavItem 
            icon={<LogOut size={20}/>} 
            label="Déconnexion" 
            color="text-rose-500" 
            onClick={async () => {
                await logout();
                navigate('/login');
            }} 
          />
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input type="text" placeholder="Rechercher..." className="w-full pl-12 pr-4 py-2.5 bg-slate-100/50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-medium text-sm" />
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
  <h2 className="text-4xl font-[800] text-slate-900">
    Bonjour <span className="text-indigo-600">!</span>
  </h2>
  <p className="text-slate-500 font-medium text-lg">Prêt à décrocher votre prochain job ?</p>
</motion.div>
            
            <motion.button 
              onClick={() => navigate('/cvs/templates')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25"
            >
              <Plus size={22} strokeWidth={3} /> Nouveau CV
            </motion.button>
          </div>

          {/* ACTIONS RAPIDES (DESIGN INCHANGÉ) */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            <StatCard onClick={() => navigate('/cvs/templates')} icon={<Wand2 className="text-violet-600" />} title="Générer CV" desc="Créez un CV en 2 min" />
            <StatCard onClick={() => navigate('/letters/select-cv')} icon={<Mail className="text-fuchsia-600" />} title="Lettre de motivation" desc="Générer depuis un CV" />
            <StatCard onClick={() => navigate('/cv-scoring')} icon={<Target className="text-emerald-600" />} title="Score ATS" desc="Analysez vos documents" value="84%" />
            <StatCard onClick={() => navigate('/interview')} icon={<Sparkles className="text-amber-600" />} title="Entretien" desc="Pratique IA vocale" />
          </div>

          {/* RÉCENTS DYNAMIQUES */}
          <div className="bg-white border border-slate-200/60 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold text-xl">Documents récents</h3>
              <button onClick={() => navigate('/cvs')} className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Voir tout <ChevronRight size={18} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              <AnimatePresence>
                {loading ? (
                  <div className="p-10 text-center text-slate-400 font-medium">Chargement de vos documents...</div>
                ) : documents.length > 0 ? (
                  documents.map((doc) => (
                    <motion.div 
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => navigate(doc.type === 'CV' ? `/cvs/${doc.id}/edit` : `/letters/${doc.id}/edit`)}
                      className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-indigo-600">
                          {doc.type === 'CV' ? <FileText size={24} /> : <Mail size={24} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600">{doc.title}</h4>
                          <p className="text-xs text-slate-400 font-medium">
                            {new Date(doc.updatedAt || doc.createdAt).toLocaleDateString()} • {doc.type}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
                    </motion.div>
                  ))
                ) : (
                  // ÉCRAN VIDE POUR NOUVEAU COMPTE
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <FileText className="text-slate-200" size={32} />
                    </div>
                    <p className="text-slate-500 font-semibold text-lg">Aucun document pour le moment</p>
                    <p className="text-slate-400 text-sm mb-6">Commencez par créer votre premier CV professionnel.</p>
                    <button 
                      onClick={() => navigate('/cvs/templates')}
                      className="text-indigo-600 font-bold bg-indigo-50 px-6 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors"
                    >
                      Créer maintenant
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS (INCHANGÉS) ---
function NavItem({ icon, label, active = false, onClick, color = "text-slate-500" }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-[700] text-sm transition-all relative group ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : `${color} hover:bg-slate-100 hover:text-slate-900`}`}>
      {icon}
      {label}
      {active && <motion.div layoutId="nav-pill" className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />}
    </button>
  );
}

function StatCard({ icon, title, desc, value, onClick }) {
  return (
    <motion.div onClick={onClick} whileHover={{ y: -5 }} className="p-8 bg-white border border-slate-200/60 rounded-[32px] shadow-sm hover:shadow-xl transition-all cursor-pointer group">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {React.cloneElement(icon, { size: 24, className: "group-hover:text-white" })}
      </div>
      <div className="flex items-center justify-between mb-1">
          <h4 className="font-[800] text-xl text-slate-900">{title}</h4>
          {value && <span className="text-xl font-black text-indigo-600">{value}</span>}
      </div>
      <p className="text-sm text-slate-500 font-medium">{desc}</p>
    </motion.div>
  );
}