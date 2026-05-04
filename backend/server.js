require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./src/config/cors');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cvRoutes = require('./src/routes/cvRoutes');
const pdfRoutes = require('./src/routes/pdfRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const CvController = require('./src/controllers/cvController');
const coverLetterRoutes = require('./src/routes/coverLetterRoutes');
const interviewRoutes = require('./src/routes/interviewRoutes');
const cvScoreRoutes = require('./src/routes/cvScoreRoutes');
const errorHandler = require('./src/middlewares/errorHandler');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}
app.get('/', (req, res) => {
  res.json({
    message: 'CVGenius API Backend',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cover-letters', coverLetterRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/cv-score', cvScoreRoutes);

app.get('/api/public/cv/:slug', CvController.getPublic);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});



app.use(errorHandler);


app.listen(PORT, () => {
  console.log('================================================');
  console.log(`✅ Serveur CVGenius démarré`);
  console.log(`📡 URL : http://localhost:${PORT}`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Base de données : ${process.env.DB_NAME}`);
  console.log('================================================');
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Erreur non gérée :', err);
  process.exit(1);
});