"use client";

import { CurriculumData } from "@/types/curriculum";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface CurriculumPreviewProps {
  data: CurriculumData;
}

export function CurriculumPreview({ data }: CurriculumPreviewProps) {
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  const groupedSkills = data.skills.reduce((acc, skill) => {
    const category = skill.category || "Geral";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  return (
    <div
      id="curriculum-preview"
      className="bg-white p-8 shadow-lg min-h-[297mm]"
      style={{ 
        width: "210mm",
        backgroundColor: "#ffffff",
        color: "#000000"
      }}
    >
      
      <div className="mb-6 flex gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#000000" }}>
            {data.personalInfo.fullName || "Seu Nome"}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm mt-3" style={{ color: "#6b7280" }}>
            {data.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm mt-2" style={{ color: "#6b7280" }}>
            {data.personalInfo.linkedIn && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                <span>{data.personalInfo.linkedIn}</span>
              </div>
            )}
            {data.personalInfo.portfolio && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{data.personalInfo.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        
        {data.personalInfo.photo && (
          <div className="flex-shrink-0">
            <img
              src={data.personalInfo.photo}
              alt={data.personalInfo.fullName}
              className="w-32 h-32 object-cover rounded-lg border-2"
              style={{ borderColor: "#e5e7eb" }}
            />
          </div>
        )}
      </div>

      
      {data.personalInfo.summary && (
        <>
          <Separator className="my-4" style={{ backgroundColor: "#e5e7eb" }} />
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2" style={{ color: "#000000" }}>
              Resumo Profissional
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
              {data.personalInfo.summary}
            </p>
          </div>
        </>
      )}

      
      {data.experiences.length > 0 && (
        <>
          <Separator className="my-4" style={{ backgroundColor: "#e5e7eb" }} />
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: "#000000" }}>
              Experiência Profissional
            </h2>
            <div className="space-y-4">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-base" style={{ color: "#000000" }}>
                        {exp.position}
                      </h3>
                      <p className="text-sm" style={{ color: "#6b7280" }}>
                        {exp.company}
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      {formatDate(exp.startDate)} - {exp.current ? "Presente" : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: "#374151" }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      
      {data.education.length > 0 && (
        <>
          <Separator className="my-4" style={{ backgroundColor: "#e5e7eb" }} />
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: "#000000" }}>
              Formação Acadêmica
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base" style={{ color: "#000000" }}>
                        {edu.degree} em {edu.field}
                      </h3>
                      <p className="text-sm" style={{ color: "#6b7280" }}>
                        {edu.institution}
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      {formatDate(edu.startDate)} - {edu.current ? "Presente" : formatDate(edu.endDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      
      {data.skills.length > 0 && (
        <>
          <Separator className="my-4" style={{ backgroundColor: "#e5e7eb" }} />
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: "#000000" }}>
              Habilidades
            </h2>
            <div className="space-y-3">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: "#6b7280" }}>
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          backgroundColor: "#f3f4f6",
                          color: "#374151"
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}