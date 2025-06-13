
import { PDFProcessor } from './pdf-processor';
import { SimpleCVParser, ParsedCVData, CVParsingResult } from './simple-cv-parser';
import { supabase } from '@/integrations/supabase/client';

export interface CVProcessingResult {
  success: boolean;
  data?: ParsedCVData;
  error?: string;
  rejected?: boolean;
  rejectionReason?: string;
}

export class CVProcessingService {
  async processCV(file: File, userId: string): Promise<CVProcessingResult> {
    try {
      // Step 1: Validate file type and size
      const validationResult = this.validateFile(file);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error
        };
      }

      // Step 2: Extract text from PDF
      const extractedData = await PDFProcessor.extractText(file);
      const preprocessedText = PDFProcessor.preprocessText(extractedData.text);
      
      // Step 3: Validate extracted text quality
      if (!PDFProcessor.validateExtractedText(preprocessedText)) {
        return {
          success: false,
          rejected: true,
          rejectionReason: 'CV does not contain sufficient readable content'
        };
      }

      // Step 4: Parse CV with simple parser
      const parsingResult: CVParsingResult = SimpleCVParser.parseCV(preprocessedText);
      
      if (!parsingResult.success) {
        return {
          success: false,
          error: `Failed to parse CV: ${parsingResult.error}`
        };
      }

      // Step 5: Check minimum requirements
      if (!parsingResult.hasMinimumRequirements) {
        return {
          success: false,
          rejected: true,
          rejectionReason: 'CV does not meet minimum requirements (missing name, email, or skills)'
        };
      }

      // Step 6: Upload file to storage
      const cvUrl = await this.uploadCVFile(file, userId);
      
      // Step 7: Update user profile with extracted data
      await this.updateUserProfile(userId, parsingResult.data!, cvUrl);

      return {
        success: true,
        data: parsingResult.data
      };

    } catch (error) {
      console.error('Error processing CV:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private validateFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only PDF and Word documents are allowed'
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 10MB'
      };
    }

    return { valid: true };
  }

  private async uploadCVFile(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/cv.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      throw new Error(`Failed to upload CV: ${uploadError.message}`);
    }

    return fileName;
  }

  private async updateUserProfile(userId: string, parsedData: ParsedCVData, cvUrl: string): Promise<void> {
    const updateData = {
      first_name: parsedData.full_name.split(' ')[0] || '',
      last_name: parsedData.full_name.split(' ').slice(1).join(' ') || '',
      email: parsedData.email,
      phone: parsedData.phone || null,
      skills: parsedData.skills || [],
      bio: parsedData.bio || null,
      experience_years: parsedData.experience_years || null,
      current_position: parsedData.current_position || null,
      current_company: parsedData.current_company || null,
      current_location: parsedData.location || null,
      linkedin_url: parsedData.linkedin_url || null,
      github_url: parsedData.github_url || null,
      certifications: parsedData.certifications || [],
      cv_url: cvUrl,
      tools: parsedData.tools || [],
      project_summary: parsedData.project_summary || null,
      education: parsedData.education || [],
      hobbies: parsedData.hobbies || [],
      languages: parsedData.languages || [],
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
}
