/* ==========================================================================
   REVBSUS TEMPLATE ENGINE & ADVANCED DESIGNER SYSTEM
   Provides 10 highly tailored templates and the Universal Layout System.
   ========================================================================= */

import { themeController } from "./theme.js";

// Inline SVGs to avoid runtime dependency issues inside dynamic render frames
export const iconSVGs = {
  "lucide-user": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  "lucide-briefcase": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  "lucide-folder": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  "lucide-graduation-cap": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
  "lucide-wrench": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  "lucide-languages": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><path d="m5 8 6 6M4 14h6M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg>`,
  "lucide-award": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  "lucide-award-star": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  "lucide-star": `<svg style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:middle; margin-right:6px;" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

function hexToRgb(hex) {
  if (!hex) return "17, 24, 39";
  let c = hex.replace("#", "").trim();
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return "17, 24, 39";
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

export function getTemplatePreset(key) {
  const base = {
    alignments: {
      header: "left",
      sectionTitles: "left",
      bodyContent: "left",
      contactInfo: "left"
    },
    colors: {
      primary: "#111827",
      secondary: "#4b5563",
      accent: "#3b82f6",
      text: "#374151",
      background: "#ffffff"
    },
    typography: {
      fontFamily: "Inter",
      fontSize: 14,
      lineHeight: 1.5,
      letterSpacing: 0,
      fontWeightBody: "400"
    },
    headerStyle: {
      fontFamily: "Inter",
      fontSizeName: 32,
      fontWeightName: "800",
      colorName: "#111827",
      fontSizeTitle: 16,
      fontWeightTitle: "600",
      colorTitle: "#3b82f6",
      spacing: 12,
      alignment: "left",
      background: "transparent",
      borderStyle: "none",
      borderColor: "#e5e7eb"
    },
    globalHeadersStyle: "on",
    sectionHeaders: {
      fontFamily: "Inter",
      fontSize: 14,
      color: "#111827",
      fontWeight: "700",
      letterSpacing: 1,
      borderStyle: "solid-bottom",
      backgroundStyle: "transparent",
      alignment: "left"
    },
    sections: {
      profile: { title: "Professional Summary", color: "#111827", fontFamily: "Inter", fontSize: 14, fontWeight: "700", alignment: "left", icon: "lucide-user", dividerStyle: "solid-bottom", hidden: false },
      experience: { title: "Work Experience", color: "#111827", fontFamily: "Inter", fontSize: 14, fontWeight: "700", alignment: "left", icon: "lucide-briefcase", dividerStyle: "solid-bottom", hidden: false },
      projects: { title: "Projects", color: "#111827", fontFamily: "Inter", fontSize: 14, fontWeight: "700", alignment: "left", icon: "lucide-folder", dividerStyle: "solid-bottom", hidden: false },
      education: { title: "Education", color: "#111827", fontFamily: "Inter", fontSize: 14, fontWeight: "700", alignment: "left", icon: "lucide-graduation-cap", dividerStyle: "solid-bottom", hidden: false },
      skills: { title: "Skills Matrix", color: "#111827", fontFamily: "Inter", fontSize: 14, fontWeight: "700", alignment: "left", icon: "lucide-wrench", dividerStyle: "solid-bottom", hidden: false },
      languages: { title: "Languages", color: "#111827", fontFamily: "Inter", fontSize: 14, fontWeight: "700", alignment: "left", icon: "lucide-languages", dividerStyle: "solid-bottom", hidden: false },
      certifications: { title: "Certifications", color: "#111827", fontFamily: "Inter", fontSize: 14, fontWeight: "700", alignment: "left", icon: "lucide-award", dividerStyle: "solid-bottom", hidden: false }
    },
    sectionOrder: ["profile", "experience", "projects", "education", "skills", "languages", "certifications"]
  };

  switch (key) {
    case "ats-prof":
      base.layout = "single-column";
      base.typography.fontFamily = "Open Sans";
      base.colors.primary = "#000000";
      base.colors.secondary = "#333333";
      base.colors.accent = "#000000";
      base.colors.text = "#000000";
      base.headerStyle.alignment = "center";
      base.headerStyle.borderStyle = "none";
      base.alignments.header = "center";
      base.alignments.contactInfo = "center";
      base.sectionHeaders.borderStyle = "solid-bottom";
      base.sectionHeaders.color = "#000000";
      base.sectionHeaders.fontSize = 13;
      base.sectionHeaders.letterSpacing = 1.5;
      break;

    case "modern-minimal":
      base.layout = "two-column";
      base.typography.fontFamily = "Poppins";
      base.colors.primary = "#059669"; // Emerald focus
      base.colors.accent = "#10b981";
      base.colors.secondary = "#4b5563";
      base.headerStyle.fontFamily = "Poppins";
      base.headerStyle.colorTitle = "#10b981";
      base.sectionHeaders.borderStyle = "bullet";
      base.sectionHeaders.color = "#059669";
      break;

    case "exec-luxury":
      base.layout = "executive";
      base.typography.fontFamily = "Playfair Display";
      base.typography.fontWeightBody = "400";
      base.colors.primary = "#7c2d12"; // Mahogany Red
      base.colors.accent = "#b45309";
      base.colors.background = "#fdfbf7"; // Ivory Paper Look
      base.headerStyle.fontFamily = "Playfair Display";
      base.headerStyle.alignment = "center";
      base.headerStyle.colorName = "#7c2d12";
      base.headerStyle.borderStyle = "double-bottom";
      base.headerStyle.borderColor = "#7c2d12";
      base.alignments.header = "center";
      base.alignments.contactInfo = "center";
      base.sectionHeaders.borderStyle = "double-bottom";
      base.sectionHeaders.color = "#7c2d12";
      base.sectionHeaders.alignment = "center";
      break;

    case "corp-elite":
      base.layout = "single-column";
      base.typography.fontFamily = "Lora";
      base.colors.primary = "#1e3a8a"; // Dark Navy
      base.colors.accent = "#2563eb";
      base.colors.secondary = "#4b5563";
      base.headerStyle.fontFamily = "Lora";
      base.headerStyle.colorName = "#1e3a8a";
      base.headerStyle.borderStyle = "solid-bottom";
      base.headerStyle.borderColor = "#2563eb";
      base.sectionHeaders.borderStyle = "solid-bottom";
      base.sectionHeaders.color = "#1e3a8a";
      break;

    case "creative-design":
      base.layout = "grid-layout";
      base.typography.fontFamily = "Montserrat";
      base.colors.primary = "#db2777"; // Creative Pink
      base.colors.accent = "#9d174d";
      base.colors.background = "#fafaf9";
      base.headerStyle.fontFamily = "Montserrat";
      base.headerStyle.alignment = "left";
      base.headerStyle.colorName = "#db2777";
      base.headerStyle.colorTitle = "#9d174d";
      base.sectionHeaders.borderStyle = "box";
      base.sectionHeaders.color = "#db2777";
      break;

    case "dev-resume":
      base.layout = "left-sidebar";
      base.typography.fontFamily = "JetBrains Mono";
      base.colors.primary = "#0284c7"; // Tech Blue
      base.colors.accent = "#0ea5e9";
      base.colors.secondary = "#64748b";
      base.headerStyle.fontFamily = "JetBrains Mono";
      base.headerStyle.colorName = "#0f172a";
      base.headerStyle.colorTitle = "#0284c7";
      base.sectionHeaders.borderStyle = "bullet";
      base.sectionHeaders.color = "#0284c7";
      break;

    case "pm-resume":
      base.layout = "two-column";
      base.typography.fontFamily = "DM Sans";
      base.colors.primary = "#4f46e5"; // Indigo
      base.colors.accent = "#6366f1";
      base.colors.secondary = "#5c6370";
      base.headerStyle.fontFamily = "DM Sans";
      base.headerStyle.colorName = "#111827";
      base.headerStyle.colorTitle = "#4f46e5";
      base.sectionHeaders.borderStyle = "solid-bottom";
      base.sectionHeaders.color = "#4f46e5";
      break;

    case "marketing-resume":
      base.layout = "grid-layout";
      base.typography.fontFamily = "Poppins";
      base.colors.primary = "#ea580c"; // Orange
      base.colors.accent = "#f97316";
      base.headerStyle.fontFamily = "Poppins";
      base.headerStyle.colorName = "#ea580c";
      base.headerStyle.colorTitle = "#ea580c";
      base.sectionHeaders.borderStyle = "box";
      base.sectionHeaders.color = "#ea580c";
      break;

    case "student-resume":
      base.layout = "single-column";
      base.typography.fontFamily = "Open Sans";
      base.colors.primary = "#0891b2"; // Cyan
      base.colors.accent = "#0e7490";
      base.headerStyle.fontFamily = "Open Sans";
      base.headerStyle.colorName = "#0891b2";
      base.sectionHeaders.borderStyle = "solid-bottom";
      base.sectionHeaders.color = "#0891b2";
      break;

    case "freelancer-resume":
      base.layout = "right-sidebar";
      base.typography.fontFamily = "Montserrat";
      base.colors.primary = "#7c3aed"; // Purple
      base.colors.accent = "#6d28d9";
      base.headerStyle.fontFamily = "Montserrat";
      base.headerStyle.colorName = "#7c3aed";
      base.sectionHeaders.borderStyle = "solid-bottom";
      base.sectionHeaders.color = "#7c3aed";
      break;
  }

  return base;
}

function renderHeader(data, config) {
  const hStyle = config.headerStyle || {};
  const p = data.personal || {};
  
  const alignment = hStyle.alignment || "center";
  const fontFamily = hStyle.fontFamily || config.typography?.fontFamily || "Inter";
  
  const borderBottom = hStyle.borderStyle === "solid-bottom" 
    ? `border-bottom: 2px solid ${hStyle.borderColor || '#e5e7eb'}; padding-bottom: 12px;`
    : hStyle.borderStyle === "double-bottom"
    ? `border-bottom: 4px double ${hStyle.borderColor || '#e5e7eb'}; padding-bottom: 12px;`
    : "";

  const containerStyle = `
    font-family: '${fontFamily}', sans-serif;
    text-align: ${alignment};
    background: ${hStyle.background || 'transparent'};
    margin-bottom: ${hStyle.spacing || 12}px;
    ${borderBottom}
  `;

  const contactAlignment = alignment === "center" ? "justify-content: center;" : alignment === "right" ? "justify-content: flex-end;" : "justify-content: flex-start;";

  return `
    <header style="${containerStyle}">
      <div>
        <h1 style="font-size: ${hStyle.fontSizeName || 32}px; font-weight: ${hStyle.fontWeightName || '800'}; color: ${hStyle.colorName || config.colors?.primary || '#111827'}; margin: 0; letter-spacing: -0.5px; line-height: 1.1;">
          ${p.name || "Alex Sterling"}
        </h1>
        <p style="font-size: ${hStyle.fontSizeTitle || 16}px; font-weight: ${hStyle.fontWeightTitle || '600'}; color: ${hStyle.colorTitle || config.colors?.accent || '#3b82f6'}; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px;">
          ${p.title || ""}
        </p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px 16px; ${contactAlignment} font-size: 0.82rem; color: ${config.colors?.secondary || '#4b5563'}; margin-top: 10px; line-height: 1.4;">
        ${p.email ? `<span style="display: inline-flex; align-items: center; gap: 4px;"><svg style="width:12px; height:12px; fill:none; stroke:currentColor; stroke-width:2;" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>${p.email}</span>` : ""}
        ${p.phone ? `<span style="display: inline-flex; align-items: center; gap: 4px;"><svg style="width:12px; height:12px; fill:none; stroke:currentColor; stroke-width:2;" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>${p.phone}</span>` : ""}
        ${p.address ? `<span style="display: inline-flex; align-items: center; gap: 4px;"><svg style="width:12px; height:12px; fill:none; stroke:currentColor; stroke-width:2;" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${p.address}</span>` : ""}
        ${p.website ? `<span style="display: inline-flex; align-items: center; gap: 4px;"><svg style="width:12px; height:12px; fill:none; stroke:currentColor; stroke-width:2;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>${p.website}</span>` : ""}
      </div>
    </header>
  `;
}

function renderSectionTitle(style) {
  const align = style.alignment || "left";
  const fontFamily = style.fontFamily || "Inter";
  const color = style.color || "#111827";
  const iconMarkup = style.icon && iconSVGs[style.icon] ? iconSVGs[style.icon] : "";

  let titleStyle = `
    font-family: '${fontFamily}', sans-serif;
    color: ${color};
    font-size: ${style.fontSize || 14}px;
    font-weight: ${style.fontWeight || '700'};
    text-transform: uppercase;
    letter-spacing: ${style.letterSpacing || 1}px;
    display: inline-flex;
    align-items: center;
  `;

  let outerStyle = `
    text-align: ${align};
    margin-bottom: 10px;
    width: 100%;
  `;

  const border = style.borderStyle || "solid-bottom";

  if (border === "solid-bottom") {
    outerStyle += `border-bottom: 1.5px solid ${color}; padding-bottom: 4px;`;
  } else if (border === "double-bottom") {
    outerStyle += `border-bottom: 4.5px double ${color}; padding-bottom: 4px;`;
  } else if (border === "solid-top") {
    outerStyle += `border-top: 1.5px solid ${color}; padding-top: 6px;`;
  } else if (border === "bullet") {
    outerStyle += `border-left: 4px solid ${color}; padding-left: 10px;`;
  } else if (border === "box") {
    outerStyle += `background: rgba(${hexToRgb(color)}, 0.08); padding: 6px 12px; border-radius: 4px;`;
  }

  return `
    <div style="${outerStyle}">
      <span style="${titleStyle}">
        ${iconMarkup} ${style.title}
      </span>
    </div>
  `;
}

function renderSection(key, data, style, config) {
  const sectionHeaderHtml = renderSectionTitle(style);
  let contentHtml = "";

  const textStyle = `font-size: 0.88rem; line-height: ${config.typography?.lineHeight || 1.5}; color: ${config.colors?.text || '#333333'}; text-align: ${config.alignments?.bodyContent || 'left'};`;

  if (key === "profile") {
    if (!data.profile) return "";
    contentHtml = `<p style="${textStyle}">${data.profile}</p>`;
  } else if (key === "experience") {
    if (!data.experience || !data.experience.length) return "";
    contentHtml = data.experience.map(exp => `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: ${config.colors?.primary || '#111827'};">${exp.role || "Lead Designer"}</h4>
          <span style="font-size: 0.8rem; font-weight: 600; color: ${config.colors?.accent || '#2563eb'};">${exp.startDate || "2024"} — ${exp.endDate || "Present"}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: ${config.colors?.secondary || '#6b7280'}; margin-bottom: 6px; font-weight: 500;">
          <span>${exp.company || ""}</span>
          <span>${exp.location || ""}</span>
        </div>
        <p style="font-size: 0.85rem; color: ${config.colors?.text || '#4b5563'}; line-height: 1.5;">${exp.description || ""}</p>
      </div>
    `).join('');
  } else if (key === "projects") {
    if (!data.projects || !data.projects.length) return "";
    contentHtml = data.projects.map(proj => `
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <h4 style="font-size: 0.92rem; font-weight: 700; color: ${config.colors?.primary || '#111827'};">${proj.title || ""}</h4>
          ${proj.url ? `<span style="font-size: 0.78rem; color: ${config.colors?.accent || '#2563eb'}; font-family: var(--font-mono);">${proj.url}</span>` : ""}
        </div>
        <p style="font-size: 0.85rem; color: ${config.colors?.text || '#4b5563'}; line-height: 1.5; margin-bottom: 4px;">${proj.description || ""}</p>
        ${proj.techStack ? `<div style="font-size: 0.78rem; font-family: var(--font-mono); color: ${config.colors?.secondary || '#6b7280'};">Stack: ${proj.techStack}</div>` : ""}
      </div>
    `).join('');
  } else if (key === "education") {
    if (!data.education || !data.education.length) return "";
    contentHtml = data.education.map(edu => `
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
          <h4 style="font-size: 0.92rem; font-weight: 700; color: ${config.colors?.primary || '#111827'};">${edu.degree || ""}</h4>
          <span style="font-size: 0.8rem; font-weight: 600; color: ${config.colors?.accent || '#2563eb'};">${edu.startDate || "2020"} — ${edu.endDate || "2024"}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: ${config.colors?.secondary || '#6b7280'}; margin-bottom: 4px;">
          <span>${edu.school || ""}</span>
          <span>${edu.location || ""}</span>
        </div>
        ${edu.description ? `<p style="font-size: 0.80rem; color: ${config.colors?.text || '#4b5563'}; margin-top: 4px;">${edu.description}</p>` : ""}
      </div>
    `).join('');
  } else if (key === "skills") {
    if (!data.skills || !data.skills.length) return "";
    contentHtml = `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${data.skills.map(skill => `
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; background: rgba(0,0,0,0.03); color: ${config.colors?.text || '#333333'}; font-weight: 500; border-left: 3px solid ${config.colors?.accent || '#2563eb'}; padding: 4px 8px; border-radius: 4px;">
            <span>${skill.name || ""}</span>
            <span style="font-size: 0.72rem; color: ${config.colors?.accent || '#2563eb'}; font-weight: bold;">[${skill.level || "4"}]</span>
          </div>
        `).join('')}
      </div>
    `;
  } else if (key === "languages") {
    if (!data.languages || !data.languages.length) return "";
    contentHtml = `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        ${data.languages.map(lang => `
          <span style="font-size: 0.82rem; color: ${config.colors?.text || '#333333'}; background: rgba(0,0,0,0.02); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05);">
            <strong>${lang.name}</strong>: <span style="color: ${config.colors?.secondary || '#6b7280'}; font-size: 0.78rem;">${lang.proficiency}</span>
          </span>
        `).join('')}
      </div>
    `;
  } else if (key === "certifications") {
    if (!data.certifications || !data.certifications.length) return "";
    contentHtml = data.certifications.map(cert => `
      <div style="margin-bottom: 10px;">
        <div style="font-size: 0.88rem; font-weight: 700; color: ${config.colors?.primary || '#111827'};">${cert.title || ""}</div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: ${config.colors?.secondary || '#6b7280'};">
          <span>${cert.issuer || ""}</span>
          <span>${cert.date || ""}</span>
        </div>
      </div>
    `).join('');
  }

  return `
    <section style="margin-bottom: 18px;">
      ${sectionHeaderHtml}
      <div style="margin-top: 10px;">
        ${contentHtml}
      </div>
    </section>
  `;
}

export function renderDynamicResume(data, config) {
  if (!config) {
    config = getTemplatePreset("modern-minimal");
  }

  const fontFamily = config.typography?.fontFamily || "Inter";
  const textColor = config.colors?.text || "#333333";
  const bgColor = config.colors?.background || "#ffffff";

  // Render Header block
  const headerHtml = renderHeader(data, config);

  // Compile individual section strings based on active custom layouts
  const activeSections = {};
  const sOrder = config.sectionOrder || ["profile", "experience", "projects", "education", "skills", "languages", "certifications"];
  
  sOrder.forEach(key => {
    const secConf = config.sections?.[key] || {};
    if (secConf.hidden) return;

    let headerStyle = {};
    if (config.globalHeadersStyle === "on" && config.sectionHeaders) {
      headerStyle = { ...config.sectionHeaders };
      headerStyle.title = secConf.title || key;
      headerStyle.icon = secConf.icon || "";
    } else {
      headerStyle = {
        title: secConf.title || key,
        icon: secConf.icon || "",
        fontFamily: secConf.fontFamily || config.typography?.fontFamily || "Inter",
        fontSize: secConf.fontSize || 14,
        color: secConf.color || config.colors?.primary || "#111827",
        fontWeight: secConf.fontWeight || "700",
        letterSpacing: 1,
        borderStyle: secConf.dividerStyle || "solid-bottom",
        backgroundStyle: "transparent",
        alignment: secConf.alignment || "left"
      };
    }

    const compiled = renderSection(key, data, headerStyle, config);
    if (compiled) {
      activeSections[key] = compiled;
    }
  });

  // Compose overall grid depending on selected layout style
  let bodyHtml = "";
  const layout = config.layout || "single-column";

  if (layout === "single-column") {
    sOrder.forEach(key => {
      if (activeSections[key]) {
        bodyHtml += `<div style="margin-bottom: 24px;">${activeSections[key]}</div>`;
      }
    });
  } else if (layout === "two-column" || layout === "left-sidebar" || layout === "right-sidebar") {
    const sidebarKeys = ["profile", "skills", "languages", "certifications"];
    let sidebarHtml = "";
    let mainHtml = "";

    sOrder.forEach(key => {
      if (!activeSections[key]) return;
      if (sidebarKeys.includes(key)) {
        sidebarHtml += `<div style="margin-bottom: 24px;">${activeSections[key]}</div>`;
      } else {
        mainHtml += `<div style="margin-bottom: 24px;">${activeSections[key]}</div>`;
      }
    });

    const isLeft = (layout === "left-sidebar" || layout === "two-column");
    const gridStyle = isLeft 
      ? `display: grid; grid-template-columns: 1.1fr 2fr; gap: 28px;` 
      : `display: grid; grid-template-columns: 2fr 1.1fr; gap: 28px;`;

    bodyHtml = `
      <div style="${gridStyle}">
        ${isLeft ? `<div>${sidebarHtml}</div><div>${mainHtml}</div>` : `<div>${mainHtml}</div><div>${sidebarHtml}</div>`}
      </div>
    `;
  } else if (layout === "grid-layout") {
    const profileHtml = activeSections["profile"] ? `<div style="margin-bottom: 24px;">${activeSections["profile"]}</div>` : "";
    let leftCol = "";
    let rightCol = "";
    let toggle = true;

    sOrder.forEach(key => {
      if (key === "profile" || !activeSections[key]) return;
      if (toggle) {
        leftCol += `<div style="margin-bottom: 24px;">${activeSections[key]}</div>`;
      } else {
        rightCol += `<div style="margin-bottom: 24px;">${activeSections[key]}</div>`;
      }
      toggle = !toggle;
    });

    bodyHtml = `
      ${profileHtml}
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div>${leftCol}</div>
        <div>${rightCol}</div>
      </div>
    `;
  } else if (layout === "executive") {
    sOrder.forEach(key => {
      if (activeSections[key]) {
        bodyHtml += `<div style="margin-bottom: 24px; border-bottom: 1px double #e5e7eb; padding-bottom: 12px;">${activeSections[key]}</div>`;
      }
    });
  }

  return `
    <div style="font-family: '${fontFamily}', sans-serif; color: ${textColor}; background: ${bgColor}; width:100%;">
      ${headerHtml}
      <div style="margin-top: 24px;">
        ${bodyHtml}
      </div>
    </div>
  `;
}

// Map the old & new keys into unified preset outputs
export const resumeTemplates = {
  "ats-prof": (data, theme) => renderDynamicResume(data, getTemplatePreset("ats-prof")),
  "modern-minimal": (data, theme) => renderDynamicResume(data, getTemplatePreset("modern-minimal")),
  "exec-luxury": (data, theme) => renderDynamicResume(data, getTemplatePreset("exec-luxury")),
  "corp-elite": (data, theme) => renderDynamicResume(data, getTemplatePreset("corp-elite")),
  "creative-design": (data, theme) => renderDynamicResume(data, getTemplatePreset("creative-design")),
  "dev-resume": (data, theme) => renderDynamicResume(data, getTemplatePreset("dev-resume")),
  "pm-resume": (data, theme) => renderDynamicResume(data, getTemplatePreset("pm-resume")),
  "marketing-resume": (data, theme) => renderDynamicResume(data, getTemplatePreset("marketing-resume")),
  "student-resume": (data, theme) => renderDynamicResume(data, getTemplatePreset("student-resume")),
  "freelancer-resume": (data, theme) => renderDynamicResume(data, getTemplatePreset("freelancer-resume")),

  // Aliases for retro-compatibility
  "modern": (data, theme) => renderDynamicResume(data, getTemplatePreset("modern-minimal")),
  "executive": (data, theme) => renderDynamicResume(data, getTemplatePreset("exec-luxury")),
  "ats": (data, theme) => renderDynamicResume(data, getTemplatePreset("ats-prof")),
  "minimal": (data, theme) => renderDynamicResume(data, getTemplatePreset("modern-minimal")),
  "creative": (data, theme) => renderDynamicResume(data, getTemplatePreset("creative-design")),
  "corporate": (data, theme) => renderDynamicResume(data, getTemplatePreset("corp-elite"))
};
