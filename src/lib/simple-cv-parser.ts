
export interface ParsedCVData {
  full_name: string;
  email: string;
  phone?: string;
  skills: string[];
  tools: string[];
  project_summary: string;
  experience_years?: number;
  current_position?: string;
  current_company?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  bio?: string;
  certifications?: string[];
  education?: string[];
  hobbies?: string[];
  languages?: string[];
}

export interface CVParsingResult {
  success: boolean;
  data?: ParsedCVData;
  error?: string;
  hasMinimumRequirements: boolean;
}

export class SimpleCVParser {
  static parseCV(cvText: string): CVParsingResult {
    try {
      const data = this.extractBasicInfo(cvText);
      const hasMinimumRequirements = this.validateMinimumRequirements(data);
      
      return {
        success: true,
        data,
        hasMinimumRequirements
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        hasMinimumRequirements: false
      };
    }
  }

  private static extractBasicInfo(text: string): ParsedCVData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    return {
      full_name: this.extractName(lines),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: this.extractSkills(text),
      tools: this.extractTools(text),
      project_summary: this.extractProjects(text),
      experience_years: this.extractExperience(text),
      current_position: this.extractCurrentPosition(text),
      current_company: this.extractCurrentCompany(text),
      location: this.extractLocation(text),
      linkedin_url: this.extractLinkedIn(text),
      github_url: this.extractGitHub(text),
      bio: this.extractBio(text),
      certifications: this.extractCertifications(text),
      education: this.extractEducation(text),
      hobbies: this.extractHobbies(text),
      languages: this.extractLanguages(text)
    };
  }

  private static extractName(lines: string[]): string {
    // First non-empty line is usually the name
    return lines[0] || 'Unknown';
  }

  private static extractEmail(text: string): string {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : '';
  }

  private static extractPhone(text: string): string | undefined {
    const phoneRegex = /[\+]?[1-9]?[\d\s\-\(\)]{8,15}/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0].trim() : undefined;
  }

  private static extractSkills(text: string): string[] {
    const skillKeywords = /(?:skills?|technologies?|technical|programming|languages?|frameworks?|tools?)[\s\n:]*([^\n]+)/gi;
    const skills: string[] = [];
    let match;
    
    while ((match = skillKeywords.exec(text)) !== null) {
      const skillLine = match[1];
      const extractedSkills = skillLine.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
      skills.push(...extractedSkills);
    }
    
    return [...new Set(skills)];
  }

  private static extractTools(text: string): string[] {
    const toolPatterns = /(?:tools?|software|platforms?|applications?)[\s\n:]*([^\n]+)/gi;
    const tools: string[] = [];
    let match;
    
    while ((match = toolPatterns.exec(text)) !== null) {
      const toolLine = match[1];
      const extractedTools = toolLine.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
      tools.push(...extractedTools);
    }
    
    return [...new Set(tools)];
  }

  private static extractProjects(text: string): string {
    const projectPatterns = /(?:projects?|achievements?|portfolio)[\s\n:]*([^]+?)(?=\n\n|\n[A-Z]|$)/gi;
    const matches = text.match(projectPatterns);
    return matches ? matches.join(' ').substring(0, 500) : 'No projects mentioned';
  }

  private static extractExperience(text: string): number | undefined {
    const expPatterns = /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi;
    const matches = text.match(expPatterns);
    if (matches) {
      const numbers = matches[0].match(/\d+/);
      return numbers ? parseInt(numbers[0]) : undefined;
    }
    return undefined;
  }

  private static extractCurrentPosition(text: string): string | undefined {
    const positionPatterns = /(?:current|present)[\s\n:]*([^\n]+)/gi;
    const matches = text.match(positionPatterns);
    return matches ? matches[0].replace(/current|present/gi, '').trim() : undefined;
  }

  private static extractCurrentCompany(text: string): string | undefined {
    const lines = text.split('\n').map(line => line.trim());
    for (let i = 0; i < lines.length; i++) {
      if (/(?:company|employer|organization)/i.test(lines[i]) && i < lines.length - 1) {
        return lines[i + 1];
      }
    }
    return undefined;
  }

  private static extractLocation(text: string): string | undefined {
    const locationPatterns = /(?:location|address|city)[\s\n:]*([^\n]+)/gi;
    const matches = text.match(locationPatterns);
    return matches ? matches[0].replace(/location|address|city/gi, '').trim() : undefined;
  }

  private static extractLinkedIn(text: string): string | undefined {
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/gi;
    const matches = text.match(linkedinRegex);
    return matches ? matches[0] : undefined;
  }

  private static extractGitHub(text: string): string | undefined {
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/gi;
    const matches = text.match(githubRegex);
    return matches ? matches[0] : undefined;
  }

  private static extractBio(text: string): string | undefined {
    const bioPatterns = /(?:summary|objective|about|profile)[\s\n:]*([^]+?)(?=\n\n|\n[A-Z]|$)/gi;
    const matches = text.match(bioPatterns);
    return matches ? matches[0].substring(0, 300) : undefined;
  }

  private static extractCertifications(text: string): string[] {
    const certPatterns = /(?:certifications?|certificates?)[\s\n:]*([^]+?)(?=\n\n|\n[A-Z]|$)/gi;
    const certs: string[] = [];
    let match;
    
    while ((match = certPatterns.exec(text)) !== null) {
      const certLines = match[1].split('\n').map(s => s.trim()).filter(s => s.length > 0);
      certs.push(...certLines);
    }
    
    return certs;
  }

  private static extractEducation(text: string): string[] {
    const eduPatterns = /(?:education|degree|university|college|school)[\s\n:]*([^]+?)(?=\n\n|\n[A-Z]|$)/gi;
    const education: string[] = [];
    let match;
    
    while ((match = eduPatterns.exec(text)) !== null) {
      const eduLines = match[1].split('\n').map(s => s.trim()).filter(s => s.length > 0);
      education.push(...eduLines);
    }
    
    return education;
  }

  private static extractHobbies(text: string): string[] {
    const hobbyPatterns = /(?:hobbies|interests|activities)[\s\n:]*([^\n]+)/gi;
    const hobbies: string[] = [];
    let match;
    
    while ((match = hobbyPatterns.exec(text)) !== null) {
      const hobbyLine = match[1];
      const extractedHobbies = hobbyLine.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
      hobbies.push(...extractedHobbies);
    }
    
    return [...new Set(hobbies)];
  }

  private static extractLanguages(text: string): string[] {
    const langPatterns = /(?:languages?)[\s\n:]*([^\n]+)/gi;
    const languages: string[] = [];
    let match;
    
    while ((match = langPatterns.exec(text)) !== null) {
      const langLine = match[1];
      const extractedLangs = langLine.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
      languages.push(...extractedLangs);
    }
    
    return [...new Set(languages)];
  }

  private static validateMinimumRequirements(data: ParsedCVData): boolean {
    const hasName = data.full_name && data.full_name.trim().length > 2;
    const hasEmail = data.email && data.email.includes('@');
    const hasSkills = data.skills && data.skills.length > 0;
    
    return hasName && hasEmail && hasSkills;
  }
}
