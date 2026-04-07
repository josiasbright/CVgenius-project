// ================================================
// CV DATA MAPPER - Mapper UNIVERSEL pour tous les templates
// Compatible avec : thomas, alfred, sacha, benjamin, lorna, sebastian
// ================================================

class CvDataMapper {
  
  // ================================================
  // MAPPER UNIVERSEL - Fournit TOUTES les versions
  // ================================================
  static mapForTemplate(cv) {
    const cvData = cv.cv_data;
    
    // Données mappées UNIVERSELLES
    const mappedData = {
      // Couleur du thème
      themeColor: cv.theme_color || '#8B5CF6',
      
      // ========================================
      // PERSONAL INFO (toutes versions)
      // ========================================
      // Prénom/Nom (plusieurs versions)
      firstname: cvData.personal_info?.first_name || '',
      lastname: cvData.personal_info?.last_name || '',
      first_name: cvData.personal_info?.first_name || '',
      last_name: cvData.personal_info?.last_name || '',
      
      // Titre du poste (plusieurs versions)
      title: cvData.personal_info?.job_title || '',
      jobTitle: cvData.personal_info?.job_title || '',
      job_title: cvData.personal_info?.job_title || '',
      
      // Contact
      email: cvData.personal_info?.email || '',
      phone: cvData.personal_info?.phone || '',
      address: cvData.personal_info?.address || '',
      website: cvData.personal_info?.website || '',
      
      // Photo (plusieurs versions)
      photoUrl: cvData.personal_info?.photo_url || '',
      photo_url: cvData.personal_info?.photo_url || '',
      
      // Résumé/Profil
      summary: cvData.personal_info?.summary || '',
      profile: cvData.personal_info?.summary || '',
      
      // ========================================
      // EDUCATION (toutes versions)
      // ========================================
      education: (cvData.education || []).map(edu => ({
        // Diplôme
        degree: edu.degree || '',
        
        // École/Institution (plusieurs versions)
        school: edu.institution || '',
        institution: edu.institution || '',
        
        // Dates (plusieurs formats)
        years: this.formatYears(edu.start_date, edu.end_date),
        start_date: edu.start_date || '',
        end_date: edu.end_date || '',
        startDate: edu.start_date || '',
        endDate: edu.end_date || '',
        
        // Domaine/Spécialité
        field: edu.field || '',
        speciality: edu.field || ''
      })),
      
      // ========================================
      // EXPERIENCES (toutes versions)
      // ========================================
      experiences: (cvData.experiences || []).map(exp => {
        const startDate = exp.start_date || '';
        const endDate = exp.end_date || (exp.is_current ? 'Présent' : '');
        
        // Séparer description en tasks si c'est une string
        let tasks = exp.tasks || [];
        if (!tasks.length && exp.description) {
          tasks = exp.description.split('\n').filter(t => t.trim());
        }
        
        return {
          // Poste/Position (plusieurs versions)
          role: exp.position || '',
          position: exp.position || '',
          jobTitle: exp.position || '',
          
          // Entreprise
          company: exp.company || '',
          
          // Localisation
          location: exp.location || '',
          
          // Dates (plusieurs formats)
          years: this.formatYears(startDate, endDate),
          start_date: startDate,
          end_date: endDate,
          startDate: startDate,
          endDate: endDate,
          startDateFormatted: startDate,
          endDateFormatted: endDate,
          
          // Description
          description: exp.description || '',
          
          // Tâches (array)
          tasks: tasks,
          
          // Indicateur de poste actuel
          is_current: exp.is_current || false
        };
      }),
      
      // ========================================
      // SKILLS (toutes versions)
      // ========================================
      skills: cvData.skills || [],
      softwareSkills: cvData.skills || [],
      expertises: cvData.skills || [],
      competences: cvData.skills || [],
      
      // ========================================
      // LANGUAGES (avec niveau)
      // ========================================
      languages: (cvData.languages || []).map(lang => {
        // Si c'est une string, transformer en objet
        if (typeof lang === 'string') {
          return {
            name: lang,
            level: 'Langue natale'
          };
        }
        return {
          name: lang.name || lang,
          level: lang.level || 'Langue natale'
        };
      }),
      
      // ========================================
      // HOBBIES / CENTRES D'INTÉRÊT (avec icônes)
      // ========================================
     hobbies: (cvData.hobbies || []).map(hobby => {
  if (typeof hobby === 'string') {
    return {
      name: hobby,
      category: hobby,
      items: hobby,
      icon: this.getHobbyIcon(hobby)
    };
  }
  return {
    name: hobby.name || hobby.category || '',
    category: hobby.category || hobby.name || '',
    items: hobby.items || hobby.name || '',
    icon: hobby.icon || this.getHobbyIcon(hobby.name || '')
  };
}),
      // ========================================
      // REFERENCES
      // ========================================
      references: (cvData.references || []).map(ref => ({
        name: ref.name || '',
        role: ref.position || '',
        position: ref.position || '',
        phone: ref.phone || '',
        email: ref.email || '',
        company: ref.company || ''
      })),
      
      // ========================================
      // CERTIFICATIONS (optionnel)
      // ========================================
      certifications: cvData.certifications || [],
      
      // ========================================
      // PROJETS (optionnel)
      // ========================================
      projects: cvData.projects || []
    };
    
    return mappedData;
  }
  
  // ================================================
  // FORMATER LES ANNÉES
  // ================================================
  static formatYears(startDate, endDate) {
    if (!startDate) return '';
    
    const start = startDate;
    const end = endDate || 'Présent';
    
    return `${start} - ${end}`;
  }
  
  // ================================================
  // OBTENIR ICÔNE POUR HOBBY
  // ================================================
  static getHobbyIcon(hobby) {
    const icons = {
      'Cuisine': '👨‍🍳',
      'Lecture': '📚',
      'Bricolage': '🔧',
      'Voyage': '✈️',
      'Sport': '⚽',
      'Sports': '⚽',
      'Voyages': '✈️',
      'Musique': '🎵',
      'Photo': '📷',
      'Photographie': '📷',
      'Gaming': '🎮',
      'Cinéma': '🎬',
      'Dessin': '🎨',
      'Jardinage': '🌱',
      'Yoga': '🧘',
      'Football': '⚽',
      'Vélo': '🚴',
      'Natation': '🏊',
      'Technologie': '💻',
      'Randonnée': '🥾',
      'Gymnastique': '🤸'
    };
    
    return icons[hobby] || '🔹';
  }
}

module.exports = CvDataMapper;