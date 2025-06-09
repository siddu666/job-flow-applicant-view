import { useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const commonSkills: string[] = [
    "3d modeling",
    "abap programming",
    "active directory",
    "advanced c++",
    "agile methodologies",
    "ai/ml",
    "algorithm development",
    "android development",
    "api development",
    "api documentation",
    "api integration",
    "application development",
    "asp.net",
    "asset lifecycle management",
    "asset management",
    "async programming",
    "automation",
    "automation scripting",
    "autosar",
    "axure",
    "azure integration",
    "backend development",
    "big data technologies",
    "biomedical systems",
    "biomechanics",
    "biomaterials",
    "blazor",
    "blockchain technology",
    "blog writing",
    "brand management",
    "budget management",
    "budgeting",
    "building codes",
    "business analysis",
    "business analytics",
    "business intelligence",
    "business intelligence tools",
    "business process analysis",
    "business process improvement",
    "business process modeling",
    "cad integration",
    "cad software",
    "campaign management",
    "can bus",
    "circuit design",
    "citrix adc",
    "citrix gateway",
    "citrix policies",
    "citrix virtual apps",
    "citrix virtual desktops",
    "client communication",
    "cloud architecture",
    "cloud computing",
    "cloud cost management",
    "cloud infrastructure",
    "cloud migration",
    "cloud security",
    "cloud services",
    "cloud strategy",
    "cloudformation",
    "c#",
    "c++",
    "collaboration",
    "compliance",
    "compliance audits",
    "compliance checking",
    "compliance management",
    "compliance reporting",
    "configuration management",
    "containerization",
    "content creation",
    "content management",
    "content optimization",
    "content strategy",
    "control evaluation",
    "control systems",
    "copywriting",
    "cryptography",
    "curriculum development",
    "customer communication",
    "customer data management",
    "customer experience",
    "customer feedback",
    "customer presentations",
    "customer relationship management",
    "customer satisfaction",
    "customer service",
    "data analysis",
    "data architect",
    "data backup",
    "data cleaning",
    "data engineer",
    "data governance",
    "data integration",
    "data lifecycle management",
    "data management",
    "data migration",
    "data mining",
    "data modeling",
    "data pipelines",
    "data privacy",
    "data protection",
    "data protection laws",
    "data quality",
    "data recovery",
    "data scientist",
    "data security",
    "data strategy",
    "data visualization",
    "data warehousing",
    "database administrator",
    "database design",
    "database management",
    "database security",
    "debugging tools",
    "deep learning",
    "decentralized applications",
    "design patterns",
    "design systems",
    "design tools",
    "desktop support",
    "development workflow",
    "devops",
    "devops basics",
    "digital marketing",
    "digital strategy",
    "digital tools",
    "disaster recovery",
    "django",
    "docker compose",
    "docker swarm",
    "e-learning",
    "ec2",
    "editing",
    "electronic design",
    "electromagnetic theory",
    "embedded developer",
    "embedded systems",
    "employee relations",
    "enterprise applications",
    "enterprise solutions",
    "entity framework",
    "environmental impact",
    "environmental impact assessment",
    "environmental modeling",
    "etl processes",
    "ethereal hacking",
    "excel",
    "express.js",
    "facebook ads",
    "fem analysis (finite element analysis)",
    "financial analysis",
    "financial modeling",
    "financial planning",
    "firewall management",
    "firewalls",
    "flask",
    "flutter",
    "frontend development",
    "full stack development",
    "game design",
    "game physics",
    "git commands",
    "google ads",
    "governance frameworks",
    "graphic design",
    "group policy",
    "hardware interfacing",
    "hardware support",
    "hardware testing",
    "help desk",
    "hibernate",
    "hr policies",
    "hyperledger",
    "identity management",
    "incident handling",
    "incident management",
    "incident response",
    "indexing",
    "information architecture",
    "information security",
    "information systems",
    "infrastructure as code",
    "innovation",
    "innovation management",
    "instructional design",
    "interactive design",
    "internet of things",
    "intrusion detection",
    "inventory management",
    "investment analysis",
    "ios development",
    "it audits",
    "it compliance",
    "it compliance manager",
    "it consultant",
    "it disaster recovery specialist",
    "it governance specialist",
    "it help desk manager",
    "it infrastructure manager",
    "it innovation manager",
    "it knowledge manager",
    "it operations manager",
    "it performance manager",
    "it policy manager",
    "it procurement specialist",
    "it project coordinator",
    "it quality assurance manager",
    "it resource manager",
    "it research analyst",
    "it risk manager",
    "it security auditor",
    "it service desk analyst",
    "it service delivery",
    "it service management",
    "it services",
    "it solutions",
    "it strategy",
    "it strategy consultant",
    "it support specialist",
    "it systems analyst",
    "it technical architect",
    "it technical support engineer",
    "it technical support specialist",
    "it technical trainer",
    "it technology analyst",
    "it technology consultant",
    "it technology coordinator",
    "it technology director",
    "it technology manager",
    "it vendor manager",
    "itil frameworks",
    "javascript",
    "jira",
    "junit",
    "kanban",
    "keyword research",
    "knowledge management",
    "kubernetes",
    "lan/wan management",
    "lambda",
    "layout design",
    "legal requirements",
    "linq",
    "link building",
    "logistics",
    "machine learning",
    "machine learning algorithms",
    "machine vision",
    "manual testing",
    "manufacturing processes",
    "market analysis",
    "market research",
    "materials science",
    "matplotlib",
    "maven",
    "medical devices",
    "memory management",
    "microcontroller architectures",
    "microelectronics",
    "microservices",
    "mobile app designer",
    "mobile security",
    "mobile ui design",
    "mobile ui/ux",
    "mongodb",
    "monitoring",
    "motion design",
    "multicloud environments",
    "multithreading",
    "natural language processing",
    "network analysis",
    "network configuration",
    "network engineer",
    "network management",
    "network monitoring",
    "network protocols",
    "network security",
    "nosql",
    "npm",
    "numpy",
    "oauth",
    "object-oriented programming (oop)",
    "online sales strategies",
    "open source tools",
    "operations management",
    "optimization",
    "pen testing",
    "penetration testing",
    "performance analysis",
    "performance management",
    "performance monitoring",
    "performance tuning",
    "pl/sql",
    "pl/pgsql",
    "plc programming",
    "plm",
    "policy development",
    "policy implementation",
    "pollution control",
    "power platform",
    "power systems",
    "powershell scripting",
    "predictive modeling",
    "presentation skills",
    "privacy policies",
    "problem resolution",
    "process automation",
    "process design",
    "process improvement",
    "procurement",
    "procurement processes",
    "procurement strategies",
    "product design",
    "product development",
    "product knowledge",
    "product lifecycle management",
    "product manager",
    "product presentations",
    "product strategy",
    "programming",
    "project coordination",
    "project delivery",
    "project documentation",
    "project management",
    "project planning",
    "prototyping",
    "public speaking",
    "publication",
    "quality assurance",
    "quality standards",
    "query optimization",
    "r programming",
    "radio frequency (rf) engineering",
    "react",
    "react hooks",
    "react native",
    "reactivity",
    "recruitment",
    "regulatory compliance",
    "reporting",
    "replication",
    "requirement gathering",
    "responsive design",
    "restful apis",
    "risk assessment",
    "risk management",
    "robotics",
    "robotics developer",
    "robotics frameworks",
    "ros",
    "routing and switching",
    "sales engineer",
    "sales force apis",
    "salesforce",
    "sap abap",
    "sap basis",
    "sap configuration",
    "sap customization",
    "sap erp",
    "sap expert",
    "sap fico",
    "sap hana",
    "sap implementation",
    "sap integration",
    "sap mm",
    "sap modules",
    "sap s/4hana",
    "sap sd",
    "sap security",
    "sap skills",
    "sap workflow",
    "scalability",
    "schema design",
    "schematic capture",
    "scrum",
    "search engine optimization",
    "security analysis",
    "security architecture",
    "security assessment",
    "security auditing",
    "security compliance",
    "security monitoring",
    "security policies",
    "security protocols",
    "selenium",
    "sensor integration",
    "server management",
    "server-side scripting",
    "service delivery",
    "service improvement",
    "service management",
    "service quality",
    "shared responsibility model",
    "signal processing",
    "single file components",
    "site planning",
    "smart contracts",
    "social media content",
    "social media management",
    "software architecture",
    "software design",
    "software development",
    "software development lifecycle",
    "software development methodologies",
    "software tester",
    "soql",
    "spring",
    "spring boot",
    "sql",
    "stakeholder analysis",
    "stakeholder communication",
    "stakeholder management",
    "statistical analysis",
    "stl",
    "strategic planning",
    "structure design",
    "supply chain management",
    "survey design",
    "surveying",
    "system administration",
    "system architecture",
    "system configuration",
    "system design",
    "system integration",
    "system maintenance",
    "systems analysis",
    "systems development lifecycle (sdlc)",
    "task management",
    "team collaboration",
    "team leadership",
    "technical documentation",
    "technical editing",
    "technical support",
    "technology evaluation",
    "technology selection",
    "technology trends",
    "telecommunications",
    "test automation",
    "test case design",
    "test management",
    "test planning",
    "testing and measurement",
    "threat analysis",
    "threat detection",
    "training",
    "training delivery",
    "training needs analysis",
    "troubleshooting",
    "typescript",
    "ui design",
    "ui/ux researcher",
    "unreal engine",
    "user acceptance testing",
    "user experience",
    "user experience design",
    "user flows",
    "user interface guidelines",
    "user research",
    "user support",
    "usability testing",
    "ux/ui designer",
    "vehicle dynamics",
    "vehicle networking",
    "version control",
    "visual design",
    "visual studio",
    "visualforce",
    "vpn management",
    "vulnerability assessment",
    "waste management",
    "water treatment",
    "web api",
    "web development",
    "windows server management",
    "wireframing",
    "workflow management",
    "writing"
];

interface SkillManagerProps {
    selectedSkills?: string[];
    onSkillsChange?: (skills: string[]) => void;
}

export default function SkillManager({ selectedSkills = [], onSkillsChange }: SkillManagerProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    // Filter out already selected skills and apply search
    const filteredSkills = commonSkills.filter(
        (skill) =>
            !selectedSkills.includes(skill) &&
            skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addSkill = (skill: string) => {
        if (skill && !selectedSkills.includes(skill)) {
            const newSkills = [...selectedSkills, skill];
            onSkillsChange?.(newSkills);
            setSearchTerm("");
            setIsDropdownOpen(false);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
        onSkillsChange?.(newSkills);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredSkills.length > 0) {
                addSkill(filteredSkills[0]);
            }
        }
    };

    return (
        <div className="space-y-4">
            <Label>Key Skills *</Label>

            {/* Selected Skills Display */}
            {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                            {skill}
                            <X
                                className="h-3 w-3 ml-2 cursor-pointer"
                                onClick={() => removeSkill(skill)}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Search Input */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                        type="text"
                        placeholder="Search skills..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onKeyPress={handleKeyPress}
                        className="pl-10"
                    />
                </div>

                {/* Dropdown Results */}
                {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredSkills.length > 0 ? (
                            filteredSkills.slice(0, 10).map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => addSkill(skill)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                                >
                                    {skill}
                                </button>
                            ))
                        ) : searchTerm ? (
                            <div className="px-4 py-2 text-gray-500 text-sm">
                                No matching skills found
                            </div>
                        ) : (
                            <div className="px-4 py-2 text-gray-500 text-sm">
                                Type to search skills...
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}

            {/* Skills Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
                <p className="text-gray-600 text-sm">
                    Total skills selected: <span className="font-semibold">{selectedSkills.length}</span>
                </p>
                {selectedSkills.length > 0 && (
                    <p className="text-gray-600 text-sm mt-1">
                        Skills: {selectedSkills.slice(0, 5).join(", ")}
                        {selectedSkills.length > 5 && ` and ${selectedSkills.length - 5} more...`}
                    </p>
                )}
            </div>
        </div>
    );
}