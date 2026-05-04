# CVGenius

Plateforme web complète de génération et d'optimisation de CV professionnels, avec analyse de compatibilité ATS, préparation aux entretiens et génération de lettres de motivation.

---

## Présentation

CVGenius répond à un problème concret : la majorité des candidatures sont rejetées automatiquement par des systèmes ATS (Applicant Tracking Systems) avant même d'être lues par un recruteur. Cette plateforme permet à un utilisateur de créer un CV structuré, d'obtenir un score de compatibilité en temps réel par rapport à une offre d'emploi, et de générer une lettre de motivation adaptée.

Le projet suit une architecture client/serveur avec une séparation claire entre le frontend React et l'API REST Express. La base de données PostgreSQL gère l'ensemble des données utilisateurs et documents.

---

## Stack technique

**Frontend**
- React avec Vite comme outil de build
- Tailwind CSS pour le style
- Framer Motion pour les animations
- React Router pour la navigation

**Backend**
- Node.js avec Express
- PostgreSQL via le driver `pg`
- Authentification par JWT stockés en cookie HTTP-only
- Puppeteer et PDFKit pour la génération de PDF
- Mammoth pour l'extraction de texte depuis les fichiers Word
- Multer pour la gestion des uploads de fichiers

---

## Structure du projet

```
cvgenius-project/
│
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration CORS et base de données
│   │   ├── controllers/      # Logique métier par ressource
│   │   ├── middlewares/      # Gestion des erreurs, authentification
│   │   ├── models/           # Requêtes SQL et accès aux données
│   │   ├── routes/           # Définition des endpoints API
│   │   ├── templates/        # Templates Handlebars pour les PDF
│   │   └── utils/            # Fonctions utilitaires partagées
│   ├── database/             # Scripts SQL d'initialisation
│   ├── uploads/              # Fichiers uploadés par les utilisateurs
│   ├── logs/                 # Journaux d'erreurs et d'accès
│   ├── server.js             # Point d'entrée du serveur
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Ressources statiques et templates visuels
│   │   ├── components/       # Composants React réutilisables
│   │   ├── context/          # Contexte d'authentification global
│   │   ├── pages/            # Pages de l'application
│   │   │   ├── HomePage
│   │   │   ├── Login / Register
│   │   │   ├── Dashboard
│   │   │   ├── CreateCv
│   │   │   ├── MyCvs
│   │   │   ├── CvScore
│   │   │   ├── SelectTemplate / Template
│   │   │   ├── Letter / MyLetters
│   │   │   └── Interview
│   │   ├── services/         # Appels API (auth, cv, lettres)
│   │   ├── utils/            # Fonctions utilitaires frontend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## Routes API

| Méthode | Endpoint                  | Description                                      |
|---------|---------------------------|--------------------------------------------------|
| POST    | /api/auth/register        | Créer un nouveau compte utilisateur              |
| POST    | /api/auth/login           | Authentification et émission du cookie JWT       |
| POST    | /api/auth/logout          | Déconnexion et invalidation du cookie            |
| GET     | /api/user/profile         | Récupérer le profil de l'utilisateur connecté    |
| PUT     | /api/user/profile         | Mettre à jour les informations du profil         |
| GET     | /api/cvs                  | Lister les CV de l'utilisateur connecté          |
| POST    | /api/cvs                  | Créer un nouveau CV                              |
| GET     | /api/cvs/:id              | Récupérer un CV par son identifiant              |
| PUT     | /api/cvs/:id              | Modifier un CV existant                          |
| DELETE  | /api/cvs/:id              | Supprimer un CV                                  |
| GET     | /api/public/cv/:slug      | Accéder à un CV via son lien public (sans auth)  |
| POST    | /api/pdf/generate         | Générer un PDF à partir d'un CV                  |
| POST    | /api/cv-score             | Analyser la compatibilité ATS d'un CV            |
| GET     | /api/cover-letters        | Lister les lettres de motivation                 |
| POST    | /api/cover-letters        | Générer une lettre de motivation                 |
| GET     | /api/interview            | Récupérer les questions de préparation           |
| POST    | /api/interview            | Générer des questions selon le poste visé        |
| GET     | /api/analytics            | Statistiques de l'utilisateur (vues, exports...) |

---

## Installation et lancement

### Prérequis

- Node.js v18 ou supérieur
- PostgreSQL installé et en cours d'exécution
- npm

---


## Sécurité

- Les mots de passe sont hachés avec bcrypt avant stockage en base de données
- Les tokens JWT sont transmis uniquement via des cookies HTTP-only, inaccessibles depuis JavaScript
- Les requêtes cross-origin sont restreintes via CORS à l'URL du frontend déclarée dans `.env`
- Les uploads sont filtrés par type de fichier et limités à 10 Mo
- Les erreurs serveur ne renvoient jamais de stack trace en production

---

## Scripts disponibles

**Backend**

```bash
npm run dev      # Développement avec rechargement automatique via nodemon
npm run start    # Production
```

**Frontend**

```bash
npm run dev      # Serveur de développement Vite
npm run build    # Build de production
npm run preview  # Prévisualisation du build produit
```

---

## Pistes d'amélioration

- Intégration d'un modèle de langage pour les suggestions de reformulation de CV
- Abonnement premium avec Stripe (exports illimités, templates exclusifs)
- OAuth Google pour la connexion rapide
- Tableau de bord analytics avec suivi des vues par lien public partagé
- Tests unitaires et d'intégration avec Jest et Supertest
- Pipeline CI/CD avec GitHub Actions

---

## Auteur

Josias KOUWONOU 

---

## Licence

MIT License. Voir le fichier `LICENSE` pour les détails.