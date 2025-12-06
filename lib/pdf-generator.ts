import jsPDF from "jspdf";
import { CurriculumData } from "@/types/curriculum";

export const generatePDF = (
  data: CurriculumData,
  fileName: string = "curriculo.pdf"
) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let yPos = 20;
  const leftMargin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - leftMargin * 2;
  const lineHeight = 5;

  // Configurar posição inicial considerando a foto
  const photoWidth = 30;
  const photoHeight = 30;
  const hasPhoto = !!data.personalInfo.photo;
  const textContentWidth = hasPhoto
    ? contentWidth - photoWidth - 10
    : contentWidth;

  // Função auxiliar para verificar se precisa de nova página
  const checkNewPage = (spaceNeeded: number = 20) => {
    if (yPos + spaceNeeded > 280) {
      pdf.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // Função para formatar data
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return `${month}/${year}`;
  };

  // ===== FOTO (se houver) =====
  if (hasPhoto) {
    try {
      pdf.addImage(
        data.personalInfo.photo!,
        "JPEG",
        pageWidth - leftMargin - photoWidth,
        yPos,
        photoWidth,
        photoHeight,
        undefined,
        "FAST"
      );
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
    }
  }

  // ===== CABEÇALHO - Nome =====
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  const nameLines = pdf.splitTextToSize(
    data.personalInfo.fullName || "Seu Nome",
    textContentWidth
  );
  pdf.text(nameLines, leftMargin, yPos);
  yPos += nameLines.length * 8;

  // ===== CONTATOS =====
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(107, 114, 128);

  const contactLine1 = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
  ]
    .filter(Boolean)
    .join(" | ");

  if (contactLine1) {
    const contactLines1 = pdf.splitTextToSize(contactLine1, textContentWidth);
    pdf.text(contactLines1, leftMargin, yPos);
    yPos += contactLines1.length * lineHeight;
  }

  const contactLine2 = [data.personalInfo.linkedIn, data.personalInfo.portfolio]
    .filter(Boolean)
    .join(" | ");

  if (contactLine2) {
    const contactLines2 = pdf.splitTextToSize(contactLine2, textContentWidth);
    pdf.text(contactLines2, leftMargin, yPos);
    yPos += contactLines2.length * lineHeight;
  }

  // Garantir que passamos da área da foto
  if (hasPhoto && yPos < 20 + photoHeight + 5) {
    yPos = 20 + photoHeight + 5;
  }

  yPos += 5;

  // ===== RESUMO PROFISSIONAL =====
  if (data.personalInfo.summary) {
    checkNewPage(30);

    pdf.setDrawColor(229, 231, 235);
    pdf.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
    yPos += 6;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Resumo Profissional", leftMargin, yPos);
    yPos += 6;

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(55, 65, 81);
    const summaryLines = pdf.splitTextToSize(
      data.personalInfo.summary,
      contentWidth
    );
    pdf.text(summaryLines, leftMargin, yPos);
    yPos += summaryLines.length * lineHeight + 5;
  }

  // ===== EXPERIÊNCIA PROFISSIONAL =====
  if (data.experiences.length > 0) {
    checkNewPage(30);

    pdf.setDrawColor(229, 231, 235);
    pdf.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
    yPos += 6;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Experiência Profissional", leftMargin, yPos);
    yPos += 7;

    data.experiences.forEach((exp) => {
      checkNewPage(25);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(exp.position, leftMargin, yPos);

      const dateText = `${formatDate(exp.startDate)} - ${
        exp.current ? "Presente" : formatDate(exp.endDate)
      }`;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(156, 163, 175);
      const dateWidth = pdf.getTextWidth(dateText);
      pdf.text(dateText, pageWidth - leftMargin - dateWidth, yPos);
      yPos += 5;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(107, 114, 128);
      pdf.text(exp.company, leftMargin, yPos);
      yPos += 5;

      if (exp.description) {
        pdf.setFontSize(9);
        pdf.setTextColor(55, 65, 81);
        const descLines = pdf.splitTextToSize(exp.description, contentWidth);
        pdf.text(descLines, leftMargin, yPos);
        yPos += descLines.length * lineHeight;
      }

      yPos += 5;
    });
  }

  // ===== FORMAÇÃO ACADÊMICA =====
  if (data.education.length > 0) {
    checkNewPage(30);

    pdf.setDrawColor(229, 231, 235);
    pdf.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
    yPos += 6;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Formação Acadêmica", leftMargin, yPos);
    yPos += 7;

    data.education.forEach((edu) => {
      checkNewPage(20);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      const degreeText = `${edu.degree} em ${edu.field}`;
      pdf.text(degreeText, leftMargin, yPos);

      const dateText = `${formatDate(edu.startDate)} - ${
        edu.current ? "Presente" : formatDate(edu.endDate)
      }`;
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(156, 163, 175);
      const dateWidth = pdf.getTextWidth(dateText);
      pdf.text(dateText, pageWidth - leftMargin - dateWidth, yPos);
      yPos += 5;

      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      pdf.text(edu.institution, leftMargin, yPos);
      yPos += 7;
    });
  }

  // ===== HABILIDADES =====
  if (data.skills.length > 0) {
    checkNewPage(30);

    pdf.setDrawColor(229, 231, 235);
    pdf.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
    yPos += 6;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Habilidades", leftMargin, yPos);
    yPos += 7;

    const groupedSkills = data.skills.reduce((acc, skill) => {
      const category = skill.category || "Geral";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, typeof data.skills>);

    Object.entries(groupedSkills).forEach(([category, skills]) => {
      checkNewPage(15);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(107, 114, 128);
      pdf.text(category, leftMargin, yPos);
      yPos += 5;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(55, 65, 81);
      const skillsText = skills.map((s) => s.name).join(" • ");
      const skillLines = pdf.splitTextToSize(skillsText, contentWidth);
      pdf.text(skillLines, leftMargin, yPos);
      yPos += skillLines.length * lineHeight + 5;
    });
  }

  pdf.save(fileName);
};
