"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Lightbulb, 
  Trophy, 
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';
import axios from 'axios';

export default function InterviewPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/interview/start', {
        withCredentials: true
      });
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement questions:', error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setShowAnswer(false);
    setCompleted(false);
    loadQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-500 font-bold">Préparation de la session...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-12 max-w-2xl w-full text-center shadow-2xl shadow-indigo-100 border border-slate-100 relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Trophy className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Session terminée</h1>
          <p className="text-lg text-slate-500 font-medium mb-10">
            Excellent travail. Vous avez parcouru toutes les questions de préparation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
                onClick={handleRestart}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
                <RotateCcw size={18} /> Recommencer
            </button>
            <button 
                onClick={() => window.location.href = '/dashboard'}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
                Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER & PROGRESS */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    
                    Entretien
                </h1>
            </div>
            <div className="text-right">
                <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-100">
                    Question {currentQuestion + 1} / {questions.length}
                </span>
            </div>
        </div>

        <div className="h-2.5 bg-slate-200 rounded-full mb-12 overflow-hidden border border-white">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-indigo-600 relative"
          />
        </div>

        {/* MAIN QUESTION CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[35px] p-8 md:p-12 shadow-2xl shadow-indigo-100/50 border border-slate-100"
          >
            <div className="flex items-start gap-6 mb-10">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-900 border border-slate-100">
                <MessageSquare size={26} />
              </div>
              <div>
                <span className="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-md mb-3">
                  {question?.category || "Général"}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                  {question?.question_text}
                </h2>
              </div>
            </div>

            {!showAnswer ? (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => setShowAnswer(true)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
              >
                
                Afficher la stratégie
              </motion.button>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Réponse Suggérée */}
                <div className="bg-slate-50 rounded-[30px] p-8 border border-slate-100 relative">
                  <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" /> 
                  </h3>
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">
                    {question?.suggested_answer}
                  </p>
                </div>

                {/* Conseil Expert */}
                <div className="bg-amber-50 rounded-[30px] p-8 border border-amber-100">
                  <h3 className="text-amber-700 font-black text-[11px] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Lightbulb size={16} /> 
                  </h3>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {question?.tips}
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  {currentQuestion < questions.length - 1 ? 'Question suivante' : 'Terminer la session'}
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
            Simulateur d'entretien CVGenius 
        </p>
      </div>
    </div>
  );
}