"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "@/types/curriculum";
import { Upload, X, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalInfoStep({ data, onChange }: PersonalInfoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    data.photo || null
  );
  const [improvingSummary, setImprovingSummary] = useState(false);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      handleChange("photo", base64);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setImagePreview(null);
    handleChange("photo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const improveSummary = async () => {
    if (!data.summary || data.summary.trim().length < 20) {
      alert("Escreva um resumo com pelo menos 20 caracteres primeiro!");
      return;
    }

    setImprovingSummary(true);

    try {
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.summary,
          type: "summary",
        }),
      });

      if (!response.ok) throw new Error("Erro ao melhorar resumo");

      const result = await response.json();
      handleChange("summary", result.improvedText);
    } catch (error) {
      console.error(error);
      alert("Erro ao melhorar resumo. Tente novamente.");
    } finally {
      setImprovingSummary(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Foto */}
      <div>
        <Label>Foto (Opcional)</Label>
        <div className="flex items-start gap-4 mt-2">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={removePhoto}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="photo-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {imagePreview ? "Trocar Foto" : "Adicionar Foto"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Recomendado: foto 3x4 ou retrato profissional (máx 2MB)
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="fullName">Nome Completo *</Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="João da Silva"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="joao@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Localização *</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="São Paulo, SP"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedIn">LinkedIn</Label>
          <Input
            id="linkedIn"
            value={data.linkedIn || ""}
            onChange={(e) => handleChange("linkedIn", e.target.value)}
            placeholder="linkedin.com/in/seu-perfil"
          />
        </div>

        <div>
          <Label htmlFor="portfolio">Portfolio/Site</Label>
          <Input
            id="portfolio"
            value={data.portfolio || ""}
            onChange={(e) => handleChange("portfolio", e.target.value)}
            placeholder="seusite.com"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="summary">Resumo Profissional *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={improveSummary}
            disabled={improvingSummary || !data.summary}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {improvingSummary ? "Melhorando..." : "Melhorar com IA"}
          </Button>
        </div>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Descreva brevemente sua experiência e objetivos profissionais..."
          rows={4}
        />
      </div>
    </div>
  );
}