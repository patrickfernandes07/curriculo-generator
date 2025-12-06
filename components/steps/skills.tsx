"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/types/curriculum";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface SkillsStepProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export function SkillsStep({ data, onChange }: SkillsStepProps) {
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");

  const addSkill = () => {
    if (!skillName.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: skillName.trim(),
      category: skillCategory.trim() || "Geral",
    };
    
    onChange([...data, newSkill]);
    setSkillName("");
    setSkillCategory("");
  };

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // Agrupar habilidades por categoria
  const groupedSkills = data.reduce((acc, skill) => {
    const category = skill.category || "Geral";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Adicionar Habilidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="skillName">Habilidade</Label>
            <Input
              id="skillName"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="React, Python, etc"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="skillCategory">Categoria</Label>
            <Input
              id="skillCategory"
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Frontend, Backend, etc"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addSkill} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Suas Habilidades</h3>
        {Object.keys(groupedSkills).length === 0 ? (
          <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
            Nenhuma habilidade adicionada ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="text-sm px-3 py-1"
                    >
                      {skill.name}
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}