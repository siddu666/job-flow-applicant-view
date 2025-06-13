
export interface CVGenerationData {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  professionalSummary: {
    bio?: string;
    experienceYears?: number;
    currentPosition?: string;
    currentCompany?: string;
  };
  skills: string[];
  certifications?: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
  experience?: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}

export class CVGenerator {
  static generateJusterGroupCV(data: CVGenerationData): string {
    const currentDate = new Date().toLocaleDateString('sv-SE');
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${data.personalInfo.fullName} | Juster Group AB</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .cv-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .company-logo {
            text-align: right;
            margin-bottom: 15px;
        }
        
        .company-name {
            font-size: 18px;
            font-weight: 600;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .candidate-name {
            font-size: 32px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            color: #666;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .summary {
            font-size: 14px;
            line-height: 1.7;
            text-align: justify;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 8px;
        }
        
        .skill-item {
            background: #f3f4f6;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid #e5e7eb;
        }
        
        .experience-item, .project-item {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .experience-item:last-child, .project-item:last-child {
            border-bottom: none;
        }
        
        .job-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
        }
        
        .company-name-exp {
            font-size: 14px;
            color: #2563eb;
            font-weight: 500;
        }
        
        .duration {
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
        }
        
        .description {
            margin-top: 8px;
            font-size: 13px;
            line-height: 1.6;
        }
        
        .certifications-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .certification-item {
            background: #dbeafe;
            color: #1e40af;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        
        .professional-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .stat-item {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: #2563eb;
        }
        
        .stat-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        @media print {
            .cv-container {
                box-shadow: none;
                padding: 15mm;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <header class="header">
            <div class="company-logo">
                <div class="company-name">Juster Group AB</div>
            </div>
            <h1 class="candidate-name">${data.personalInfo.fullName}</h1>
            <div class="contact-info">
                <div class="contact-item">📧 ${data.personalInfo.email}</div>
                ${data.personalInfo.phone ? `<div class="contact-item">📱 ${data.personalInfo.phone}</div>` : ''}
                ${data.personalInfo.location ? `<div class="contact-item">📍 ${data.personalInfo.location}</div>` : ''}
                ${data.personalInfo.linkedinUrl ? `<div class="contact-item">🔗 LinkedIn</div>` : ''}
                ${data.personalInfo.githubUrl ? `<div class="contact-item">🐙 GitHub</div>` : ''}
            </div>
        </header>

        ${data.professionalSummary.experienceYears || data.skills.length || data.certifications?.length ? `
        <div class="professional-stats">
            ${data.professionalSummary.experienceYears ? `
            <div class="stat-item">
                <div class="stat-number">${data.professionalSummary.experienceYears}</div>
                <div class="stat-label">Years Experience</div>
            </div>
            ` : ''}
            <div class="stat-item">
                <div class="stat-number">${data.skills.length}</div>
                <div class="stat-label">Technical Skills</div>
            </div>
            ${data.certifications?.length ? `
            <div class="stat-item">
                <div class="stat-number">${data.certifications.length}</div>
                <div class="stat-label">Certifications</div>
            </div>
            ` : ''}
        </div>
        ` : ''}

        ${data.professionalSummary.bio ? `
        <section class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p class="summary">${data.professionalSummary.bio}</p>
            ${data.professionalSummary.currentPosition && data.professionalSummary.currentCompany ? `
            <p class="summary" style="margin-top: 10px; font-weight: 500;">
                Currently working as ${data.professionalSummary.currentPosition} at ${data.professionalSummary.currentCompany}
            </p>
            ` : ''}
        </section>
        ` : ''}

        ${data.skills.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Technical Skills</h2>
            <div class="skills-grid">
                ${data.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
            </div>
        </section>
        ` : ''}

        ${data.experience && data.experience.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${data.experience.map(exp => `
            <div class="experience-item">
                <div class="job-title">${exp.position}</div>
                <div class="company-name-exp">${exp.company}</div>
                <div class="duration">${exp.duration}</div>
                <div class="description">${exp.description}</div>
            </div>
            `).join('')}
        </section>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Key Projects</h2>
            ${data.projects.map(project => `
            <div class="project-item">
                <div class="job-title">${project.name}</div>
                <div class="description">${project.description}</div>
                ${project.technologies ? `
                <div style="margin-top: 8px;">
                    <strong>Technologies:</strong> ${project.technologies.join(', ')}
                </div>
                ` : ''}
            </div>
            `).join('')}
        </section>
        ` : ''}

        ${data.certifications && data.certifications.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Certifications</h2>
            <div class="certifications-list">
                ${data.certifications.map(cert => `<div class="certification-item">${cert}</div>`).join('')}
            </div>
        </section>
        ` : ''}

        ${data.education && data.education.length > 0 ? `
        <section class="section">
            <h2 class="section-title">Education</h2>
            ${data.education.map(edu => `
            <div class="experience-item">
                <div class="job-title">${edu.degree}</div>
                <div class="company-name-exp">${edu.institution}</div>
                <div class="duration">${edu.year}</div>
            </div>
            `).join('')}
        </section>
        ` : ''}

        <footer class="footer">
            Generated by Juster Group AB CV System • ${currentDate}
        </footer>
    </div>
</body>
</html>
    `.trim();
  }

  static async generatePDF(htmlContent: string): Promise<Blob> {
    // In a real implementation, you would use a library like Puppeteer or jsPDF
    // For now, we'll return the HTML as a blob that can be saved as HTML
    return new Blob([htmlContent], { type: 'text/html' });
  }
}
