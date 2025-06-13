
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
export interface ExtractedData {
  text: string;
  pages: number;
  metadata?: any;
}

export class PDFProcessor {
  static async extractText(file: File): Promise<ExtractedData> {
    // Simple text extraction for non-OpenAI approach
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          
          // For now, we'll extract basic text information
          // In a production environment, you'd use a proper PDF parsing library
          const text = await this.extractTextFromArrayBuffer(arrayBuffer);
          
          resolve({
            text,
            pages: 1,
            metadata: {
              title: file.name,
              size: file.size
            }
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private static async extractTextFromArrayBuffer(buffer: ArrayBuffer): Promise<string> {
    // This is a simplified approach - in production you'd use pdf-parse or similar
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(buffer);
    
    // Extract readable text (very basic approach)
    const readableText = text.replace(/[^\x20-\x7E\n\r]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return readableText || 'Unable to extract text from PDF';
  }

  static preprocessText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s@.-]/g, ' ')
      .trim()
      .toLowerCase();
  }

  static validateExtractedText(text: string): boolean {
    if (!text || text.length < 50) return false;
    
    // Check for common CV elements
    const cvKeywords = ['experience', 'skill', 'education', 'work', 'job', 'position', 'company'];
    const hasKeywords = cvKeywords.some(keyword => text.includes(keyword));
    
    return hasKeywords && text.length > 100;
  }
}
