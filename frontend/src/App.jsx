import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateCvPage from './pages/CreateCvPage';
import MyCvsPage from './pages/MyCvsPage';
import InterviewPage from './pages/InterviewPage';
import CvScoringPage from './pages/CvScoringPage';
import MyLettersPage from './pages/MyLettersPage';
import SelectCvForLetterPage from './pages/SelectCvForLetterPage';
import CreateLetterPage from './pages/CreateLetterPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import LetterTemplateSelectionPage from './pages/LetterTemplateSelectionPage';

/**
 * Composant de Route Protégée
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/**
 * Contenu principal de l'application
 */
function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); // On récupère l'URL actuelle

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // ✅ LISTE DES PAGES OÙ ON NE VEUT PAS DE HEADER/FOOTER DU DASHBOARD
  const hideLayout = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* ✅ MASQUER LE HEADER SUR LES PAGES PUBLIQUES MÊME SI CONNECTÉ */}
      {isAuthenticated && !hideLayout && <Header />}

      <main className="flex-1">
        <Routes>
          {/* --- Routes Publiques --- */}
          <Route path="/" element={<HomePage />} />
          {/* ✅ Si déjà connecté, le login redirige vers dashboard */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route path="/cv-scoring" element={<CvScoringPage />} />
          
          {/* --- Routes Privées (Protégées) --- */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/cvs" element={
            <ProtectedRoute>
              <MyCvsPage />
            </ProtectedRoute>
          } />

          <Route path="/cvs/templates" element={
            <ProtectedRoute>
              <TemplateSelectionPage />
            </ProtectedRoute>
          } />
          
          <Route path="/cvs/create" element={
            <ProtectedRoute>
              <CreateCvPage />
            </ProtectedRoute>
          } />
          
          <Route path="/interview" element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          } />

          <Route path="/letters" element={
            <ProtectedRoute>
              <MyLettersPage />
            </ProtectedRoute>
          } />

          <Route path="/letters/templates" element={
            <ProtectedRoute>
              <LetterTemplateSelectionPage />
            </ProtectedRoute>
          } />

          <Route path="/letters/select-cv" element={
            <ProtectedRoute>
              <SelectCvForLetterPage />
            </ProtectedRoute>
          } />

          <Route path="/letters/create" element={
            <ProtectedRoute>
              <CreateLetterPage />
            </ProtectedRoute>
          } />
          
          {/* Redirection automatique */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* ✅ MASQUER LE FOOTER SUR LES PAGES PUBLIQUES */}
      {isAuthenticated && !hideLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}