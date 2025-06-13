
import { ParsedCVData } from './openai-cv-parser';

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
  suggestions: string[];
}

export interface FieldValidation {
  field: string;
  required: boolean;
  minLength?: number;
  validator?: (value: any) => boolean;
  suggestion?: string;
}

export class CVDataValidator {
  private static validationRules: FieldValidation[] = [
    {
      field: 'full_name',
      required: true,
      minLength: 2,
      suggestion: 'Please provide your full name'
    },
    {
      field: 'email',
      required: true,
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      suggestion: 'Please provide a valid email address'
    },
    {
      field: 'phone',
      required: false,
      suggestion: 'Adding a phone number helps recruiters contact you'
    },
    {
      field: 'skills',
      required: true,
      validator: (value: string[]) => Array.isArray(value) && value.length > 0,
      suggestion: 'Please add at least one technical skill'
    },
    {
      field: 'bio',
      required: false,
      minLength: 50,
      suggestion: 'A professional summary helps recruiters understand your background'
    },
    {
      field: 'work_experience',
      required: false,
      validator: (value: any[]) => Array.isArray(value) && value.length > 0,
      suggestion: 'Adding work experience strengthens your profile'
    },
    {
      field: 'education',
      required: false,
      validator: (value: string[]) => Array.isArray(value) && value.length > 0,
      suggestion: 'Including education information is recommended'
    },
    {
      field: 'certifications',
      required: false,
      suggestion: 'Professional certifications can strengthen your profile'
    },
    {
      field: 'project_summary',
      required: false,
      minLength: 100,
      suggestion: 'Describing your projects helps showcase your experience'
    }
  ];

  static validateCVData(data: ParsedCVData): ValidationResult {
    const missingFields: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    for (const rule of this.validationRules) {
      const value = data[rule.field as keyof ParsedCVData];
      
      // Check required fields
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        missingFields.push(rule.field);
        if (rule.suggestion) {
          suggestions.push(rule.suggestion);
        }
        continue;
      }

      // Check minimum length for strings
      if (value && rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        warnings.push(`${rule.field} is too short (minimum ${rule.minLength} characters)`);
        if (rule.suggestion) {
          suggestions.push(rule.suggestion);
        }
      }

      // Run custom validator
      if (value && rule.validator && !rule.validator(value)) {
        if (rule.required) {
          missingFields.push(rule.field);
        } else {
          warnings.push(`${rule.field} format may need improvement`);
        }
        if (rule.suggestion) {
          suggestions.push(rule.suggestion);
        }
      }

      // Check for missing optional but recommended fields
      if (!rule.required && (!value || (Array.isArray(value) && value.length === 0)) && rule.suggestion) {
        suggestions.push(rule.suggestion);
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings,
      suggestions: [...new Set(suggestions)] // Remove duplicates
    };
  }

  static getFieldCompleteness(data: ParsedCVData): { field: string; completed: boolean; suggestion?: string }[] {
    return this.validationRules.map(rule => {
      const value = data[rule.field as keyof ParsedCVData];
      let completed = false;

      if (value) {
        if (typeof value === 'string') {
          completed = value.trim().length > 0;
          if (rule.minLength) {
            completed = completed && value.length >= rule.minLength;
          }
        } else if (Array.isArray(value)) {
          completed = value.length > 0;
        } else {
          completed = true;
        }
      }

      if (rule.validator && value) {
        completed = completed && rule.validator(value);
      }

      return {
        field: rule.field,
        completed,
        suggestion: rule.suggestion
      };
    });
  }
}
