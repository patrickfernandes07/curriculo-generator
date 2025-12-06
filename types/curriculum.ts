export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  summary: string;
  photo?: string; // Base64 da imagem
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface CurriculumData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}

// Novo: Tipo do currículo no banco de dados
export interface CurriculumDB {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string | null;
  portfolio: string | null;
  summary: string;
  photo: string | null;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  template_id: string;
  is_public: boolean;
  share_token: string | null;
  ai_score: number | null;
  ai_suggestions: {
    score: number;
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
  } | null;
  created_at: string;
  updated_at: string;
}

// Função helper para converter CurriculumData para formato do DB
export function curriculumToDb(data: CurriculumData): Partial<CurriculumDB> {
  return {
    full_name: data.personalInfo.fullName,
    email: data.personalInfo.email,
    phone: data.personalInfo.phone,
    location: data.personalInfo.location,
    linkedin: data.personalInfo.linkedIn || null,
    portfolio: data.personalInfo.portfolio || null,
    summary: data.personalInfo.summary,
    photo: data.personalInfo.photo || null,
    experiences: data.experiences,
    education: data.education,
    skills: data.skills,
  };
}

// Função helper para converter formato do DB para CurriculumData
export function dbToCurriculum(db: CurriculumDB): CurriculumData {
  return {
    personalInfo: {
      fullName: db.full_name,
      email: db.email,
      phone: db.phone,
      location: db.location,
      linkedIn: db.linkedin || undefined,
      portfolio: db.portfolio || undefined,
      summary: db.summary,
      photo: db.photo || undefined,
    },
    experiences: db.experiences,
    education: db.education,
    skills: db.skills,
  };
}
