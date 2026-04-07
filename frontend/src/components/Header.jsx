import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, LogOut, User, Bell, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 font-['Inter',_sans-serif]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200"
          >
            <Zap size={22} className="text-white fill-white" />
          </motion.div>
          <span className="text-2xl font-[800] tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            CVGenius
          </span>
        </Link>

        {/* --- NAVIGATION CENTRALE MISE À JOUR --- */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
          <NavLink to="/cvs" label="Mes CV" active={isActive('/cvs')} />
          <NavLink to="/letters" label="Mes Lettres" active={isActive('/letters')} />
          <NavLink to="/interview" label="Entretien" active={isActive('/interview')} />
          <NavLink to="/cv-scoring" label="Analyse ATS" active={isActive('/cv-scoring')} />
        </nav>

        {/* --- ACTIONS UTILISATEUR --- */}
        <div className="flex items-center gap-5 pl-6 border-l border-slate-200">
          

          {/* Profil */}
          <div className="flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-100 uppercase">
              {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                {user?.fullName || user?.email?.split('@')[0]}
              </p>
              <p className="text-[9px] text-indigo-600 font-black uppercase tracking-wider">Compte Pro</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
            title="Déconnexion"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link 
      to={to} 
      className={`relative px-4 py-2 text-sm font-bold tracking-tight transition-all rounded-xl ${
        active 
          ? 'text-indigo-600 bg-indigo-50/50' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="header-nav"
          className="absolute bottom-1 left-4 right-4 h-0.5 bg-indigo-600 rounded-full"
        />
      )}
    </Link>
  )
}