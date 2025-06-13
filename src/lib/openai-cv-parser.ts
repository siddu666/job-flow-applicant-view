
import OpenAI from 'openai';

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
  work_experience?: WorkExperience[];
}

export interface WorkExperience {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface CVParsingResult {
  success: boolean;
  data?: ParsedCVData;
  error?: string;
  hasMinimumRequirements: boolean;
}

export class OpenAICVParser {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async parseCV(cvText: string): Promise<CVParsingResult> {
    try {
      const prompt = this.createParsingPrompt(cvText);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert CV/Resume parser. Extract structured information from the provided CV text and return it as valid JSON. Be precise and only extract information that is clearly present in the text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const parsedData: ParsedCVData = JSON.parse(content);
      
      // Validate minimum requirements
      const hasMinimumRequirements = this.validateMinimumRequirements(parsedData);
      
      return {
        success: true,
        data: parsedData,
        hasMinimumRequirements
      };
      
    } catch (error) {
      console.error('Error parsing CV with OpenAI:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        hasMinimumRequirements: false
      };
    }
  }

  private createParsingPrompt(cvText: string): string {
    return `
Please extract the following information from this CV/Resume text and return it as a valid JSON object with these exact field names:

{
  "full_name": "Full name of the person",
  "email": "Email address",
  "phone": "Phone number (optional)",
  "skills": ["Array of technical skills, programming languages"],
  "tools": ["Array of tools, software, frameworks, platforms"],
  "project_summary": "Brief summary of key projects and achievements",
  "experience_years": "Number of years of experience (estimate if not explicit)",
  "current_position": "Current job title (optional)",
  "current_company": "Current company (optional)",
  "location": "Location/City (optional)",
  "linkedin_url": "LinkedIn profile URL (optional)",
  "github_url": "GitHub profile URL (optional)",
  "bio": "Professional summary or objective (optional)",
  "certifications": ["Array of certifications with issuing organization"],
  "education": ["Array of education entries: degree, institution, year"],
  "hobbies": ["Array of hobbies and personal interests"],
  "languages": ["Array of languages with proficiency level"],
  "work_experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "location": "Work location (optional)",
      "startDate": "Start date (optional)",
      "endDate": "End date or 'Present' (optional)",
      "description": "Job responsibilities and achievements (optional)"
    }
  ]
}

Rules:
1. Only include information that is clearly present in the CV
2. For skills and tools, differentiate between technical skills and software/tools
3. Extract all work experience entries with as much detail as available
4. Include education with degree, institution, and graduation year if available
5. Extract hobbies, interests, and languages mentioned
6. If a field is not found or unclear, omit it or use null
7. Ensure the JSON is valid and properly formatted
8. For experience_years, estimate based on work history if not explicitly stated

CV Text:
${cvText}
`;
  }

  private validateMinimumRequirements(data: ParsedCVData): boolean {
    // Check if candidate has minimum required information
    const hasName = data.full_name && data.full_name.trim().length > 2;
    const hasEmail = data.email && data.email.includes('@');
    const hasSkills = data.skills && data.skills.length > 0;
    const hasExperience = data.experience_years !== undefined && data.experience_years > 0;
    const hasProjects = data.project_summary && data.project_summary.trim().length > 20;
    
    // Candidate must have at least: name, email, skills, and either experience or meaningful projects
    return hasName && hasEmail && hasSkills && (hasExperience || hasProjects);
  }
}
