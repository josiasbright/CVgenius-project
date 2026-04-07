// ================================================
// SUMMARY TEMPLATES - Templates pour génération de résumés
// ================================================

const templates = {
  professional: {
    short: [
      '{jobTitle} avec {years} d\'expérience en {skills}.',
      'Professionnel {jobTitle} expérimenté ({years} ans) spécialisé en {skills}.',
      '{jobTitle} qualifié avec {years} ans d\'expertise en {skills}.'
    ],
    medium: [
      '{jobTitle} avec {years} d\'expérience spécialisé en {skills}. Passionné par l\'excellence et l\'innovation, avec une forte capacité d\'adaptation et un esprit d\'équipe développé.',
      'Professionnel {jobTitle} avec {years} ans d\'expérience en {skills}. Expert en résolution de problèmes complexes et gestion de projets, recherchant constamment à améliorer les processus et à atteindre les objectifs.',
      '{jobTitle} expérimenté ({years} ans) maîtrisant {skills}. Orienté résultats avec un excellent sens de l\'organisation et de fortes compétences en communication.'
    ],
    long: [
      '{jobTitle} avec {years} d\'expérience spécialisé en {skills}. Professionnel rigoureux et méthodique, passionné par l\'innovation technologique et l\'amélioration continue. Doté d\'excellentes capacités d\'analyse et de résolution de problèmes, je cherche constamment à optimiser les processus et à apporter de la valeur ajoutée. Fort d\'un esprit d\'équipe développé et d\'une grande capacité d\'adaptation, je m\'investis pleinement dans chaque projet pour atteindre et dépasser les objectifs fixés.'
    ]
  },
  
  dynamic: {
    short: [
      '{jobTitle} dynamique avec {years} ans d\'expérience en {skills}.',
      'Expert {jobTitle} ({years} ans) passionné par {skills}.',
      '{jobTitle} motivé et créatif, {years} ans d\'expérience en {skills}.'
    ],
    medium: [
      '{jobTitle} dynamique avec {years} ans d\'expérience en {skills}. Passionné par les défis et l\'innovation, je m\'adapte rapidement aux nouvelles technologies et méthodes de travail.',
      'Expert {jobTitle} avec {years} ans d\'expérience spécialisé en {skills}. Créatif et orienté solutions, je transforme les idées en réalisations concrètes.',
      '{jobTitle} motivé ({years} ans) maîtrisant {skills}. Proactif et autonome, j\'apporte énergie et expertise à chaque projet.'
    ],
    long: [
      '{jobTitle} dynamique et passionné avec {years} ans d\'expérience en {skills}. Constamment à l\'affût des dernières tendances et innovations, je m\'engage à apporter des solutions créatives et efficaces. Mon approche proactive et ma capacité à travailler sous pression me permettent de relever tous les défis avec enthousiasme. Animé par un fort désir de progression et d\'excellence, je cherche à contribuer activement au succès des projets et au développement de l\'équipe.'
    ]
  },
  
  creative: {
    short: [
      '{jobTitle} créatif avec {years} ans d\'expérience en {skills}.',
      'Créateur {jobTitle} ({years} ans) expert en {skills}.',
      '{jobTitle} imaginatif, {years} ans de créativité en {skills}.'
    ],
    medium: [
      '{jobTitle} créatif avec {years} ans d\'expérience en {skills}. Passionné par le design et l\'innovation, je transforme les concepts en réalisations impactantes.',
      'Designer {jobTitle} avec {years} ans d\'expertise en {skills}. Créativité, sens esthétique et attention aux détails sont au cœur de mon approche.',
      '{jobTitle} imaginatif ({years} ans) spécialisé en {skills}. J\'allie créativité artistique et rigueur technique pour créer des expériences uniques.'
    ],
    long: [
      '{jobTitle} créatif et innovant avec {years} ans d\'expérience en {skills}. Passionné par l\'art de créer des expériences visuelles et fonctionnelles exceptionnelles, je m\'efforce constamment de repousser les limites de la créativité. Mon approche combine vision artistique et expertise technique pour concevoir des solutions qui captivent et inspirent. Collaboratif et à l\'écoute, je travaille en étroite collaboration avec les équipes pour transformer les idées en réalisations mémorables qui dépassent les attentes.'
    ]
  }
};

function generate({ jobTitle, yearsExperience, skills, tone = 'professional', length = 'medium' }) {
  // Sélectionner le template approprié
  const toneTemplates = templates[tone] || templates.professional;
  const lengthTemplates = toneTemplates[length] || toneTemplates.medium;
  
  // Choisir un template aléatoire
  const template = lengthTemplates[Math.floor(Math.random() * lengthTemplates.length)];
  
  // Formater les compétences
  let skillsText = '';
  if (Array.isArray(skills) && skills.length > 0) {
    if (skills.length === 1) {
      skillsText = skills[0];
    } else if (skills.length === 2) {
      skillsText = skills.join(' et ');
    } else {
      skillsText = skills.slice(0, -1).join(', ') + ' et ' + skills[skills.length - 1];
    }
  } else {
    skillsText = 'diverses technologies';
  }
  
  // Formater les années d'expérience
  const years = yearsExperience + (yearsExperience > 1 ? ' ans' : ' an');
  
  // Remplacer les variables
  let summary = template
    .replace(/\{jobTitle\}/g, jobTitle)
    .replace(/\{years\}/g, years)
    .replace(/\{skills\}/g, skillsText);
  
  return summary;
}

module.exports = {
  generate
};