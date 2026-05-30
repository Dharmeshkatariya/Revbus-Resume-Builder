/* ==========================================================================
   REVBSUS WORKSPACE BUILDER CONTROLLER
   Manages the state, real-time input synchronization, undo/redo, lists, and local storage.
   ========================================================================= */

import { resumeTemplates } from "./templates.js";
import { AIAssistant } from "./ai.js";
import { themeController } from "./theme.js";

// Beautiful premium default prefilled resume information
export const defaultResumeData = {
  personal: {
    name: "Alex Sterling",
    title: "Lead Digital Architect & Interaction Designer",
    email: "sterling@revbsus.io",
    phone: "+1 (555) 303-1294",
    website: "www.sterling-design.io",
    address: "San Francisco, CA"
  },
  profile: "Accomplished, metrics-focused Interaction Designer with over 6 years of experience conceptualizing and shipping high-performance design engines, design systems, and responsive web landscapes. Expert at bridging complex front-end engineering with sleek, Apple-level micro-animations and intuitive user experience principles.",
  experience: [
    {
      company: "Linear Technologies",
      role: "Lead Product Designer & UX Engineer",
      startDate: "2023",
      endDate: "Present",
      location: "San Francisco, CA (Remote)",
      description: "Spearheaded the design system migration across three SaaS product packages, optimizing visual assets that accelerated front-end delivery by 40%. Engineered dynamic user flows and designed intuitive workspace dashboards utilized by over 500k active users daily."
    },
    {
      company: "Stripe",
      role: "Senior Interaction Designer",
      startDate: "2020",
      endDate: "2023",
      location: "San Francisco, CA",
      description: "Collaborated on billing interfaces, optimizing payment funnel flows which increased customer conversion values by 4.2%. Standardized visual patterns and refined UI micro-transitions that solidified Stripe's world-class interface reputation."
    }
  ],
  education: [
    {
      school: "Stanford University",
      degree: "M.S. in Interaction Design & Human Computer Interaction",
      startDate: "2018",
      endDate: "2020",
      location: "Stanford, CA",
      description: "Specialized in user behavior modeling, custom canvas render states, and physical interface prototypes. Graduated with honors."
    }
  ],
  skills: [
    { name: "Interaction Design", level: 5 },
    { name: "SaaS Design Systems", level: 5 },
    { name: "HTML5 / CSS3 / ES6+", level: 4 },
    { name: "WebGL / Three.js", level: 4 },
    { name: "Visual Prototyping", level: 5 },
    { name: "Figma Architecture", level: 5 }
  ],
  projects: [
    {
      title: "Vanguard UI Deck",
      role: "Lead Creator",
      description: "An elegant, highly modular framework showcasing premium accessibility design blocks.",
      url: "vanguard-deck.dev",
      techStack: "Figma, Canvas, GSAP"
    }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Japanese", proficiency: "Conversational" }
  ],
  certifications: [
    { title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2024" },
    { title: "Interaction Design Senior Fellow", issuer: "IxDA Academy Consortium", date: "2023" }
  ]
};

class ResumeBuilder {
  constructor() {
    this.data = { ...defaultResumeData };
    this.activeTemplate = "modern"; // modern, executive, ats, minimal, creative, corporate
    
    // Undo/Redo historical stacks
    this.undoStack = [];
    this.redoStack = [];
    
    this.isAutosaving = false;
  }

  init() {
    // Load from local storage if available
    const saved = localStorage.getItem("revbsus_resume_data");
    const savedTemplate = localStorage.getItem("revbsus_active_template");
    
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved resume data, using defaults", e);
      }
    }
    if (savedTemplate) {
      this.activeTemplate = savedTemplate;
    }

    this.renderFormFields();
    this.updatePreview();
    this.setupListeners();
  }

  // Back state snapshot up for Undo
  pushHistory() {
    // Limit stack depth to 30
    if (this.undoStack.length > 30) {
      this.undoStack.shift();
    }
    this.undoStack.push(JSON.stringify(this.data));
    this.redoStack = []; // Clear redo stack on new progressive actions
  }

  undo() {
    if (this.undoStack.length > 0) {
      this.redoStack.push(JSON.stringify(this.data));
      this.data = JSON.parse(this.undoStack.pop());
      this.renderFormFields();
      this.updatePreview();
      this.saveToStorage();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      this.undoStack.push(JSON.stringify(this.data));
      this.data = JSON.parse(this.redoStack.pop());
      this.renderFormFields();
      this.updatePreview();
      this.saveToStorage();
    }
  }

  saveToStorage() {
    localStorage.setItem("revbsus_resume_data", JSON.stringify(this.data));
    localStorage.setItem("revbsus_active_template", this.activeTemplate);
    this.triggerAutosaveBadge();
  }

  triggerAutosaveBadge() {
    const badge = document.getElementById("autosave-badge");
    if (badge) {
      badge.innerHTML = `<span style="color:#10b981;">●</span> Autosaved`;
      setTimeout(() => {
        badge.innerHTML = `● Connected`;
      }, 1500);
    }
  }

  setTemplate(templateKey) {
    if (resumeTemplates[templateKey]) {
      this.activeTemplate = templateKey;
      this.updatePreview();
      this.saveToStorage();
      
      // Update active state class in templates panel
      document.querySelectorAll(".template-card-selector").forEach(card => {
        card.classList.toggle("active", card.getAttribute("data-template") === templateKey);
      });
    }
  }

  updatePreview() {
    const sheet = document.getElementById("document-paper-sheet");
    if (sheet) {
      // Fetch HTML compiled from templates module
      const fontName = themeController?.config?.font || "inter";
      sheet.innerHTML = resumeTemplates[this.activeTemplate](this.data, themeController);
      
      // Apply Advanced Theme Customizer margin, font-size, line-height sliders, and paper background shades
      if (themeController && themeController.config) {
        const config = themeController.config;
        sheet.style.padding = `${config.margins ?? 40}px`;
        sheet.style.fontSize = `${config.fontSize ?? 14}px`;
        sheet.style.lineHeight = `${config.lineSpacing ?? 1.5}`;
        sheet.style.background = config.paperShadeCode ?? "#ffffff";
        
        if (config.paperShade === "cool-gray") {
          sheet.style.color = "#111827";
        } else if (config.paperShade === "warm-ivory") {
          sheet.style.color = "#1c1917";
        } else {
          sheet.style.color = "#1d1d1f";
        }
      }
      
      // Run AI Assist calculations Reactively to inputs
      const analysis = AIAssistant.analyzeResume(this.data);
      this.updateAIConsoles(analysis);
    }
  }

  updateAIConsoles(analysis) {
    // 1. Update ATS dynamic progress scoring indicators if on workspace
    const atsScoreLabel = document.getElementById("ai-ats-score-label");
    const atsFill = document.getElementById("ai-ats-fill");
    
    if (atsScoreLabel && atsFill) {
      atsScoreLabel.innerText = `${analysis.scores.ats}%`;
      atsFill.style.width = `${analysis.scores.ats}%`;
    }

    // 2. Recommendations table lists update
    const recsList = document.getElementById("ai-analysis-feedback-list");
    if (recsList) {
      recsList.innerHTML = analysis.recommendations.map(rec => `
        <li style="margin-bottom: 10px; display: flex; gap: 8px; align-items: flex-start; font-size: 0.88rem; line-height: 1.45;">
          <span style="color:var(--accent); font-weight:bold;">★</span>
          <span>${rec}</span>
        </li>
      `).join('');
    }

    // 3. Highlighted Keyword indicators
    const kwWrap = document.getElementById("ai-discovered-keywords");
    if (kwWrap) {
      if (analysis.keywordsFound.length === 0) {
        kwWrap.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">No high-impact verbs detected yet.</span>`;
      } else {
        kwWrap.innerHTML = analysis.keywordsFound.map(kw => `
          <span style="font-size: 0.72rem; padding: 2px 8px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 4px; color:#38bdf8; text-transform:uppercase; font-family:var(--font-mono);">${kw}</span>
        `).join(' ');
      }
    }
  }

  renderFormFields() {
    // Synchronize Personal details
    const bindKeys = ["personal-name", "personal-title", "personal-email", "personal-phone", "personal-website", "personal-address"];
    bindKeys.forEach(key => {
      const field = document.getElementById(key);
      if (field) {
        const prop = key.replace("personal-", "");
        field.value = this.data.personal[prop] || "";
      }
    });

    // Synchronize Summary description
    const profileField = document.getElementById("personal-profile");
    if (profileField) {
      profileField.value = this.data.profile || "";
    }

    // Render lists (Experience, Education, Projects, Skills)
    this.renderRepeater("experience", "experience-list-container");
    this.renderRepeater("education", "education-list-container");
    this.renderRepeater("projects", "projects-list-container");
    this.renderRepeater("skills", "skills-list-container");
    this.renderRepeater("languages", "languages-list-container");
    this.renderRepeater("certifications", "certifications-list-container");
  }

  renderRepeater(sectionKey, containerID) {
    const container = document.getElementById(containerID);
    if (!container) return;

    container.innerHTML = "";
    const items = this.data[sectionKey] || [];

    if (items.length === 0) {
      container.innerHTML = `<p style="font-size:0.88rem; color:var(--text-muted); text-align:center; padding: 20px;">No items entered. Click 'Add' below to begin.</p>`;
      return;
    }

    items.forEach((item, index) => {
      let cardInner = "";

      if (sectionKey === "experience") {
        cardInner = `
          <div class="grid-form-pair" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Company Name</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="company" value="${item.company || ""}">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Position Title</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="role" value="${item.role || ""}">
            </div>
          </div>
          <div class="grid-form-pair" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Dates (Start - End)</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="startDate" value="${item.startDate || ""}" style="width:48%; display:inline-block;">
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="endDate" value="${item.endDate || ""}" style="width:48%; display:inline-block; float:right;">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Location</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="location" value="${item.location || ""}">
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Bullet Point Description</label>
            <textarea class="input-premium req-bind bullet-check" data-section="${sectionKey}" data-index="${index}" data-prop="description" style="min-height:70px; resize:vertical;">${item.description || ""}</textarea>
          </div>
        `;
      } else if (sectionKey === "education") {
        cardInner = `
          <div class="grid-form-pair" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">School / Institution</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="school" value="${item.school || ""}">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Degree Detail</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="degree" value="${item.degree || ""}">
            </div>
          </div>
          <div class="grid-form-pair" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Graduation Date</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="endDate" value="${item.endDate || ""}">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Location</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="location" value="${item.location || ""}">
            </div>
          </div>
        `;
      } else if (sectionKey === "projects") {
        cardInner = `
          <div class="grid-form-pair" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Project Title</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="title" value="${item.title || ""}">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Project URL or Link</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="url" value="${item.url || ""}">
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Tech Stack used</label>
            <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="techStack" value="${item.techStack || ""}" placeholder="e.g. React, Node, WebGL">
          </div>
          <div>
            <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Description</label>
            <textarea class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="description" style="min-height:60px; resize:vertical;">${item.description || ""}</textarea>
          </div>
        `;
      } else if (sectionKey === "skills") {
        cardInner = `
          <div class="grid-form-pair" style="display:grid; grid-template-columns:2fr 1fr; gap:12px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Skill Name</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="name" value="${item.name || ""}">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Level (1-5)</label>
              <select class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="level" style="padding:11px 12px; height:46px;">
                <option value="5" ${item.level == 5 ? 'selected' : ''}>5 (Expert)</option>
                <option value="4" ${item.level == 4 ? 'selected' : ''}>4 (Competent)</option>
                <option value="3" ${item.level == 3 ? 'selected' : ''}>3 (Intermediate)</option>
                <option value="2" ${item.level == 2 ? 'selected' : ''}>2 (Basic)</option>
                <option value="1" ${item.level == 1 ? 'selected' : ''}>1 (Novice)</option>
              </select>
            </div>
          </div>
        `;
      } else if (sectionKey === "languages") {
        cardInner = `
          <div class="grid-form-pair" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Language Name</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="name" value="${item.name || ""}">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Proficiency</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="proficiency" value="${item.proficiency || ""}" placeholder="e.g. Native, Conversational">
            </div>
          </div>
        `;
      } else if (sectionKey === "certifications") {
        cardInner = `
          <div class="grid-form-pair" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Certification Title</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="title" value="${item.title || ""}">
            </div>
            <div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Issuing Organization</label>
              <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="issuer" value="${item.issuer || ""}">
            </div>
          </div>
          <div>
            <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Date Obtain / Year</label>
            <input type="text" class="input-premium req-bind" data-section="${sectionKey}" data-index="${index}" data-prop="date" value="${item.date || ""}" placeholder="e.g. 2024">
          </div>
        `;
      }

      // Add wrapper wrapper containing deletion and vertical order handles
      const itemWrap = document.createElement("div");
      itemWrap.className = "repeater-card";
      itemWrap.innerHTML = `
        <div style="margin-bottom:12px; display:flex; gap:10px; border-bottom:1px solid var(--border-color); padding-bottom:8px; align-items:center;">
          <span style="font-weight:600; font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">#${index+1} Entry</span>
          <!-- Order modification arrows -->
          <button class="order-adjust-btn" data-sec="${sectionKey}" data-dir="up" data-idx="${index}" style="cursor:pointer; color:var(--text-muted);"><i class="lucide-chevron-up" style="width:16px;"></i></button>
          <button class="order-adjust-btn" data-sec="${sectionKey}" data-dir="down" data-idx="${index}" style="cursor:pointer; color:var(--text-muted);"><i class="lucide-chevron-down" style="width:16px;"></i></button>
          <button class="repeater-delete" data-sec="${sectionKey}" data-idx="${index}"><i class="lucide-trash" style="width:16px;"></i></button>
        </div>
        ${cardInner}
      `;
      container.appendChild(itemWrap);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  addItem(sectionKey) {
    this.pushHistory();

    const emptyPatterns = {
      experience: { company: "", role: "", startDate: "", endDate: "", location: "", description: "" },
      education: { school: "", degree: "", endDate: "", location: "", description: "" },
      projects: { title: "", role: "", description: "", url: "", techStack: "" },
      skills: { name: "", level: 4 },
      languages: { name: "", proficiency: "" },
      certifications: { title: "", issuer: "", date: "" }
    };

    if (!this.data[sectionKey]) this.data[sectionKey] = [];
    this.data[sectionKey].push({ ...emptyPatterns[sectionKey] });
    
    this.renderFormFields();
    this.updatePreview();
    this.saveToStorage();
  }

  deleteItem(sectionKey, index) {
    this.pushHistory();
    this.data[sectionKey].splice(index, 1);
    this.renderFormFields();
    this.updatePreview();
    this.saveToStorage();
  }

  moveItem(sectionKey, index, direction) {
    this.pushHistory();
    const list = this.data[sectionKey];
    if (!list) return;

    if (direction === "up" && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === "down" && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }

    this.renderFormFields();
    this.updatePreview();
    this.saveToStorage();
  }

  setupListeners() {
    // 1. Double pane section headers toggle panels height
    document.addEventListener("click", (e) => {
      const toggleHead = e.target.closest(".builder-form-group-head");
      if (toggleHead) {
        const parent = toggleHead.closest(".builder-form-group");
        parent.classList.toggle("active");
        
        // rotate indicator icon
        const icon = parent.querySelector(".header-chevron");
        if (icon) {
          icon.style.transform = parent.classList.contains("active") ? "rotate(180deg)" : "rotate(0deg)";
        }
      }
    });

    // 2. Real-time inputs sync
    document.addEventListener("input", (e) => {
      // Input text binds
      if (e.target.id && e.target.id.startsWith("personal-")) {
        this.pushHistory();
        if (e.target.id === "personal-profile") {
          this.data.profile = e.target.value;
        } else {
          const prop = e.target.id.replace("personal-", "");
          this.data.personal[prop] = e.target.value;
        }
        this.updatePreview();
        this.saveToStorage();
      }

      // Richer binding for repeaters (Experience, Projects, etc.)
      const isRepeaterField = e.target.classList.contains("req-bind");
      if (isRepeaterField) {
        const sec = e.target.getAttribute("data-section");
        const idx = parseInt(e.target.getAttribute("data-index"));
        const prop = e.target.getAttribute("data-prop");

        if (this.data[sec] && this.data[sec][idx]) {
          this.pushHistory();
          this.data[sec][idx][prop] = e.target.value;
          this.updatePreview();
          this.saveToStorage();
        }

        // Live real-time active verb analyzer triggering
        if (e.target.classList.contains("bullet-check")) {
          const adviceWrap = document.getElementById("ai-bullet-suggestions");
          if (adviceWrap) {
            adviceWrap.innerHTML = AIAssistant.improveBulletPoint(e.target.value);
          }
        }
      }
    });

    // Handle selects in repeater fields
    document.addEventListener("change", (e) => {
      if (e.target.classList.contains("req-bind") && e.target.tagName === "SELECT") {
        const sec = e.target.getAttribute("data-section");
        const idx = parseInt(e.target.getAttribute("data-index"));
        const prop = e.target.getAttribute("data-prop");

        if (this.data[sec] && this.data[sec][idx]) {
          this.pushHistory();
          this.data[sec][idx][prop] = e.target.value;
          this.updatePreview();
          this.saveToStorage();
        }
      }
    });

    // 3. Setup lists adders
    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-repeater-item");
      if (addBtn) {
        const section = addBtn.getAttribute("data-section");
        this.addItem(section);
      }

      // Repeater element deletes
      const delBtn = e.target.closest(".repeater-delete");
      if (delBtn) {
        const sec = delBtn.getAttribute("data-sec");
        const idx = parseInt(delBtn.getAttribute("data-idx"));
        this.deleteItem(sec, idx);
      }

      // Order adjust triggers
      const orderBtn = e.target.closest(".order-adjust-btn");
      if (orderBtn) {
        const sec = orderBtn.getAttribute("data-sec");
        const idx = parseInt(orderBtn.getAttribute("data-idx"));
        const dir = orderBtn.getAttribute("data-dir");
        this.moveItem(sec, idx, dir);
      }

      // Undo - Redo Buttons
      const undoBtn = e.target.closest("#btn-undo-workspace");
      if (undoBtn) this.undo();

      const redoBtn = e.target.closest("#btn-redo-workspace");
      if (redoBtn) this.redo();
    });
  }
}

export const workspaceBuilder = new ResumeBuilder();
// Initialize after modules settle
workspaceBuilder.init();
