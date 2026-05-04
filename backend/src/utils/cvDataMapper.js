class CvDataMapper {
  
  static mapForTemplate(cv) {
    const cvData = cv.cv_data;
    
    const mappedData = {
      themeColor: cv.theme_color || '#8B5CF6',
      
      firstname: cvData.personal_info?.first_name || '',
      lastname: cvData.personal_info?.last_name || '',
      first_name: cvData.personal_info?.first_name || '',
      last_name: cvData.personal_info?.last_name || '',
      
      title: cvData.personal_info?.job_title || '',
      jobTitle: cvData.personal_info?.job_title || '',
      job_title: cvData.personal_info?.job_title || '',
      
      email: cvData.personal_info?.email || '',
      phone: cvData.personal_info?.phone || '',
      address: cvData.personal_info?.address || '',
      website: cvData.personal_info?.website || '',
      
      photoUrl: cvData.personal_info?.photo_url || '',
      photo_url: cvData.personal_info?.photo_url || '',
      
      summary: cvData.personal_info?.summary || '',
      profile: cvData.personal_info?.summary || '',
      
      education: (cvData.education || []).map(edu => ({
        degree: edu.degree || '',
        
        school: edu.institution || '',
        institution: edu.institution || '',
        
        years: this.formatYears(edu.start_date, edu.end_date),
        start_date: edu.start_date || '',
        end_date: edu.end_date || '',
        startDate: edu.start_date || '',
        endDate: edu.end_date || '',
        
        field: edu.field || '',
        speciality: edu.field || ''
      })),
      
      experiences: (cvData.experiences || []).map(exp => {
        const startDate = exp.start_date || '';
        const endDate = exp.end_date || (exp.is_current ? 'Présent' : '');
        
        let tasks = exp.tasks || [];
        if (!tasks.length && exp.description) {
          tasks = exp.description.split('\n').filter(t => t.trim());
        }
        
        return {
          role: exp.position || '',
          position: exp.position || '',
          jobTitle: exp.position || '',
          
          company: exp.company || '',
          
          location: exp.location || '',
          
          years: this.formatYears(startDate, endDate),
          start_date: startDate,
          end_date: endDate,
          startDate: startDate,
          endDate: endDate,
          startDateFormatted: startDate,
          endDateFormatted: endDate,
          
          description: exp.description || '',
          
          tasks: tasks,
          
          is_current: exp.is_current || false
        };
      }),
      
      skills: cvData.skills || [],
      softwareSkills: cvData.skills || [],
      expertises: cvData.skills || [],
      competences: cvData.skills || [],
      
      languages: (cvData.languages || []).map(lang => {
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
      references: (cvData.references || []).map(ref => ({
        name: ref.name || '', role: ref.position || '',
        position: ref.position || '', phone: ref.phone || '',
        email: ref.email || '', company: ref.company || ''
      })),
      certifications: cvData.certifications || [],
      
      projects: cvData.projects || []
    };
    
    return mappedData;
  }
  
  static formatYears(startDate, endDate) {
    if (!startDate) return '';
    
    const start = startDate;
    const end = endDate || 'Présent';
    
    return `${start} - ${end}`;
  }
  
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