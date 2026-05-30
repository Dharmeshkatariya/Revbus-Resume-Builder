/* ==========================================================================
   REVBSUS SMART AI REASONING METRICS
   Calculates live reactiveness of resumes, score indexes, and bullet suggestions.
   ========================================================================= */

import { themeController } from "./theme.js";

export class AIAssistant {
  // Evaluates resume details and returns dynamic metrics and custom optimization proposals
  static analyzeResume(data) {
    // Basic analysis algorithms checking word counts and required fields
    const personalFilled = Object.values(data.personal || {}).filter(Boolean).length;
    const hasSummary = !!data.profile;
    const expCount = data.experience?.length || 0;
    const skillCount = data.skills?.length || 0;
    const projectCount = data.projects?.length || 0;
    const educCount = data.education?.length || 0;

    // Word calculations
    const summaryWords = data.profile ? data.profile.split(/\s+/).filter(Boolean).length : 0;
    
    // Dynamic score indicators (Scales between 30% and 98%)
    let atsScore = 30;
    let readability = 45;
    let keywordScore = 35;
    let designScore = 80; // defaults high since we use outstanding templates
    let healthScore = 40;

    // Calculate details richness
    if (personalFilled > 2) atsScore += 10;
    if (hasSummary && summaryWords > 15) {
      atsScore += 15;
      readability += 15;
    }
    if (expCount > 0) {
      atsScore += 20;
      keywordScore += 20;
      healthScore += 20;
    }
    if (skillCount > 2) {
      atsScore += 15;
      keywordScore += 15;
    }
    if (projectCount > 0) {
      atsScore += 10;
      healthScore += 15;
    }
    if (educCount > 0) {
      atsScore += 10;
      readability += 10;
    }

    // Keyword analysis simulation targeting modern industries
    const keywordsFound = [];
    const textToSearch = JSON.stringify(data).toLowerCase();
    const targetedKeywords = [
      "orchestrated", "engineered", "streamlined", "scaled", "optimized", "infrastructure", 
      "design system", "scrum", "agile", "budget", "analytics", "leadership", "kpi", "react", 
      "kubernetes", "docker", "figma", "product delivery", "cloud", "metrics", "roi"
    ];

    targetedKeywords.forEach(kw => {
      if (textToSearch.includes(kw)) {
        keywordScore += 4;
        keywordsFound.push(kw);
      }
    });

    // Capping values to maximum of 99
    atsScore = Math.min(atsScore, 99);
    readability = Math.min(readability, 98);
    keywordScore = Math.min(keywordScore, 99);
    healthScore = Math.min(healthScore, 97);
    designScore = Math.max(75, Math.min(designScore + (themeController.config.radius === "elegant" ? 8 : 10), 99));

    // Formulate suggestions based on gaps
    const recommendations = [];
    if (personalFilled < 4) {
      recommendations.push("Complete all social linkage handles (LinkedIn, GitHub/Portfolio URL) to enhance hiring transparency.");
    }
    if (summaryWords < 30) {
      recommendations.push("Your profile summary is light. Aim for 40-60 terms summarizing your specific core values and biggest impact metric.");
    }
    if (expCount < 2) {
      recommendations.push("Provide at least 2 detailed past roles showing professional growth.");
    }
    if (keywordsFound.length < 3) {
      recommendations.push("Inject strong action verbs (e.g. 'orchestrated', 'engineered', 'streamlined') in your bullet items to boost machine parser scanning.");
    }
    if (skillCount < 5) {
      recommendations.push("Add at least 5 competency tags. Highlight both technical tools (Figma, React) and soft leadership skills.");
    }

    if (recommendations.length === 0) {
      recommendations.push("Fantastic work! Your resume outline has robust details ready for global corporate recruitment.");
    }

    return {
      scores: {
        ats: atsScore,
        readability: readability,
        keyword: keywordScore,
        design: designScore,
        health: healthScore
      },
      keywordsFound,
      recommendations
    };
  }

  // Action verb, impact phrase, or phrasing improvement engine
  static improveBulletPoint(bulletText) {
    const list = [
      { trigger: "made", replacement: "orchestrated, engineered, or synthesized" },
      { trigger: "worked on", replacement: "collaborated closely, facilitated, or engineered" },
      { trigger: "managed", replacement: "spearheaded, mobilized, or direct-engineered" },
      { trigger: "helped", replacement: "leveraged assistance, streamlined, or accelerated" },
      { trigger: "increased", replacement: "maximized, supercharged, or scaled" }
    ];

    const match = list.find(item => bulletText.toLowerCase().includes(item.trigger));
    if (match) {
      return `✨ AI Recommendation: Replace the generic term <strong>"${match.trigger}"</strong> with active metrics-focused verbs like <strong>"${match.replacement}"</strong> to clarify bullet item impact.`;
    }

    return `✨ AI Analysis: Good vocabulary detected. To elevate this further, ensure to represent this bullet item using the STAR format (Situation, Task, Action, specific quantifiable Result e.g. "...resulting in +15% operational efficiency").`;
  }

  // Simulated Cover Letter Generation Engine
  static generateCoverLetter(data, jobTitle = "Product Designer", companyName = "Stripe") {
    const name = data.personal.name || "Alex Sterling";
    const title = data.personal.title || "Executive Specialist";
    const email = data.personal.email || "applicant@domain.com";

    const letter = `Dear Hiring Committee at ${companyName},

I am writing to express my enthusiastic interest in the ${jobTitle} position currently open. With a robust history of operating as an accomplished ${title}, I have consistently dedicated my technical talents and strategic vision toward driving structural metrics-driven results.

In my recent projects, I have successfully focused on architectural optimizations and design consistency workflows, culminating in structural improvements. I recognize that ${companyName} values outstanding visual quality, rapid iterations, and uncompromising usability, and I am confident that my specialized focus aligns perfectly with your goals.

I would welcome the opportunity to discuss how my competencies in leadership, design, and systematic integration can directly contribute to your team. Thank you for your time, consideration, and dedication to craftsmanship.

Warm regards,

${name}
${email} | ${data.personal.phone || ""}`;

    return letter;
  }
}
