'use client'

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/interfaces/Profile"

export interface CandidateMatch extends Profile {
  match_score: number
  match_reasons: {
    skills_match: {
      matching_skills: string[]
      missing_skills: string[]
      score: number
      skill_coverage: number
    }
    location_match: {
      is_same_location: boolean
      is_nearby: boolean
      is_remote_friendly: boolean
      score: number
    }
    experience_match: {
      candidate_experience: number
      required_level: string
      is_overqualified: boolean
      is_underqualified: boolean
      is_perfect_match: boolean
      score: number
    }
    availability_match: {
      is_available: boolean
      visa_status_suitable: boolean
      score: number
    }
    overall_compatibility: string
    recommendation_strength: 'high' | 'medium' | 'low'
  }
}

// Enhanced skills matching with fuzzy logic
const calculateAdvancedSkillsMatch = (candidateSkills: string[], jobSkills: string[]) => {
  if (!candidateSkills?.length || !jobSkills?.length) {
    return {
      matchingSkills: [],
      missingSkills: jobSkills || [],
      score: 0,
      skillCoverage: 0
    }
  }

  const normalizeSkill = (skill: string) => skill.toLowerCase().trim()
  const normalizedCandidateSkills = candidateSkills.map(normalizeSkill)
  const normalizedJobSkills = jobSkills.map(normalizeSkill)

  const matchingSkills: string[] = []
  const missingSkills: string[] = []

  // Advanced skill matching with categories and relationships
  // Add proper type annotation with index signature
  const skillRelationships: Record<string, string[]> = {
    react: ['javascript', 'jsx', 'frontend development', 'web development', 'react hooks', 'redux', 'state management', 'responsive design'],
    vue: ['javascript', 'frontend development', 'web development', 'vuex', 'vue router', 'single file components', 'reactivity'],
    angular: ['typescript', 'javascript', 'frontend development', 'web development', 'angular cli', 'rxjs', 'dependency injection', 'angular modules'],
    'node.js': ['javascript', 'backend development', 'server-side scripting', 'express.js', 'restful apis', 'middleware', 'npm'],
    python: ['django', 'flask', 'data science', 'machine learning', 'pandas', 'numpy', 'matplotlib', 'data analysis'],
    java: ['spring', 'spring boot', 'backend development', 'enterprise applications', 'hibernate', 'maven', 'junit', 'microservices'],
    aws: ['cloud computing', 'devops', 'infrastructure as code', 'aws services', 'ec2', 's3', 'lambda', 'cloudformation'],
    docker: ['containerization', 'devops', 'kubernetes', 'docker compose', 'docker swarm', 'continuous integration', 'continuous deployment'],
    postgresql: ['sql', 'database management', 'backend development', 'pl/pgsql', 'database design', 'query optimization', 'data integrity'],
    mongodb: ['nosql', 'database management', 'backend development', 'data modeling', 'aggregation framework', 'indexing', 'replication'],
    git: ['version control', 'collaboration', 'development workflow', 'git commands', 'branching strategies', 'pull requests', 'code review'],
    'devops engineer': ['ci/cd pipelines', 'automation', 'infrastructure as code', 'monitoring', 'cloud services', 'configuration management', 'scripting'],
    'radio engineer': ['rf engineering', 'signal processing', 'telecommunications', 'antenna design', 'electromagnetic theory', 'circuit design', 'testing and measurement'],
    'citrix admin': ['citrix virtual apps', 'citrix virtual desktops', 'citrix adc', 'citrix gateway', 'citrix policies', 'troubleshooting', 'user support'],
    'windows admin': ['active directory', 'group policy', 'powershell scripting', 'windows server management', 'system administration', 'network configuration', 'security management'],
    'network engineer': ['lan/wan management', 'tcp/ip', 'routing and switching', 'firewalls', 'network security', 'vpn management', 'network protocols'],
    'mechanical engineer': ['cad software', 'thermodynamics', 'fluid mechanics', 'materials science', 'finite element analysis', 'manufacturing processes', 'product design'],
    'embedded developer': ['c/c++ programming', 'microcontroller architectures', 'rtos', 'pcb design', 'firmware development', 'debugging tools', 'hardware interfacing'],
    'c++ developer': ['advanced c++', 'stl', 'boost libraries', 'multithreading', 'memory management', 'design patterns', 'software architecture'],
    'cybersecurity engineer': ['ethical hacking', 'intrusion detection systems', 'firewalls', 'security compliance', 'cryptography', 'penetration testing', 'security protocols'],
    'microsoft dynamics developer': ['c#', '.net framework', 'dynamics 365', 'power platform', 'azure integration', 'custom development', 'data migration'],
    'salesforce developer': ['apex programming', 'visualforce', 'lightning web components', 'salesforce apis', 'soql', 'salesforce configuration', 'integration'],
    'sap consultant': ['abap programming', 'sap modules', 'sap hana', 'sap integration', 'business process analysis', 'sap configuration', 'data migration'],
    'windchill engineer': ['plm', 'windchill customization', 'cad integration', 'workflow management', 'system administration', 'data management', 'user support'],
    'robotics developer': ['ros', 'sensor integration', 'control systems', 'machine vision', 'ai/ml', 'robotics frameworks', 'automation'],
    'automotive developer': ['autosar', 'can bus', 'embedded systems', 'vehicle dynamics', 'automotive safety standards', 'diagnostics', 'vehicle networking'],
    'data analyst': ['sql', 'data visualization', 'statistical analysis', 'excel', 'data cleaning', 'reporting', 'data mining'],
    'data scientist': ['python/r programming', 'machine learning', 'data mining', 'big data technologies', 'statistical analysis', 'predictive modeling', 'data visualization'],
    'cloud developer': ['cloud services', 'serverless architecture', 'microservices', 'containers', 'cloud security', 'api development', 'scalability'],
    'architect': ['system design', 'scalability', 'high availability', 'cloud architecture', 'enterprise solutions', 'security architecture', 'technology evaluation'],
    'axure software architect': ['axure', 'prototyping', 'user flows', 'wireframing', 'interactive design', 'usability testing', 'design systems'],
    'ux/ui designer': ['user research', 'wireframing', 'prototyping', 'usability testing', 'design tools', 'interaction design', 'visual design'],
    'sap skills': ['sap erp', 'sap s/4hana', 'sap fico', 'sap mm', 'sap sd', 'sap abap', 'sap basis'],
    '.net developer': ['c#', '.net framework', 'asp.net', 'entity framework', 'visual studio', 'web api', 'blazor'],
    'c# developer': ['c#', '.net', 'oop', 'visual studio', 'software development', 'linq', 'async programming'],
    'cybersecurity expert': ['penetration testing', 'vulnerability assessment', 'threat analysis', 'security architecture', 'incident response', 'security policies', 'compliance'],
    'data engineer': ['data pipelines', 'etl processes', 'big data technologies', 'data warehousing', 'sql', 'data modeling', 'data integration'],
    'sap expert': ['sap implementation', 'sap configuration', 'sap customization', 'sap integration', 'sap security', 'sap workflow', 'sap reporting'],
    'ai/ml engineer': ['machine learning', 'deep learning', 'neural networks', 'natural language processing', 'computer vision', 'data modeling', 'algorithm development'],
    'blockchain developer': ['blockchain technology', 'smart contracts', 'ethereum', 'hyperledger', 'solidity', 'cryptography', 'decentralized applications'],
    'mobile developer': ['ios development', 'android development', 'flutter', 'react native', 'mobile ui/ux', 'api integration', 'mobile security'],
    'game developer': ['game design', 'unity', 'unreal engine', 'c++', 'game physics', '3d modeling', 'animation'],
    'qa engineer': ['test automation', 'manual testing', 'test planning', 'selenium', 'jira', 'bug tracking', 'quality assurance'],
    'full stack developer': ['frontend development', 'backend development', 'database management', 'api development', 'devops basics', 'system architecture', 'project management'],
    'database administrator': ['database design', 'sql', 'database security', 'data backup', 'performance tuning', 'data recovery', 'database software'],
    'security analyst': ['security assessment', 'risk management', 'compliance', 'security monitoring', 'incident handling', 'vulnerability management', 'threat detection'],
    'product manager': ['product lifecycle management', 'agile methodologies', 'market research', 'roadmapping', 'stakeholder management', 'product strategy', 'user experience'],
    'business analyst': ['requirements gathering', 'data analysis', 'business process modeling', 'stakeholder analysis', 'reporting', 'business intelligence', 'project management'],
    'hr specialist': ['recruitment', 'employee relations', 'performance management', 'hr policies', 'compliance', 'training and development', 'compensation and benefits'],
    'marketing specialist': ['digital marketing', 'seo', 'content creation', 'social media management', 'market analysis', 'brand management', 'campaign management'],
    'financial analyst': ['financial modeling', 'data analysis', 'budgeting', 'forecasting', 'reporting', 'financial planning', 'investment analysis'],
    'graphic designer': ['graphic design', 'adobe creative suite', 'branding', 'typography', 'ui design', 'layout design', 'color theory'],
    'content writer': ['content creation', 'seo writing', 'blog writing', 'copywriting', 'editing', 'content strategy', 'social media content'],
    'project manager': ['project planning', 'risk management', 'agile methodologies', 'stakeholder communication', 'budget management', 'team leadership', 'project delivery'],
    'systems analyst': ['systems analysis', 'requirements gathering', 'process modeling', 'data analysis', 'system design', 'software development lifecycle', 'user acceptance testing'],
    'hardware engineer': ['circuit design', 'pcb design', 'embedded systems', 'hardware testing', 'prototyping', 'schematic capture', 'electronic design'],
    'biomedical engineer': ['biomedical systems', 'medical devices', 'biomechanics', 'biomaterials', 'regulatory compliance', 'clinical engineering', 'rehabilitation engineering'],
    'environmental engineer': ['environmental impact assessment', 'sustainability', 'waste management', 'water treatment', 'regulatory compliance', 'pollution control', 'environmental modeling'],
    'civil engineer': ['structural engineering', 'construction management', 'site planning', 'building codes', 'project management', 'surveying', 'material testing'],
    'electrical engineer': ['circuit design', 'power systems', 'control systems', 'electromagnetic theory', 'instrumentation', 'signal processing', 'microelectronics'],
    'chemical engineer': ['chemical processes', 'process design', 'safety protocols', 'material science', 'environmental impact', 'chemical reactions', 'process simulation'],
    'software tester': ['test planning', 'test case design', 'automated testing', 'manual testing', 'bug tracking', 'test management', 'quality standards'],
    'network security specialist': ['network security', 'firewall management', 'intrusion detection', 'vpn management', 'security protocols', 'network monitoring', 'threat analysis'],
    'data architect': ['data modeling', 'database design', 'data strategy', 'data governance', 'data integration', 'data quality', 'metadata management'],
    'cloud architect': ['cloud infrastructure', 'cloud security', 'cloud migration', 'cloud strategy', 'cloud cost management', 'multi-cloud environments', 'disaster recovery'],
    'it support specialist': ['technical support', 'help desk', 'troubleshooting', 'system maintenance', 'user training', 'it service management', 'hardware support'],
    'erp consultant': ['erp implementation', 'erp customization', 'business process analysis', 'erp integration', 'erp training', 'data migration', 'system configuration'],
    'crm specialist': ['crm implementation', 'customer data management', 'sales processes', 'crm customization', 'crm training', 'data analysis', 'customer service'],
    'supply chain analyst': ['supply chain management', 'logistics', 'inventory management', 'procurement', 'supply chain optimization', 'data analysis', 'vendor management'],
    'healthcare it specialist': ['healthcare systems', 'electronic health records', 'healthcare data security', 'healthcare compliance', 'healthcare software', 'healthcare analytics', 'healthcare integration'],
    'e-commerce specialist': ['e-commerce platforms', 'online sales strategies', 'digital marketing', 'customer experience', 'payment gateways', 'website management', 'seo'],
    'digital transformation consultant': ['digital strategy', 'process automation', 'change management', 'digital tools', 'innovation', 'project management', 'business analysis'],
    'automation engineer': ['automation scripting', 'process automation', 'robotics', 'control systems', 'automation tools', 'plc programming', 'system integration'],
    'technical writer': ['technical documentation', 'user manuals', 'api documentation', 'technical editing', 'content management', 'instructional design', 'information architecture'],
    'ui/ux researcher': ['user research', 'usability testing', 'user interviews', 'survey design', 'data analysis', 'user experience design', 'information architecture'],
    'seo specialist': ['search engine optimization', 'keyword research', 'content optimization', 'link building', 'analytics', 'seo tools', 'digital marketing'],
    'it project coordinator': ['project coordination', 'task management', 'team collaboration', 'project documentation', 'communication', 'scheduling', 'resource allocation'],
    'business intelligence analyst': ['data analysis', 'business intelligence tools', 'data visualization', 'reporting', 'data warehousing', 'sql', 'business analytics'],
    'customer support specialist': ['customer service', 'help desk support', 'customer communication', 'problem resolution', 'customer feedback', 'service improvement', 'customer satisfaction'],
    'sales engineer': ['sales strategies', 'product knowledge', 'customer presentations', 'sales negotiations', 'customer relationship management', 'technical support', 'market analysis'],
    'compliance officer': ['regulatory compliance', 'compliance audits', 'policy development', 'risk assessment', 'training', 'compliance reporting', 'legal requirements'],
    'it auditor': ['it audits', 'compliance checking', 'risk assessment', 'security audits', 'reporting', 'audit planning', 'control evaluation'],
    'machine learning researcher': ['machine learning algorithms', 'data analysis', 'model training', 'research', 'publication', 'data modeling', 'statistical analysis'],
    'virtual reality developer': ['vr development', '3d modeling', 'unity', 'unreal engine', 'user experience design', 'vr hardware', 'interaction design'],
    'augmented reality developer': ['ar development', '3d modeling', 'unity', 'ar tools', 'user experience design', 'ar hardware', 'interaction design'],
    'cybersecurity analyst': ['threat analysis', 'vulnerability assessment', 'security monitoring', 'incident response', 'compliance', 'security tools', 'risk management'],
    'it consultant': ['it strategy', 'systems analysis', 'it solutions', 'project management', 'client communication', 'technology evaluation', 'business process improvement'],
    'software architect': ['software design', 'system architecture', 'technology selection', 'design patterns', 'software development methodologies', 'system integration', 'scalability'],
    'mobile app designer': ['mobile ui design', 'user experience design', 'prototyping', 'wireframing', 'design tools', 'user interface guidelines', 'responsive design'],
    'cloud security specialist': ['cloud security', 'identity management', 'data protection', 'compliance', 'security architecture', 'threat detection', 'incident response'],
    'data privacy officer': ['data privacy', 'compliance', 'data protection laws', 'privacy policies', 'risk management', 'data governance', 'audit management'],
    'it risk manager': ['risk assessment', 'risk management', 'compliance', 'security policies', 'incident management', 'risk mitigation', 'audit management'],
    'it service manager': ['service management', 'itil frameworks', 'service delivery', 'incident management', 'customer support', 'service improvement', 'team management'],
    'it infrastructure manager': ['infrastructure management', 'network management', 'server management', 'it security', 'disaster recovery', 'capacity planning', 'system monitoring'],
    'it operations manager': ['operations management', 'process improvement', 'team management', 'it service delivery', 'performance monitoring', 'budget management', 'strategic planning'],
    'it procurement specialist': ['procurement strategies', 'vendor management', 'contract negotiation', 'cost analysis', 'supply chain management', 'procurement processes', 'vendor evaluation'],
    'it asset manager': ['asset management', 'inventory management', 'asset tracking', 'compliance', 'reporting', 'asset lifecycle management', 'cost management'],
    'it compliance manager': ['compliance management', 'policy development', 'audit management', 'risk assessment', 'training', 'compliance reporting', 'regulatory requirements'],
    'it governance specialist': ['governance frameworks', 'policy development', 'compliance', 'risk management', 'audit management', 'strategic planning', 'performance monitoring'],
    'it quality assurance manager': ['quality assurance', 'test management', 'process improvement', 'compliance', 'team management', 'quality standards', 'continuous improvement'],
    'it training coordinator': ['training programs', 'curriculum development', 'training delivery', 'e-learning', 'assessment', 'training needs analysis', 'instructional design'],
    'it vendor manager': ['vendor management', 'contract negotiation', 'vendor performance', 'relationship management', 'procurement', 'vendor evaluation', 'contract management'],
    'it business analyst': ['business analysis', 'requirements gathering', 'process modeling', 'data analysis', 'stakeholder management', 'business process improvement', 'project management'],
    'it data manager': ['data management', 'data governance', 'data quality', 'data integration', 'compliance', 'data architecture', 'data lifecycle management'],
    'it disaster recovery specialist': ['disaster recovery planning', 'business continuity', 'risk assessment', 'recovery strategies', 'testing', 'data backup', 'emergency response'],
    'it help desk manager': ['help desk management', 'team management', 'customer support', 'service delivery', 'performance monitoring', 'training', 'quality assurance'],
    'it innovation manager': ['innovation strategies', 'technology trends', 'research and development', 'project management', 'team leadership', 'business analysis', 'product development'],
    'it knowledge manager': ['knowledge management', 'information architecture', 'content management', 'data analysis', 'user training', 'knowledge sharing', 'documentation management'],
    'it performance manager': ['performance management', 'monitoring', 'performance tuning', 'capacity planning', 'reporting', 'performance analysis', 'system optimization'],
    'it policy manager': ['policy development', 'compliance', 'risk management', 'policy implementation', 'audit management', 'policy review', 'regulatory compliance'],
    'it research analyst': ['research', 'data analysis', 'market trends', 'technology trends', 'reporting', 'competitive analysis', 'strategic recommendations'],
    'it resource manager': ['resource management', 'capacity planning', 'resource allocation', 'performance monitoring', 'reporting', 'budget management', 'strategic planning'],
    'it security auditor': ['security audits', 'compliance checking', 'risk assessment', 'security policies', 'reporting', 'audit planning', 'security standards'],
    'it service desk analyst': ['service desk analysis', 'incident management', 'customer support', 'problem resolution', 'reporting', 'service improvement', 'performance metrics'],
    'it strategy consultant': ['it strategy', 'business analysis', 'technology trends', 'project management', 'client communication', 'business process improvement', 'innovation management'],
    'it systems analyst': ['systems analysis', 'requirements gathering', 'process modeling', 'data analysis', 'system design', 'software development lifecycle', 'user acceptance testing'],
    'it technical architect': ['technical architecture', 'system design', 'technology selection', 'integration', 'security', 'system optimization', 'scalability'],
    'it technical support engineer': ['technical support', 'troubleshooting', 'system maintenance', 'user training', 'documentation', 'help desk', 'customer service'],
    'it technical support specialist': ['technical support', 'help desk support', 'troubleshooting', 'system maintenance', 'user training', 'customer service', 'problem resolution'],
    'it technical trainer': ['technical training', 'curriculum development', 'training delivery', 'e-learning', 'assessment', 'instructional design', 'training needs analysis'],
    'it technology analyst': ['technology analysis', 'technology trends', 'research', 'data analysis', 'reporting', 'technology evaluation', 'strategic recommendations'],
    'it technology consultant': ['technology consulting', 'technology solutions', 'project management', 'client communication', 'technology trends', 'business process improvement', 'system integration'],
    'it technology coordinator': ['technology coordination', 'project management', 'team collaboration', 'communication', 'documentation', 'technology evaluation', 'process improvement'],
    'it technology director': ['technology strategy', 'technology management', 'project management', 'team leadership', 'budget management', 'innovation management', 'strategic planning'],
    'it technology manager': ['technology management', 'project management', 'team management', 'technology trends', 'budget management', 'strategic planning', 'performance monitoring'],
    'it test analyst': ['test analysis', 'test planning', 'test execution', 'defect tracking', 'reporting', 'test management', 'quality assurance'],
    'it test coordinator': ['test coordination', 'test planning', 'test execution', 'team collaboration', 'reporting', 'test management', 'quality standards'],
    'it test engineer': ['test engineering', 'test automation', 'test planning', 'test execution', 'defect tracking', 'test management', 'quality assurance'],
    'it test manager': ['test management', 'test planning', 'team management', 'test execution', 'reporting', 'quality assurance', 'continuous improvement'],
    'it transformation manager': ['transformation strategies', 'change management', 'project management', 'team leadership', 'business analysis', 'innovation management', 'strategic planning'],
    'it vendor management specialist': ['vendor management', 'contract negotiation', 'vendor performance', 'relationship management', 'procurement', 'vendor evaluation', 'contract management']
  };

  normalizedJobSkills.forEach(jobSkill => {
    let hasMatch = false
    let matchedSkill = ''

    // Direct match
    if (normalizedCandidateSkills.includes(jobSkill)) {
      hasMatch = true
      matchedSkill = candidateSkills.find(s => normalizeSkill(s) === jobSkill) || jobSkill
    }

    // Fuzzy matching and skill relationships
    if (!hasMatch) {
      for (const candidateSkill of normalizedCandidateSkills) {
        // Partial string matching
        if (candidateSkill.includes(jobSkill) || jobSkill.includes(candidateSkill)) {
          hasMatch = true
          matchedSkill = candidateSkills.find(s => normalizeSkill(s) === candidateSkill) || candidateSkill
          break
        }

        // Skill relationship matching - now properly typed
        const jobSkillRelated = skillRelationships[jobSkill] || []
        const candidateSkillRelated = skillRelationships[candidateSkill] || []

        if (jobSkillRelated.includes(candidateSkill) || candidateSkillRelated.includes(jobSkill)) {
          hasMatch = true
          matchedSkill = candidateSkills.find(s => normalizeSkill(s) === candidateSkill) || candidateSkill
          break
        }
      }
    }

    if (hasMatch && matchedSkill) {
      matchingSkills.push(matchedSkill)
    } else {
      const originalSkill = jobSkills.find(s => normalizeSkill(s) === jobSkill) || jobSkill
      missingSkills.push(originalSkill)
    }
  })

  const score = normalizedJobSkills.length > 0
      ? (matchingSkills.length / normalizedJobSkills.length) * 100
      : 0

  // Calculate skill coverage (how many of candidate's skills are relevant)
  const relevantCandidateSkills = candidateSkills.filter(candidateSkill =>
      jobSkills.some(jobSkill =>
          normalizeSkill(candidateSkill).includes(normalizeSkill(jobSkill)) ||
          normalizeSkill(jobSkill).includes(normalizeSkill(candidateSkill))
      )
  )

  const skillCoverage = candidateSkills.length > 0
      ? (relevantCandidateSkills.length / candidateSkills.length) * 100
      : 0

  return {
    matchingSkills,
    missingSkills,
    score: Math.round(score),
    skillCoverage: Math.round(skillCoverage)
  }
}

// Enhanced location matching
const calculateAdvancedLocationMatch = (candidateLocation: string, jobLocation: string) => {
  const normalizeLocation = (loc: string) => loc.toLowerCase().trim()
  const normalizedCandidateLoc = normalizeLocation(candidateLocation || '')
  const normalizedJobLoc = normalizeLocation(jobLocation || '')

  const isSameLocation = normalizedCandidateLoc === normalizedJobLoc
  const isRemoteFriendly = normalizedJobLoc.includes('remote') || normalizedJobLoc.includes('anywhere')

  // Define nearby locations with proper typing
  const nearbyLocations: Record<string, string[]> = {
    stockholm: ['uppsala', 'västerås', 'södertälje'],
    gothenburg: ['göteborg', 'borås', 'trollhättan'],
    malmö: ['lund', 'helsingborg', 'kristianstad'],
    uppsala: ['stockholm', 'västerås'],
    linköping: ['norrköping', 'motala'],
    örebro: ['eskilstuna', 'västerås']
  };

  const isNearby = nearbyLocations[normalizedCandidateLoc]?.includes(normalizedJobLoc) ||
      nearbyLocations[normalizedJobLoc]?.includes(normalizedCandidateLoc) ||
      false

  let score = 0
  if (isSameLocation) score = 100
  else if (isRemoteFriendly) score = 95
  else if (isNearby) score = 75
  else score = 40 // Still possible with relocation

  return {
    isSameLocation,
    isNearby,
    isRemoteFriendly,
    score
  }
}

// Enhanced experience matching
const calculateAdvancedExperienceMatch = (candidateExperience: number, jobExperienceLevel: string) => {
  // Define experience levels with proper typing
  const experienceLevels: Record<string, { min: number; max: number; ideal: number }> = {
    'entry level': { min: 0, max: 2, ideal: 1 },
    'junior': { min: 0, max: 3, ideal: 2 },
    'mid level': { min: 2, max: 6, ideal: 4 },
    'senior level': { min: 5, max: 12, ideal: 8 },
    'senior': { min: 5, max: 12, ideal: 8 },
    'lead': { min: 7, max: 15, ideal: 10 },
    'principal': { min: 10, max: 20, ideal: 15 },
    'architect': { min: 12, max: 25, ideal: 18 }
  };

  const normalizedLevel = jobExperienceLevel?.toLowerCase() || 'any level'
  const levelRange = experienceLevels[normalizedLevel] || { min: 0, max: 100, ideal: candidateExperience }

  const isUnderqualified = candidateExperience < levelRange.min
  const isOverqualified = candidateExperience > levelRange.max + 3
  const isPerfectMatch = candidateExperience >= levelRange.min && candidateExperience <= levelRange.max

  let score = 0
  if (isPerfectMatch) {
    // Calculate how close to ideal experience
    const distanceFromIdeal = Math.abs(candidateExperience - levelRange.ideal)
    score = Math.max(100 - (distanceFromIdeal * 5), 80)
  } else if (isUnderqualified) {
    const gap = levelRange.min - candidateExperience
    score = Math.max(60 - (gap * 15), 20)
  } else if (isOverqualified) {
    const excess = candidateExperience - levelRange.max
    score = Math.max(70 - (excess * 5), 30)
  }

  return {
    candidateExperience,
    requiredLevel: jobExperienceLevel,
    isOverqualified,
    isUnderqualified,
    isPerfectMatch,
    score: Math.round(score)
  }
}

// Calculate availability and visa status match
const calculateAvailabilityMatch = (candidate: Profile) => {
  const isAvailable = candidate.availability !== 'not_available'
  const visaStatusSuitable = candidate.visa_status === 'citizen' ||
      candidate.visa_status === 'permanent_resident' ||
      candidate.visa_status === 'work_permit'

  let score = 0
  if (isAvailable && visaStatusSuitable) score = 100
  else if (isAvailable || visaStatusSuitable) score = 70
  else score = 30

  return {
    isAvailable,
    visaStatusSuitable,
    score
  }
}

// Get recommendation strength and overall compatibility
const getRecommendationAnalysis = (overallScore: number) => {
  let strength: 'high' | 'medium' | 'low'
  let compatibility: string
  
  if (overallScore >= 85) {
    strength = 'high'
    compatibility = "Exceptional candidate - Perfect alignment with job requirements"
  } else if (overallScore >= 75) {
    strength = 'high'
    compatibility = "Excellent candidate - Strong match across all criteria"
  } else if (overallScore >= 65) {
    strength = 'medium'
    compatibility = "Very good candidate - Good alignment with most requirements"
  } else if (overallScore >= 55) {
    strength = 'medium'
    compatibility = "Good candidate - Solid match with room for growth"
  } else if (overallScore >= 45) {
    strength = 'low'
    compatibility = "Potential candidate - Some alignment but needs development"
  } else {
    strength = 'low'
    compatibility = "Limited match - Consider for future opportunities"
  }
  
  return { strength, compatibility }
}

export const useCandidateRecommendations = (jobId?: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['candidate-recommendations', jobId, limit],
    queryFn: async (): Promise<CandidateMatch[]> => {
      if (!jobId) return []

      // Get job details
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (jobError) throw jobError

      // Get all candidates with complete profiles
      const { data: candidates, error: candidatesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'applicant')
        .not('skills', 'is', null)
        .not('current_location', 'is', null)

      if (candidatesError) throw candidatesError

      if (!candidates?.length) return []

      // Calculate matches for each candidate
      const candidateMatches: CandidateMatch[] = candidates.map(candidate => {
        const skillsMatch = calculateAdvancedSkillsMatch(candidate.skills || [], job.skills || [])
        const locationMatch = calculateAdvancedLocationMatch(candidate.current_location || '', job.location || '')
        const experienceMatch = calculateAdvancedExperienceMatch(candidate.experience_years || 0, job.experience_level || '')
        const availabilityMatch = calculateAvailabilityMatch(candidate)

        // Enhanced weighted scoring
        const weights = {
          skills: 0.90,        // 45% - Most important
          experience: 0.03,    // 25% - Very important
          location: 0.05,      // 20% - Important for logistics
          availability: 0.02   // 10% - Basic requirement
        }

        const overallScore = Math.round(
          (skillsMatch.score * weights.skills) +
          (experienceMatch.score * weights.experience) +
          (locationMatch.score * weights.location) +
          (availabilityMatch.score * weights.availability)
        )lity)
        )

        const { strength, compatibility } = getRecommendationAnalysis(overallScore)

        return {
          ...candidate,
          match_score: overallScore,
          match_reasons: {
            skills_match: {
              matching_skills: skillsMatch.matchingSkills,
              missing_skills: skillsMatch.missingSkills,
              score: skillsMatch.score,
              skill_coverage: skillsMatch.skillCoverage
            },
            location_match: {
              is_same_location: locationMatch.isSameLocation,
              is_nearby: locationMatch.isNearby,
              is_remote_friendly: locationMatch.isRemoteFriendly,
              score: locationMatch.score
            },
            experience_match: {
              candidate_experience: experienceMatch.candidateExperience,
              required_level: experienceMatch.requiredLevel,
              is_overqualified: experienceMatch.isOverqualified,
              is_underqualified: experienceMatch.isUnderqualified,
              is_perfect_match: experienceMatch.isPerfectMatch,
              score: experienceMatch.score
            },
            availability_match: {
              is_available: availabilityMatch.isAvailable,
              visa_status_suitable: availabilityMatch.visaStatusSuitable,
              score: availabilityMatch.score
            },
            overall_compatibility: compatibility,
            recommendation_strength: strength
          }
        }
      })

      // Sort by match score and return top candidates
      return candidateMatches
          .filter(candidate => candidate.match_score > 60)
          .sort((a, b) => b.match_score - a.match_score)
          .slice(0, limit);
    },
    enabled: !!jobId,
  })
}

// Hook to get all jobs with their candidate recommendations
export const useAllJobsWithCandidateRecommendations = () => {
  return useQuery({
    queryKey: ['all-jobs-with-candidates'],
    queryFn: async () => {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return jobs || []
    },
  })
}

// Hook for detailed candidate analysis for a specific job
export const useCandidateAnalysis = (candidateId: string, jobId: string) => {
  return useQuery({
    queryKey: ['candidate-analysis', candidateId, jobId],
    queryFn: async () => {
      if (!candidateId || !jobId) return null

      // Get candidate and job details
      const [candidateResponse, jobResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', candidateId).single(),
        supabase.from('jobs').select('*').eq('id', jobId).single()
      ])

      if (candidateResponse.error) throw candidateResponse.error
      if (jobResponse.error) throw jobResponse.error

      const candidate = candidateResponse.data
      const job = jobResponse.data

      const skillsMatch = calculateAdvancedSkillsMatch(candidate.skills || [], job.skills || [])
      const locationMatch = calculateAdvancedLocationMatch(candidate.current_location || '', job.location || '')
      const experienceMatch = calculateAdvancedExperienceMatch(candidate.experience_years || 0, job.experience_level || '')
      const availabilityMatch = calculateAvailabilityMatch(candidate)

      return {
        candidate,
        job,
        analysis: {
          skillsMatch,
          locationMatch,
          experienceMatch,
          availabilityMatch,
          recommendations: {
            hiringAdvice: experienceMatch.isPerfectMatch 
              ? "Excellent candidate for immediate hiring"
              : experienceMatch.isOverqualified
              ? "Consider for senior role or discuss career goals"
              : "Good potential with proper onboarding",
            interviewFocus: [
              ...skillsMatch.matchingSkills.slice(0, 3).map(skill => `Explore ${skill} experience`),
              ...skillsMatch.missingSkills.slice(0, 2).map(skill => `Assess ${skill} learning potential`)
            ],
            developmentAreas: skillsMatch.missingSkills.slice(0, 3)
          }
        }
      }
    },
    enabled: !!candidateId && !!jobId,
  })
}
