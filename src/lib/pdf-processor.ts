
import pdfParse from 'pdf-parse';

export interface ExtractedText {
  text: string;
  numPages: number;
  info?: any;
}

export class PDFProcessor {
  static async extractText(file: File): Promise<ExtractedText> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const data = await pdfParse(buffer);
      
      return {
        text: data.text,
        numPages: data.numpages,
        info: data.info
      };
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  static preprocessText(text: string): string {
    // Remove special characters and normalize spacing
    let cleaned = text
      .replace(/[^\w\s@.-]/g, ' ') // Keep only word chars, spaces, @, ., -
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    return cleaned;
  }

  static validateExtractedText(text: string): boolean {
    // Check if the text has minimum required length and content
    const minLength = 100;
    const hasEmail = /@/.test(text);
    const hasWords = text.split(' ').length > 20;
    
    return text.length >= minLength && hasEmail && hasWords;
  }
}
