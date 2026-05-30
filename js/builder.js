/* ==========================================================================
   REVBSUS WORKSPACE BUILDER CONTROLLER
   Manages the state, real-time input synchronization, undo/redo, lists, and local storage.
   ========================================================================= */

import { resumeTemplates, renderDynamicResume, getTemplatePreset, iconSVGs } from "./templates.js";
import { AIAssistant } from "./ai.js";
import { themeController } from "./theme.js";
import { exporter } from "./export.js";

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
    this.activeTemplate = "modern-minimal"; // modern-minimal, exec-luxury, ats-prof, creative-design, corporate
    this.designerConfig = null;
    
    // Undo/Redo historical stacks
    this.undoStack = [];
    this.redoStack = [];
    
    this.isAutosaving = false;
  }

  init() {
    // Load from local storage if available
    const saved = localStorage.getItem("revbsus_resume_data");
    const savedTemplate = localStorage.getItem("revbsus_active_template");
    const savedConfig = localStorage.getItem("revbsus_designer_config");
    
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

    if (savedConfig) {
      try {
        this.designerConfig = JSON.parse(savedConfig);
      } catch (e) {
        console.error("Failed to parse designer config data", e);
      }
    }

    if (!this.designerConfig) {
      this.designerConfig = getTemplatePreset(this.activeTemplate || "modern-minimal");
    }

    // Load Version History Snapshots
    this.snapshots = [];
    const savedSnapshots = localStorage.getItem("revbsus_resume_snapshots");
    if (savedSnapshots) {
      try {
        this.snapshots = JSON.parse(savedSnapshots);
      } catch (e) {
        console.error("Failed to parse saved resume snapshots", e);
      }
    }

    this.renderFormFields();
    this.initDesignerControls();
    this.updatePreview();
    this.renderSnapshotsList();
    this.setupListeners();
    this.setupDesignerListeners();
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
    if (this.designerConfig) {
      localStorage.setItem("revbsus_designer_config", JSON.stringify(this.designerConfig));
    }
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
      this.designerConfig = getTemplatePreset(templateKey);
      this.initDesignerControls();
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
      if (!this.designerConfig) {
        this.designerConfig = getTemplatePreset(this.activeTemplate || "modern-minimal");
      }
      
      let baseHtml = renderDynamicResume(this.data, this.designerConfig);
      sheet.innerHTML = baseHtml;
      
      // Apply Advanced Theme Customizer margin
      if (themeController && themeController.config) {
        const config = themeController.config;
        sheet.style.padding = `${config.margins ?? 40}px`;
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

  renderSnapshotsList() {
    const listWrapper = document.getElementById("snapshots-list-wrapper");
    if (!listWrapper) return;

    if (!this.snapshots || this.snapshots.length === 0) {
      listWrapper.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:12px;">No saved snapshots yet.</p>`;
      return;
    }

    listWrapper.innerHTML = this.snapshots.map((snap, index) => {
      const dateStr = new Date(snap.timestamp).toLocaleString();
      return `
        <div class="glass-panel-luxury" style="padding:10px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; border:1px solid var(--border-color); background:rgba(255,255,255,0.01); margin-bottom:8px;">
          <div style="flex:1; min-width:0; padding-right:8px; text-align:left;">
            <div style="font-size:0.82rem; font-weight:600; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${snap.title}">${snap.title}</div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono); margin-top:2px;">${dateStr}</div>
          </div>
          <div style="display:flex; gap:6px; flex-shrink:0;">
            <button class="btn-glass revert-snapshot-btn" data-id="${snap.id}" style="padding:4px 8px; font-size:0.75rem; color:var(--accent); border-color:var(--accent); cursor:pointer;" title="Revert to this snapshot">Revert</button>
            <button class="btn-glass delete-snapshot-btn" data-id="${snap.id}" style="padding:4px 8px; font-size:0.75rem; color:#ef4444; border-color:rgba(239,68,68,0.2); cursor:pointer;" title="Delete snapshot"><i class="lucide-trash" style="width:12px; height:12px;"></i></button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  saveSnapshot(title) {
    const defaultTitle = `Snapshot #${this.snapshots.length + 1}`;
    const name = title.trim() || defaultTitle;
    const newSnapshot = {
      id: "snap_" + Date.now(),
      title: name,
      timestamp: Date.now(),
      data: JSON.stringify(this.data)
    };

    if (!this.snapshots) this.snapshots = [];
    this.snapshots.unshift(newSnapshot);
    localStorage.setItem("revbsus_resume_snapshots", JSON.stringify(this.snapshots));
    this.renderSnapshotsList();
  }

  revertToSnapshot(snapshotId) {
    const snapshot = this.snapshots.find(s => s.id === snapshotId);
    if (!snapshot) return;

    this.pushHistory();

    try {
      this.data = JSON.parse(snapshot.data);
      this.renderFormFields();
      this.updatePreview();
      this.saveToStorage();
      
      const badge = document.getElementById("autosave-badge");
      if (badge) {
        badge.innerHTML = `<span style="color:var(--accent);">●</span> Reverted to "${snapshot.title}"`;
        setTimeout(() => {
          badge.innerHTML = `● Connected`;
        }, 2500);
      }
    } catch (e) {
      console.error("Revert snapshot logic error", e);
    }
  }

  deleteSnapshot(snapshotId) {
    this.snapshots = this.snapshots.filter(s => s.id !== snapshotId);
    localStorage.setItem("revbsus_resume_snapshots", JSON.stringify(this.snapshots));
    this.renderSnapshotsList();
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

      // Save Snapshot Click
      const saveSnapBtn = e.target.closest("#btn-save-snapshot");
      if (saveSnapBtn) {
        const inputField = document.getElementById("snapshot-title-input");
        if (inputField) {
          const val = inputField.value;
          this.saveSnapshot(val);
          inputField.value = "";
        }
      }

      // Revert Snapshot Click
      const revertBtn = e.target.closest(".revert-snapshot-btn");
      if (revertBtn) {
        const snapId = revertBtn.getAttribute("data-id");
        this.revertToSnapshot(snapId);
      }

      // Delete Snapshot Click
      const delSnapBtn = e.target.closest(".delete-snapshot-btn");
      if (delSnapBtn) {
        const snapId = delSnapBtn.getAttribute("data-id");
        this.deleteSnapshot(snapId);
      }
    });

    // Enter Support inside snapshot title input
    document.addEventListener("keydown", (e) => {
      if (e.target.id === "snapshot-title-input" && e.key === "Enter") {
        e.preventDefault();
        const saveBtn = document.getElementById("btn-save-snapshot");
        if (saveBtn) saveBtn.click();
      }
    });
  }

  initDesignerControls() {
    if (!this.designerConfig) {
      this.designerConfig = getTemplatePreset(this.activeTemplate || "modern-minimal");
    }

    // --- Tab 2: Layout ---
    const layout = this.designerConfig.layout || "single-column";
    document.querySelectorAll(".layout-card").forEach(card => {
      card.classList.toggle("active", card.getAttribute("data-layout") === layout);
    });

    const hAlign = this.designerConfig.alignments?.header || "left";
    const sAlign = this.designerConfig.alignments?.sectionTitles || "left";
    const bAlign = this.designerConfig.alignments?.bodyContent || "left";
    const cAlign = this.designerConfig.alignments?.contactInfo || "left";
    
    const alignHSelect = document.getElementById("align-header");
    if (alignHSelect) alignHSelect.value = hAlign;
    const alignSSelect = document.getElementById("align-sections");
    if (alignSSelect) alignSSelect.value = sAlign;
    const alignBSelect = document.getElementById("align-body");
    if (alignBSelect) alignBSelect.value = bAlign;
    const alignCSelect = document.getElementById("align-contact");
    if (alignCSelect) alignCSelect.value = cAlign;

    // --- Tab 3: Typography System ---
    const tConfig = this.designerConfig.typography || {};
    const fontFam = tConfig.fontFamily || "Inter";
    const fSize = tConfig.fontSize || 14;
    const lHeight = tConfig.lineHeight || 1.5;
    const lSpacing = tConfig.letterSpacing || 0;
    const fWeight = tConfig.fontWeightBody || "400";

    const typoFont = document.getElementById("typo-font");
    if (typoFont) typoFont.value = fontFam;
    
    const typoSize = document.getElementById("typo-size");
    if (typoSize) typoSize.value = fSize;
    const typoSizeVal = document.getElementById("typo-size-val");
    if (typoSizeVal) typoSizeVal.innerText = `${fSize}px`;

    const typoHeight = document.getElementById("typo-height");
    if (typoHeight) typoHeight.value = Math.round(lHeight * 10);
    const typoHeightVal = document.getElementById("typo-height-val");
    if (typoHeightVal) typoHeightVal.innerText = `${lHeight}`;

    const typoSpacing = document.getElementById("typo-spacing");
    if (typoSpacing) typoSpacing.value = lSpacing;
    const typoSpacingVal = document.getElementById("typo-spacing-val");
    if (typoSpacingVal) typoSpacingVal.innerText = `${lSpacing}px`;

    const typoWeight = document.getElementById("typo-weight");
    if (typoWeight) typoWeight.value = fWeight;

    // --- Tab 4: Colors Palette ---
    const cConfig = this.designerConfig.colors || {};
    const colPrimary = cConfig.primary || "#111827";
    const colSecondary = cConfig.secondary || "#4b5563";
    const colAccent = cConfig.accent || "#8b5cf6";
    const colText = cConfig.text || "#1f2937";
    const colBg = cConfig.background || "#ffffff";

    this.syncColorElement("primary", colPrimary);
    this.syncColorElement("secondary", colSecondary);
    this.syncColorElement("accent", colAccent);
    this.syncColorElement("text", colText);
    this.syncColorElement("bg", colBg);

    // --- Tab 5: Section Layouts & Overrides ---
    const globalHeaderSelect = document.getElementById("toggle-global-headers");
    if (globalHeaderSelect) {
      globalHeaderSelect.value = this.designerConfig.globalHeadersStyle || "on";
    }
    const wrapperGlobal = document.getElementById("wrapper-global-header-controls");
    if (wrapperGlobal) {
      wrapperGlobal.style.display = (this.designerConfig.globalHeadersStyle === "on") ? "flex" : "none";
    }

    const sHeaders = this.designerConfig.sectionHeaders || {};
    const ghFont = document.getElementById("global-header-font");
    if (ghFont) ghFont.value = sHeaders.fontFamily || "Poppins";
    const ghSize = document.getElementById("global-header-size");
    if (ghSize) ghSize.value = sHeaders.fontSize || 14;
    const ghWeight = document.getElementById("global-header-weight");
    if (ghWeight) ghWeight.value = sHeaders.fontWeight || "700";
    const ghBorder = document.getElementById("global-header-border");
    if (ghBorder) ghBorder.value = sHeaders.borderStyle || "solid-bottom";

    this.renderSectionsAccordion();
    this.renderSectionOrderControls();

    // --- Tab 6: Header Settings ---
    const hStyle = this.designerConfig.headerStyle || {};
    const hFont = document.getElementById("h-font");
    if (hFont) hFont.value = hStyle.fontFamily || "Open Sans";
    const hSizeName = document.getElementById("h-size-name");
    if (hSizeName) hSizeName.value = hStyle.fontSizeName || 32;
    const hWeightName = document.getElementById("h-weight-name");
    if (hWeightName) hWeightName.value = hStyle.fontWeightName || "800";
    const hSizeTitle = document.getElementById("h-size-title");
    if (hSizeTitle) hSizeTitle.value = hStyle.fontSizeTitle || 16;
    const hWeightTitle = document.getElementById("h-weight-title");
    if (hWeightTitle) hWeightTitle.value = hStyle.fontWeightTitle || "600";
    const hBorder = document.getElementById("h-border");
    if (hBorder) hBorder.value = hStyle.borderStyle || "none";
    const hSpacing = document.getElementById("h-spacing");
    if (hSpacing) hSpacing.value = hStyle.spacing || 12;

    // --- Tab 7: Preset Quick Highlight ---
    document.querySelectorAll(".preset-card").forEach(pCard => {
      const prKey = pCard.getAttribute("data-preset");
      pCard.classList.toggle("active", prKey === this.activeTemplate);
    });
  }

  syncColorElement(key, hex) {
    const picker = document.getElementById(`picker-${key}`);
    const hexInput = document.getElementById(`hex-${key}`);
    if (picker) picker.value = hex;
    if (hexInput) hexInput.value = hex;
  }

  renderSectionsAccordion() {
    const container = document.getElementById("individual-sections-override-list");
    if (!container) return;

    container.innerHTML = "";
    const sections = this.designerConfig.sections || {};

    Object.keys(sections).forEach(key => {
      const sec = sections[key];
      const isLocked = sec.locked ? true : false;
      const isHidden = sec.hidden ? true : false;

      const row = document.createElement("div");
      row.className = "luxury-subcard";
      row.style.cssText = `
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: rgba(255,255,255,0.015);
        margin-bottom: 8px;
        overflow: hidden;
        transition: opacity 0.2s;
        opacity: ${isHidden ? 0.5 : 1};
      `;

      row.innerHTML = `
        <div class="accordion-section-header" style="padding:10px 14px; background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
          <div style="display:flex; align-items:center; gap:8px;">
            <i class="lucide-chevron-right sec-chevron" style="font-size:0.8rem; color:var(--accent); width:14px; height:14px; transition:transform 0.2s;"></i>
            <span style="font-size:0.85rem; font-weight:700; color:#ffffff;">${sec.title || key}</span>
            <span style="font-size:0.7rem; color:var(--text-muted); font-family:var(--font-mono); text-transform:uppercase;">[${key}]</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center;" onclick="event.stopPropagation();">
            <button class="btn-hide-sec" data-key="${key}" style="border:none; background:transparent; color:${isHidden ? 'var(--accent)' : 'var(--text-muted)'}; cursor:pointer;" title="Hide/Show section">
              <i class="${isHidden ? 'lucide-eye-off' : 'lucide-eye'}" style="width:16px; height:16px;"></i>
            </button>
            <button class="btn-lock-sec" data-key="${key}" style="border:none; background:transparent; color:${isLocked ? '#ef4444' : 'var(--text-muted)'}; cursor:pointer;" title="Lock/Unlock section modifications">
              <i class="${isLocked ? 'lucide-lock' : 'lucide-unlock'}" style="width:16px; height:16px;"></i>
            </button>
            <button class="btn-duplicate-sec" data-key="${key}" style="border:none; background:transparent; color:var(--text-muted); cursor:pointer;" title="Duplicate Section">
              <i class="lucide-copy" style="width:14px; height:14px;"></i>
            </button>
          </div>
        </div>
        
        <div class="accordion-section-body" style="display:none; padding:12px; border-top:1px solid var(--border-color); background:rgba(0,0,0,0.15); flex-direction:column; gap:10px;">
          <div>
            <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Rename Title Display</label>
            <input type="text" class="input-premium rename-sec-input" data-key="${key}" value="${sec.title || ""}" ${isLocked ? "disabled" : ""}>
          </div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Font Family</label>
              <select class="input-premium font-sec-select" data-key="${key}" ${isLocked ? "disabled" : ""}>
                <option value="Inter" ${sec.fontFamily === 'Inter' ? 'selected':''}>Inter</option>
                <option value="Poppins" ${sec.fontFamily === 'Poppins' ? 'selected':''}>Poppins</option>
                <option value="Montserrat" ${sec.fontFamily === 'Montserrat' ? 'selected':''}>Montserrat</option>
                <option value="DM Sans" ${sec.fontFamily === 'DM Sans' ? 'selected':''}>DM Sans</option>
                <option value="Playfair Display" ${sec.fontFamily === 'Playfair Display' ? 'selected':''}>Playfair Display</option>
                <option value="Roboto" ${sec.fontFamily === 'Roboto' ? 'selected':''}>Roboto</option>
                <option value="Open Sans" ${sec.fontFamily === 'Open Sans' ? 'selected':''}>Open Sans</option>
                <option value="Lora" ${sec.fontFamily === 'Lora' ? 'selected':''}>Lora</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Font Color</label>
              <input type="color" class="color-sec-picker" data-key="${key}" value="${sec.color || '#111827'}" ${isLocked ? "disabled" : ""} style="width:100%; height:32px; border-radius:4px; padding:0; border:none; background:none; cursor:pointer;">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Size (px)</label>
              <input type="number" class="input-premium size-sec-input" data-key="${key}" value="${sec.fontSize || 14}" min="10" max="32" ${isLocked ? "disabled" : ""}>
            </div>
            <div>
              <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Weight</label>
              <select class="input-premium weight-sec-select" data-key="${key}" ${isLocked ? "disabled" : ""}>
                <option value="500" ${sec.fontWeight === '500'?'selected':''}>Medium</option>
                <option value="600" ${sec.fontWeight === '600'?'selected':''}>Semi-Bold</option>
                <option value="700" ${sec.fontWeight === '700'?'selected':''}>Bold</option>
                <option value="800" ${sec.fontWeight === '800'?'selected':''}>Extra Bold</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Title Alignment</label>
              <select class="input-premium align-sec-select" data-key="${key}" ${isLocked ? "disabled" : ""}>
                <option value="left" ${sec.alignment === 'left' ? 'selected':''}>Left</option>
                <option value="center" ${sec.alignment === 'center' ? 'selected':''}>Center</option>
                <option value="right" ${sec.alignment === 'right' ? 'selected':''}>Right</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Divider Style</label>
              <select class="input-premium border-sec-select" data-key="${key}" ${isLocked ? "disabled" : ""}>
                <option value="none" ${sec.dividerStyle === 'none' ? 'selected':''}>None</option>
                <option value="solid-bottom" ${sec.dividerStyle === 'solid-bottom' ? 'selected':''}>Solid Line Below</option>
                <option value="double-bottom" ${sec.dividerStyle === 'double-bottom' ? 'selected':''}>Double Line Below</option>
                <option value="solid-top" ${sec.dividerStyle === 'solid-top' ? 'selected':''}>Solid Line Above</option>
                <option value="bullet" ${sec.dividerStyle === 'bullet' ? 'selected':''}>Left Accent Bullet</option>
                <option value="box" ${sec.dividerStyle === 'box' ? 'selected':''}>Filled Capsule</option>
              </select>
            </div>
          </div>

          <div>
            <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Icon Beside Title</label>
            <select class="input-premium icon-sec-select" data-key="${key}" ${isLocked ? "disabled" : ""}>
              <option value="" ${!sec.icon ? 'selected':''}>None</option>
              <option value="lucide-user" ${sec.icon === 'lucide-user'?'selected':''}>User Outline</option>
              <option value="lucide-briefcase" ${sec.icon === 'lucide-briefcase'?'selected':''}>Briefcase</option>
              <option value="lucide-graduation-cap" ${sec.icon === 'lucide-graduation-cap'?'selected':''}>Graduation Cap</option>
              <option value="lucide-wrench" ${sec.icon === 'lucide-wrench'?'selected':''}>Wrench Tools</option>
              <option value="lucide-languages" ${sec.icon === 'lucide-languages'?'selected':''}>Language Globe</option>
              <option value="lucide-award" ${sec.icon === 'lucide-award'?'selected':''}>Gold Award Shield</option>
              <option value="lucide-star" ${sec.icon === 'lucide-star'?'selected':''}>Interactive Star</option>
            </select>
          </div>
        </div>
      `;

      row.querySelector(".accordion-section-header").addEventListener("click", () => {
        const body = row.querySelector(".accordion-section-body");
        const chev = row.querySelector(".sec-chevron");
        const isOpen = body.style.display === "flex";
        body.style.display = isOpen ? "none" : "flex";
        chev.style.transform = isOpen ? "rotate(0deg)" : "rotate(90deg)";
      });

      container.appendChild(row);
    });
  }

  renderSectionOrderControls() {
    const container = document.getElementById("section-reorder-container");
    if (!container) return;

    container.innerHTML = "";
    const order = this.designerConfig.sectionOrder || [];
    const sections = this.designerConfig.sections || {};

    order.forEach((key, idx) => {
      const label = sections[key]?.title || key;

      const item = document.createElement("div");
      item.className = "section-order-item";
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-family:var(--font-sans); font-size:0.85rem; font-weight:700; color:#ffffff;">${label}</span>
          <span style="font-size:0.65rem; color:var(--text-muted); font-family:var(--font-mono);">[${key}]</span>
        </div>
        <div style="display:flex; gap:4px;">
          <button class="section-order-btn order-up" data-idx="${idx}" title="Move Up"><i class="lucide-arrow-up" style="width:14px; height:14px;"></i></button>
          <button class="section-order-btn order-down" data-idx="${idx}" title="Move Down"><i class="lucide-arrow-down" style="width:14px; height:14px;"></i></button>
        </div>
      `;

      container.appendChild(item);
    });
  }

  setupDesignerListeners() {
    // --- Tabs Toggling ---
    document.querySelectorAll(".designer-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tabKey = btn.getAttribute("data-tab");
        document.querySelectorAll(".designer-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".designer-tab-content").forEach(pane => {
          pane.classList.remove("active");
        });
        const targetPane = document.getElementById(`designer-panel-${tabKey}`);
        if (targetPane) {
          targetPane.classList.add("active");
        }
      });
    });

    // --- Layout switcher card click ---
    document.querySelectorAll(".layout-card").forEach(card => {
      card.addEventListener("click", () => {
        document.querySelectorAll(".layout-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        const layoutKey = card.getAttribute("data-layout");
        this.pushHistory();
        this.designerConfig.layout = layoutKey;
        this.updatePreview();
        this.saveToStorage();
      });
    });

    // --- Dropdowns ---
    document.getElementById("align-header")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.alignments) this.designerConfig.alignments = {};
      this.designerConfig.alignments.header = e.target.value;
      if (this.designerConfig.headerStyle) {
        this.designerConfig.headerStyle.alignment = e.target.value;
      }
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("align-sections")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.alignments) this.designerConfig.alignments = {};
      this.designerConfig.alignments.sectionTitles = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("align-body")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.alignments) this.designerConfig.alignments = {};
      this.designerConfig.alignments.bodyContent = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("align-contact")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.alignments) this.designerConfig.alignments = {};
      this.designerConfig.alignments.contactInfo = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });

    // --- Tab 3: Typography System Binds ---
    document.getElementById("typo-font")?.addEventListener("change", (e) => {
      this.pushHistory();
      this.designerConfig.typography.fontFamily = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("typo-size")?.addEventListener("input", (e) => {
      this.pushHistory();
      const val = parseInt(e.target.value);
      this.designerConfig.typography.fontSize = val;
      const label = document.getElementById("typo-size-val");
      if (label) label.innerText = `${val}px`;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("typo-height")?.addEventListener("input", (e) => {
      this.pushHistory();
      const val = parseFloat((parseInt(e.target.value) / 10).toFixed(1));
      this.designerConfig.typography.lineHeight = val;
      const label = document.getElementById("typo-height-val");
      if (label) label.innerText = `${val}`;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("typo-spacing")?.addEventListener("input", (e) => {
      this.pushHistory();
      const val = parseInt(e.target.value);
      this.designerConfig.typography.letterSpacing = val;
      const label = document.getElementById("typo-spacing-val");
      if (label) label.innerText = `${val}px`;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("typo-weight")?.addEventListener("change", (e) => {
      this.pushHistory();
      this.designerConfig.typography.fontWeightBody = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });

    // --- Tab 4: Colors Palette Designer Binds ---
    const bindColorControl = (key) => {
      const picker = document.getElementById(`picker-${key}`);
      const hexInput = document.getElementById(`hex-${key}`);
      
      const updateColor = (hexVal) => {
        this.pushHistory();
        this.designerConfig.colors[key] = hexVal;
        this.updatePreview();
        this.saveToStorage();
      };

      picker?.addEventListener("input", (e) => {
        const h = e.target.value;
        if (hexInput) hexInput.value = h;
        updateColor(h);
      });
      hexInput?.addEventListener("input", (e) => {
        let h = e.target.value.trim();
        if (h.startsWith("#") && h.length === 7) {
          if (picker) picker.value = h;
          updateColor(h);
        }
      });
    };
    bindColorControl("primary");
    bindColorControl("secondary");
    bindColorControl("accent");
    bindColorControl("text");
    bindColorControl("bg");

    // Click handler for solid palette presets
    document.addEventListener("click", (e) => {
      const cBtn = e.target.closest(".color-preset-btn");
      if (cBtn) {
        this.pushHistory();
        const p = cBtn.getAttribute("data-primary");
        const s = cBtn.getAttribute("data-secondary");
        const a = cBtn.getAttribute("data-accent");
        const t = cBtn.getAttribute("data-text");
        const b = cBtn.getAttribute("data-bg");

        this.designerConfig.colors.primary = p;
        this.designerConfig.colors.secondary = s;
        this.designerConfig.colors.accent = a;
        this.designerConfig.colors.text = t;
        this.designerConfig.colors.background = b;

        this.initDesignerControls();
        this.updatePreview();
        this.saveToStorage();
      }
    });

    // --- Tab 5: Sections ---
    document.getElementById("toggle-global-headers")?.addEventListener("change", (e) => {
      this.pushHistory();
      const val = e.target.value;
      this.designerConfig.globalHeadersStyle = val;
      const wrap = document.getElementById("wrapper-global-header-controls");
      if (wrap) wrap.style.display = (val === "on") ? "flex" : "none";
      this.updatePreview();
      this.saveToStorage();
    });

    document.getElementById("global-header-font")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.sectionHeaders) this.designerConfig.sectionHeaders = {};
      this.designerConfig.sectionHeaders.fontFamily = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("global-header-size")?.addEventListener("input", (e) => {
      this.pushHistory();
      if (!this.designerConfig.sectionHeaders) this.designerConfig.sectionHeaders = {};
      this.designerConfig.sectionHeaders.fontSize = parseInt(e.target.value);
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("global-header-weight")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.sectionHeaders) this.designerConfig.sectionHeaders = {};
      this.designerConfig.sectionHeaders.fontWeight = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("global-header-border")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.sectionHeaders) this.designerConfig.sectionHeaders = {};
      this.designerConfig.sectionHeaders.borderStyle = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });

    // Intercept section detail overrides inputs
    document.addEventListener("input", (e) => {
      if (e.target.classList.contains("rename-sec-input")) {
        const key = e.target.getAttribute("data-key");
        this.pushHistory();
        if (!this.designerConfig.sections[key]) this.designerConfig.sections[key] = {};
        this.designerConfig.sections[key].title = e.target.value;
        this.updatePreview();
        this.saveToStorage();
        this.renderSectionOrderControls();
      }
      if (e.target.classList.contains("size-sec-input")) {
        const key = e.target.getAttribute("data-key");
        this.pushHistory();
        if (!this.designerConfig.sections[key]) this.designerConfig.sections[key] = {};
        this.designerConfig.sections[key].fontSize = parseInt(e.target.value);
        this.updatePreview();
        this.saveToStorage();
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.classList.contains("font-sec-select")) {
        const key = e.target.getAttribute("data-key");
        this.pushHistory();
        if (!this.designerConfig.sections[key]) this.designerConfig.sections[key] = {};
        this.designerConfig.sections[key].fontFamily = e.target.value;
        this.updatePreview();
        this.saveToStorage();
      }
      if (e.target.classList.contains("weight-sec-select")) {
        const key = e.target.getAttribute("data-key");
        this.pushHistory();
        if (!this.designerConfig.sections[key]) this.designerConfig.sections[key] = {};
        this.designerConfig.sections[key].fontWeight = e.target.value;
        this.updatePreview();
        this.saveToStorage();
      }
      if (e.target.classList.contains("align-sec-select")) {
        const key = e.target.getAttribute("data-key");
        this.pushHistory();
        if (!this.designerConfig.sections[key]) this.designerConfig.sections[key] = {};
        this.designerConfig.sections[key].alignment = e.target.value;
        this.updatePreview();
        this.saveToStorage();
      }
      if (e.target.classList.contains("border-sec-select")) {
        const key = e.target.getAttribute("data-key");
        this.pushHistory();
        if (!this.designerConfig.sections[key]) this.designerConfig.sections[key] = {};
        this.designerConfig.sections[key].dividerStyle = e.target.value;
        this.updatePreview();
        this.saveToStorage();
      }
      if (e.target.classList.contains("icon-sec-select")) {
        const key = e.target.getAttribute("data-key");
        this.pushHistory();
        if (!this.designerConfig.sections[key]) this.designerConfig.sections[key] = {};
        this.designerConfig.sections[key].icon = e.target.value;
        this.updatePreview();
        this.saveToStorage();
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target.classList.contains("color-sec-picker")) {
        const key = e.target.getAttribute("data-key");
        this.pushHistory();
        if (!this.designerConfig.sections[key]) this.designerConfig.sections[key] = {};
        this.designerConfig.sections[key].color = e.target.value;
        this.updatePreview();
        this.saveToStorage();
      }
    });

    document.addEventListener("click", (e) => {
      const hideBtn = e.target.closest(".btn-hide-sec");
      if (hideBtn) {
        const key = hideBtn.getAttribute("data-key");
        this.pushHistory();
        const sc = this.designerConfig.sections[key];
        sc.hidden = !sc.hidden;
        this.renderSectionsAccordion();
        this.updatePreview();
        this.saveToStorage();
      }

      const lockBtn = e.target.closest(".btn-lock-sec");
      if (lockBtn) {
        const key = lockBtn.getAttribute("data-key");
        this.pushHistory();
        const sc = this.designerConfig.sections[key];
        sc.locked = !sc.locked;
        this.renderSectionsAccordion();
        this.updatePreview();
        this.saveToStorage();
      }

      const dupBtn = e.target.closest(".btn-duplicate-sec");
      if (dupBtn) {
        const key = dupBtn.getAttribute("data-key");
        this.pushHistory();
        const uuidKey = `${key}_copy_${Math.floor(Math.random() * 1000)}`;
        
        const scOriginal = this.designerConfig.sections[key];
        this.designerConfig.sections[uuidKey] = {
          ...scOriginal,
          title: `${scOriginal.title || key} (Copy)`,
          locked: false
        };

        if (this.data[key]) {
          this.data[uuidKey] = JSON.parse(JSON.stringify(this.data[key]));
        } else if (key === "profile") {
          this.data[uuidKey] = this.data.profile;
        }

        const originalIndex = this.designerConfig.sectionOrder.indexOf(key);
        if (originalIndex !== -1) {
          this.designerConfig.sectionOrder.splice(originalIndex + 1, 0, uuidKey);
        } else {
          this.designerConfig.sectionOrder.push(uuidKey);
        }

        this.renderSectionsAccordion();
        this.renderSectionOrderControls();
        this.updatePreview();
        this.saveToStorage();
      }
    });

    // Up/down reordering inside Tab 5
    document.addEventListener("click", (e) => {
      const upBtn = e.target.closest(".section-order-btn.order-up");
      if (upBtn) {
        const idx = parseInt(upBtn.getAttribute("data-idx"));
        if (idx > 0) {
          this.pushHistory();
          const list = this.designerConfig.sectionOrder;
          const temp = list[idx];
          list[idx] = list[idx - 1];
          list[idx - 1] = temp;
          this.renderSectionOrderControls();
          this.updatePreview();
          this.saveToStorage();
        }
      }

      const downBtn = e.target.closest(".section-order-btn.order-down");
      if (downBtn) {
        const idx = parseInt(downBtn.getAttribute("data-idx"));
        const list = this.designerConfig.sectionOrder;
        if (idx < list.length - 1) {
          this.pushHistory();
          const temp = list[idx];
          list[idx] = list[idx + 1];
          list[idx + 1] = temp;
          this.renderSectionOrderControls();
          this.updatePreview();
          this.saveToStorage();
        }
      }
    });

    // --- Tab 6: Header Settings ---
    document.getElementById("h-font")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.headerStyle) this.designerConfig.headerStyle = {};
      this.designerConfig.headerStyle.fontFamily = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("h-size-name")?.addEventListener("input", (e) => {
      this.pushHistory();
      if (!this.designerConfig.headerStyle) this.designerConfig.headerStyle = {};
      this.designerConfig.headerStyle.fontSizeName = parseInt(e.target.value);
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("h-weight-name")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.headerStyle) this.designerConfig.headerStyle = {};
      this.designerConfig.headerStyle.fontWeightName = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("h-size-title")?.addEventListener("input", (e) => {
      this.pushHistory();
      if (!this.designerConfig.headerStyle) this.designerConfig.headerStyle = {};
      this.designerConfig.headerStyle.fontSizeTitle = parseInt(e.target.value);
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("h-weight-title")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.headerStyle) this.designerConfig.headerStyle = {};
      this.designerConfig.headerStyle.fontWeightTitle = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("h-border")?.addEventListener("change", (e) => {
      this.pushHistory();
      if (!this.designerConfig.headerStyle) this.designerConfig.headerStyle = {};
      this.designerConfig.headerStyle.borderStyle = e.target.value;
      this.updatePreview();
      this.saveToStorage();
    });
    document.getElementById("h-spacing")?.addEventListener("input", (e) => {
      this.pushHistory();
      if (!this.designerConfig.headerStyle) this.designerConfig.headerStyle = {};
      this.designerConfig.headerStyle.spacing = parseInt(e.target.value);
      this.updatePreview();
      this.saveToStorage();
    });

    // --- Tab 7: Preset Quick apply click ---
    document.querySelectorAll(".preset-card").forEach(pCard => {
      pCard.addEventListener("click", () => {
        const prKey = pCard.getAttribute("data-preset");
        this.pushHistory();
        
        this.activeTemplate = prKey;
        this.designerConfig = getTemplatePreset(prKey);
        
        this.initDesignerControls();
        this.updatePreview();
        this.saveToStorage();

        document.querySelectorAll(".preset-card").forEach(c => c.classList.remove("active"));
        pCard.classList.add("active");
      });
    });

    // --- Tab 8: Custom Preserved Export Handlers ---
    document.getElementById("btn-export-pdf-custom")?.addEventListener("click", () => {
      exporter.exportPDF(`${this.data.personal?.name || "Resume"}_CV`);
    });
    document.getElementById("btn-export-docx-custom")?.addEventListener("click", () => {
      const sheet = document.getElementById("document-paper-sheet");
      exporter.exportDOCX(this.data, sheet.innerHTML, `${this.data.personal?.name || "Resume"}_CV.doc`);
    });
    document.getElementById("btn-export-html-custom")?.addEventListener("click", () => {
      const sheet = document.getElementById("document-paper-sheet");
      exporter.exportHTML(this.data, sheet.innerHTML, this.activeTemplate, `${this.data.personal?.name || "Resume"}_CV.html`);
    });
    document.getElementById("btn-export-txt-custom")?.addEventListener("click", () => {
      exporter.exportTXT(this.data, `${this.data.personal?.name || "Resume"}_CV.txt`);
    });
    document.getElementById("btn-export-json-custom")?.addEventListener("click", () => {
      exporter.exportJSON(this.data, `${this.data.personal?.name || "Resume"}_CV.json`);
    });

    // --- AI Integrations & Prompts ---

    // AI Generate drafted resume profiles
    document.getElementById("btn-ai-generate-resume")?.addEventListener("click", async () => {
      const promptInput = document.getElementById("ai-generate-prompt-input");
      const promptVal = promptInput?.value?.trim();
      if (!promptVal) {
        alert("Please enter a target role prompt (e.g. Fintech Deeptech Product Manager).");
        return;
      }

      const btn = document.getElementById("btn-ai-generate-resume");
      const origText = btn.innerHTML;
      btn.innerHTML = `<i class="lucide-loader" style="animation: spin 1s linear infinite; display: inline-block; width: 14px; height: 14px; margin-right: 4px;"></i> Drafting...`;
      btn.disabled = true;

      try {
        const response = await fetch("/api/ai/generate-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptVal })
        });
        const resJson = await response.json();
        if (resJson && resJson.data) {
          workspaceBuilder.pushHistory();
          workspaceBuilder.data = resJson.data;
          workspaceBuilder.renderFormFields();
          workspaceBuilder.updatePreview();
          workspaceBuilder.saveToStorage();
          
          alert("✨ Gemini AI has drafted a tailored resume matching your prompt requirements!");
        } else {
          alert("Could not generate resume draft. Please double check model connectivity specifications.");
        }
      } catch (e) {
        console.error("Generate error", e);
        alert("An error occurred during Gemini AI communication flow.");
      } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
      }
    });

    // AI Tailor Profile Summary text
    document.getElementById("btn-ai-tailor-resume")?.addEventListener("click", async () => {
      const roleInput = document.getElementById("ai-tailor-role-input");
      const roleVal = roleInput?.value?.trim();
      if (!roleVal) {
        alert("Please specify a target role to adapt your resume focus (e.g. Senior Security Lead).");
        return;
      }

      const btn = document.getElementById("btn-ai-tailor-resume");
      const origText = btn.innerHTML;
      btn.innerHTML = `<i class="lucide-loader" style="animation: spin 1s linear infinite; display: inline-block; width: 14px; height: 14px; margin-right: 4px;"></i> Adapting...`;
      btn.disabled = true;

      try {
        const response = await fetch("/api/ai/tailor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData: workspaceBuilder.data, targetRole: roleVal })
        });
        const resJson = await response.json();
        if (resJson && resJson.success && resJson.data) {
          workspaceBuilder.pushHistory();
          if (resJson.data.profile) {
            workspaceBuilder.data.profile = resJson.data.profile;
          }
          if (resJson.data.experience) {
            workspaceBuilder.data.experience = resJson.data.experience;
          }
          workspaceBuilder.renderFormFields();
          workspaceBuilder.updatePreview();
          workspaceBuilder.saveToStorage();
          
          alert(`✨ Your Profile and Experiences have been adapted by Gemini AI for a ${roleVal} position!`);
        } else {
          alert("Adaptation flow encountered an issue. Please try again.");
        }
      } catch (e) {
        console.error("Adapt error", e);
        alert("Communication failed during adaptive tailoring flow.");
      } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
      }
    });

    // AI ATS Vacancy match-checking
    document.getElementById("btn-ai-ats-fit-check")?.addEventListener("click", async () => {
      const jdTextarea = document.getElementById("ai-ats-target-jd");
      const jdVal = jdTextarea?.value?.trim();
      if (!jdVal) {
        alert("Please paste the job description text to perform ATS vacancy fit-checking.");
        return;
      }

      const btn = document.getElementById("btn-ai-ats-fit-check");
      const origText = btn.innerHTML;
      btn.innerHTML = `<i class="lucide-loader" style="animation: spin 1s linear infinite; display: inline-block; width: 14px; height: 14px; margin-right: 4px;"></i> Checking Fit...`;
      btn.disabled = true;

      try {
        const response = await fetch("/api/ai/analyze-fit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData: workspaceBuilder.data, jobDescription: jdVal })
        });
        const resJson = await response.json();
        
        const resultsDiv = document.getElementById("ai-ats-fit-results");
        if (resultsDiv && resJson) {
          resultsDiv.style.display = "block";
          
          const fitPercentage = document.getElementById("ai-fit-percentage");
          if (fitPercentage) {
            fitPercentage.innerText = `${resJson.fitScore || 0}%`;
          }

          const kwContainer = document.getElementById("ai-fit-missing-keywords");
          if (kwContainer) {
            if (resJson.missingKeywords && resJson.missingKeywords.length > 0) {
              kwContainer.innerHTML = resJson.missingKeywords.map(kw => `
                <span style="font-size:0.68rem; background:rgba(239, 68, 68, 0.12); color:#fc8181; border:1px solid rgba(239, 68, 68, 0.25); padding:2px 8px; border-radius:12px; font-weight:600; margin-right: 4px; margin-bottom: 4px; display: inline-block;">${kw}</span>
              `).join('');
            } else {
              kwContainer.innerHTML = `<span style="font-size:0.75rem; color:var(--accent);">No major missing keywords found!</span>`;
            }
          }

          const coachingUl = document.getElementById("ai-fit-coaching-tips");
          if (coachingUl) {
            const suggestions = resJson.suggestions || resJson.coaching || [];
            if (suggestions.length > 0) {
              coachingUl.innerHTML = suggestions.map(tip => `
                <li style="margin-bottom:4px; line-height:1.45;">${tip}</li>
              `).join('');
            } else {
              coachingUl.innerHTML = `<li style="list-style-type:none; color:var(--accent);">Great fit! Your resume is ready as is.</li>`;
            }
          }
          
          alert("✨ ATS Match Analysis successfully parsed. View your missing keywords and fit-tips in Section C below!");
        } else {
          alert("Match check analytical sequence failed.");
        }
      } catch (e) {
        console.error("Match check error", e);
        alert("Encountered connection faults during vacancy fit computation.");
      } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
      }
    });
  }
}

export const workspaceBuilder = new ResumeBuilder();
window.workspaceBuilder = workspaceBuilder;
// Initialize after modules settle
workspaceBuilder.init();
