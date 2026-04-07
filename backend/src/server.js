const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', 
    credentials: true 
})); // 5173 = Live Server

app.use(express.json());
app.use(cookieParser());

// Route de test
app.get('/test', (req, res) => {
    res.json({ message: "Le backend de CVGenius répond présent ! 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur L3 démarré sur : http://localhost:${PORT}`);
});