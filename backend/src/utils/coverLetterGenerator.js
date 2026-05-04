class CoverLetterGenerator {
  static generate(cvData, letterData) {
    const {
      targetCompany,
      targetPosition,
      companyType,
      jobOfferText
    } = letterData;

    const personalInfo = cvData.personal_info || {};
    const experiences = cvData.experiences || [];
    const skills = cvData.skills || [];
    const firstName = personalInfo.first_name || '';
    const lastName = personalInfo.last_name || '';
    const currentPosition = personalInfo.job_title || targetPosition;
    const lastExperience = experiences[0] || {};
    const lastCompany = lastExperience.company || '';
    const yearsOfExperience = this.calculateYears(experiences);
    const keywords = jobOfferText ? this.extractKeywords(jobOfferText) : [];

    const content = {
      coordonnees: this.generateCoordonnees(personalInfo, experiences),
      entete: this.generateEntete(targetCompany, targetPosition, personalInfo, experiences),
      paragraphe1: this.generateParagraphe1(
        currentPosition,
        lastCompany,
        yearsOfExperience,
        targetPosition,
        targetCompany
      ),
      paragraphe2: this.generateParagraphe2(skills, lastExperience, keywords),
      paragraphe3: this.generateParagraphe3(companyType, targetPosition),
      paragraphe4: this.generateParagraphe4(),
      signature: this.generateSignature(firstName, lastName)
    };

    return content;
  }

  static generateCoordonnees(personalInfo, experiences) {
    let city = '';
    if (personalInfo.address) {
      const addressParts = personalInfo.address.split(',').map(p => p.trim());
      if (addressParts.length >= 2) {
        city = addressParts[1];
      } else if (addressParts.length === 1) {
        const words = personalInfo.address.split(' ');
        city = words.find(w => w.length > 2 && w[0] === w[0].toUpperCase()) || '';
      }
    }
    if (!city && experiences.length > 0) {
      city = experiences[0].location || '';
    }

    return {
      fullName: `${personalInfo.first_name || ''} ${personalInfo.last_name || ''}`.trim() || 'Candidat',
      address: personalInfo.address || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      city: city
    };
  }

  static generateEntete(targetCompany, targetPosition, personalInfo, experiences) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });    
    let city = '';
    
    if (personalInfo.address) {
      const addressParts = personalInfo.address.split(',').map(p => p.trim());
      if (addressParts.length >= 2) {
        city = addressParts[1];
      } else if (addressParts.length === 1) {
        const words = personalInfo.address.split(' ');
        city = words.find(w => w.length > 2 && w[0] === w[0].toUpperCase()) || '';
      }
    }
    
    if (!city && experiences.length > 0) {
      city = experiences[0].location || '';
    }

    return {
      company: targetCompany,
      date: dateStr,
      city: city,
      objet: `Candidature au poste de ${targetPosition}`
    };
  }
  static generateParagraphe1(currentPosition, lastCompany, years, targetPosition, targetCompany) {
    const templates = [
      `Avec ${years} d'expérience en tant que ${currentPosition}${lastCompany ? ` chez ${lastCompany}` : ''}, je candidate au poste de ${targetPosition} au sein de ${targetCompany}.`,
      `Fort de ${years} d'expérience en tant que ${currentPosition}, je souhaite mettre mes compétences au service de ${targetCompany} pour le poste de ${targetPosition}.`,
      `Actuellement ${currentPosition}${lastCompany ? ` chez ${lastCompany}` : ''} depuis ${years}, je candidate au poste de ${targetPosition} chez ${targetCompany}, poste qui correspond parfaitement à mon parcours et mes ambitions.`
    ];
    return templates[0];
  }
  static generateParagraphe2(skills, lastExperience, keywords) {
    const skillsArray = Array.isArray(skills) ? skills : [];
    if (skillsArray.length === 0) {
      return `Mon parcours m'a permis de développer une solide expertise professionnelle. ${lastExperience.company ? `Chez ${lastExperience.company}, j'ai notamment occupé le poste de ${lastExperience.position || 'collaborateur'}, ce qui m'a permis de renforcer mon expertise.` : ''}`;
    }

    const skillsStr = skillsArray.slice(0, 3).join(', ');
    const experience = lastExperience.position || 'mes fonctions précédentes';

    let base = `Mon parcours m'a permis de développer des compétences solides en ${skillsStr}.`;
    if (lastExperience.company) {
      base += ` Chez ${lastExperience.company}, j'ai notamment ${experience.toLowerCase()}, ce qui m'a permis de renforcer mon expertise.`;
    }
    if (keywords.length > 0) {
      base += ` Je maîtrise particulièrement ${keywords.slice(0, 2).join(' et ')}, compétences essentielles pour ce poste.`;
    }
    return base;
  }
  static generateParagraphe3(companyType, targetPosition) {
    const motivations = {
      startup: `L'agilité et l'innovation qui caractérisent les startups correspondent parfaitement à mes aspirations professionnelles. Ma capacité d'adaptation et mon goût pour les défis me permettront de contribuer efficacement à votre croissance.`,
      pme: `La proximité et la flexibilité qu'offre une PME représentent un environnement de travail idéal pour exprimer pleinement mes compétences. Mon sens du relationnel et ma polyvalence seront des atouts majeurs pour ce poste de ${targetPosition}.`,
      grande_entreprise: `L'envergure internationale et les opportunités d'évolution offertes par votre groupe constituent un cadre stimulant pour développer mon expertise. Mon expérience et ma rigueur professionnelle me permettront de relever les défis liés à ce poste.`
    };
    return motivations[companyType] || motivations.pme;
  }
  static generateParagraphe4() {
    return `Disponible pour un entretien afin d'échanger sur ma candidature et présenter plus en détail mon parcours, je reste à votre disposition pour tout complément d'information.`;
  }
  static generateSignature(firstName, lastName) {
    return `${firstName} ${lastName}`;
  }
  static extractKeywords(jobOfferText) {
    if (!jobOfferText) return [];
    const techKeywords = [
      'javascript', 'node.js', 'react', 'angular', 'vue',
      'python', 'java', 'php', 'sql', 'mongodb',
      'docker', 'kubernetes', 'aws', 'azure',
      'scrum', 'agile', 'jira', 'git',
      'leadership', 'management', 'gestion',
      'communication', 'autonome', 'rigueur',
      'comptabilité', 'finance', 'audit', 'fiscalité'
    ];

    const text = jobOfferText.toLowerCase();
    const found = [];

    techKeywords.forEach(keyword => {
      if (text.includes(keyword) && !found.includes(keyword)) {
        found.push(keyword);
      }
    });

    return found.slice(0, 5);
  }

  static calculateYears(experiences) {
    if (!experiences || experiences.length === 0) return '0 an';

    let totalMonths = 0;

    experiences.forEach(exp => {
      const start = exp.start_date || '';
      const end = exp.end_date || 'présent';
      
      const startYear = parseInt(start.match(/\d{4}/)?.[0] || new Date().getFullYear());
      const endYear = end.toLowerCase().includes('présent') || end.toLowerCase().includes('aujourd')
        ? new Date().getFullYear()
        : parseInt(end.match(/\d{4}/)?.[0] || new Date().getFullYear());

      totalMonths += (endYear - startYear) * 12;
    });

    const years = Math.floor(totalMonths / 12);

    if (years === 0) return 'moins d\'un an';
    if (years === 1) return '1 an';
    return `${years} ans`;
  }
}

module.exports = CoverLetterGenerator;