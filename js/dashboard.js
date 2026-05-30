/* ==========================================================================
   REVBSUS DASHBOARD MANAGER
   Coordinates screen panels, sidebar tabs, interactive letter forms, and stats layout.
   ========================================================================= */

import { workspaceBuilder } from "./builder.js";
import { exporter } from "./export.js";
import { AIAssistant } from "./ai.js";

class DashboardPanelManager {
  constructor() {
    this.currentActivePanel = "workspace-builder-panel"; // defaults to core builder
  }

  init() {
    this.bindSidebarNavigation();
    this.bindWorkspaceActions();
    this.initCoverLetterEngine();
    this.initPortfolioEngine();
    this.renderStatsDiagrams();
  }

  // Swap panels smoothly
  switchPanel(panelId) {
    const panels = document.querySelectorAll(".workspace-panel");
    panels.forEach(p => p.classList.remove("active"));

    const target = document.getElementById(panelId);
    if (target) {
      target.classList.add("active");
      this.currentActivePanel = panelId;
      
      // Update sidebar highlighting
      document.querySelectorAll(".sidebar-item").forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-target") === panelId);
      });

      // Execute on-mount functions for specific panels
      if (panelId === "workspace-analytics-panel") {
        this.renderStatsDiagrams();
      }
    }
  }

  bindSidebarNavigation() {
    document.addEventListener("click", (e) => {
      const item = e.target.closest(".sidebar-item");
      if (item) {
        const target = item.getAttribute("data-target");
        this.switchPanel(target);
      }
    });
  }

  // Actions for templates picker, exporting, etc.
  bindWorkspaceActions() {
    // 1. Live Template Picker card click handling
    document.addEventListener("click", (e) => {
      const card = e.target.closest(".template-card-selector");
      if (card) {
        const key = card.getAttribute("data-template");
        workspaceBuilder.setTemplate(key);
      }

      // 2. Export Button triggers on export center panel
      const exportTrigger = e.target.closest(".trigger-format-export");
      if (exportTrigger) {
        const format = exportTrigger.getAttribute("data-format");
        const resumeData = workspaceBuilder.data;
        const currentTemplateHtml = document.getElementById("document-paper-sheet")?.innerHTML || "";

        switch (format) {
          case "pdf":
            exporter.exportPDF(`${resumeData.personal.name || "Resume"}_CV`);
            break;
          case "docx":
            exporter.exportDOCX(resumeData, currentTemplateHtml, `${resumeData.personal.name || "Resume"}_CV.doc`);
            break;
          case "txt":
            exporter.exportTXT(resumeData, `${resumeData.personal.name || "Resume"}_CV.txt`);
            break;
          case "json":
            exporter.exportJSON(resumeData, `${resumeData.personal.name || "Resume"}_CV.json`);
            break;
          case "html":
            exporter.exportHTML(resumeData, currentTemplateHtml, workspaceBuilder.activeTemplate, `${resumeData.personal.name || "Resume"}_CV.html`);
            break;
        }
      }
    });
  }

  // Dynamic Cover Letter Workspace Setup
  initCoverLetterEngine() {
    const triggerBtn = document.getElementById("generate-cl-btn");
    if (!triggerBtn) return;

    triggerBtn.addEventListener("click", () => {
      const jobField = document.getElementById("cl-job-input")?.value || "Product Designer";
      const compField = document.getElementById("cl-company-input")?.value || "Stripe";
      const resultTexter = document.getElementById("cl-output-textarea");

      if (resultTexter) {
        // Build letter template using actual resume data prefilled
        const letter = AIAssistant.generateCoverLetter(workspaceBuilder.data, jobField, compField);
        resultTexter.value = letter;
      }
    });

    // Copy Cover Letter Action
    const copyBtn = document.getElementById("copy-cl-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const text = document.getElementById("cl-output-textarea")?.value || "";
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.innerText = "Copied!";
          setTimeout(() => {
            copyBtn.innerText = "Copy to Clipboard";
          }, 1500);
        });
      });
    }

    // Export Cover Letter as Text Doc file
    const dlBtn = document.getElementById("download-cl-btn");
    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        const text = document.getElementById("cl-output-textarea")?.value || "";
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cover_letter.txt";
        a.click();
      });
    }
  }

  // Interactive Portfolio Page generator
  initPortfolioEngine() {
    const trigger = document.getElementById("generate-portfolio-btn");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const portWrap = document.getElementById("portfolio-output-canvas");
      if (!portWrap) return;

      const data = workspaceBuilder.data;
      const accent = themeController.getCurrentAccentHex();

      // Compiles flat visually premium online profile page structure in preview iframe or canvas card
      portWrap.innerHTML = `
        <div style="background:#fff; color:#18181b; padding:40px; border-radius:12px; border:2px solid var(--border-color); box-shadow:var(--shadow-lg); font-family:var(--font-sans);">
          <div style="text-align:center; padding-bottom:30px; border-bottom:1px solid #e4e4e7; margin-bottom:30px;">
            <div style="width:70px; height:70px; border-radius:50%; background:${accent}; display:flex; align-items:center; justify-content:center; color:white; font-size:1.8rem; font-weight:bold; margin:0 auto 16px;">
              ${(data.personal.name || "A").charAt(0)}
            </div>
            <h2 style="font-size:1.8rem; margin-bottom:4px;">${data.personal.name || "Alex Sterling"}</h2>
            <p style="color:${accent}; font-weight:600; font-size:0.95rem; text-transform:uppercase;">${data.personal.title || "Software Specialist"}</p>
            <p style="font-size:0.85rem; color:#71717a; margin-top:10px;">${data.personal.address || ""}</p>
          </div>
          
          <div style="margin-bottom:30px;">
            <h3 style="font-size:1.1rem; border-left:4px solid ${accent}; padding-left:10px; margin-bottom:12px;">Representative Work Milestones</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              ${(data.experience || []).map(exp => `
                <div style="padding:16px; border:1px solid #e4e4e7; border-radius:8px; background:#fafafa;">
                  <h4 style="font-size:0.95rem; font-weight:bold; margin-bottom:4px;">${exp.role || "Lead Specialist"}</h4>
                  <div style="font-size:0.8rem; color:#71717a; margin-bottom:8px;">${exp.company || "Stripe"} [${exp.startDate || ""} - ${exp.endDate || ""}]</div>
                  <p style="font-size:0.83rem; line-height:1.4; color:#3f3f46;">${exp.description || ""}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="text-align:center;">
            <button id="export-portfolio-btn" class="btn-premium" style="font-size:0.85rem; padding:10px 20px;">Download Standalone Portfolio</button>
          </div>
        </div>
      `;

      // Set up click handler for structural page export
      const dload = document.getElementById("export-portfolio-btn");
      if (dload) {
        dload.addEventListener("click", () => {
          const body = portWrap.innerHTML;
          exporter.exportHTML(data, body, "minimal", "portfolio_index.html");
        });
      }
    });
  }

  // Renders dynamic responsive visual metrics graphs on dashboard
  renderStatsDiagrams() {
    const scoreCanvas = document.getElementById("radar-score-svg");
    if (!scoreCanvas) return;

    // Fetch dynamic resume scores reactively to form density
    const stats = AIAssistant.analyzeResume(workspaceBuilder.data).scores;

    // Generate stunning high-contrast interactive inline SVG charts instead of relying on slow loading heavy Chart.js modules
    // This allows exact color alignments dynamically using theme config variables!
    const accent = themeController.getCurrentAccentHex();
    
    // Draw gorgeous animated metric gauges!
    scoreCanvas.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:16px; width:100%; text-align:center;">
        
        <!-- Score 1: ATS MATCH -->
        <div class="glass-panel-luxury" style="padding:20px; border-radius:12px;">
          <h4 style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px; text-transform:uppercase;">ATS Scan Score</h4>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" stroke-width="8"></circle>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="${accent}" stroke-width="8"
              stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * stats.ats / 100)}"
              style="transition: stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1); transform: rotate(-90deg); transform-origin: 50% 50%;"
            ></circle>
            <text x="50" y="55" font-family="var(--font-mono)" font-size="16" font-weight="bold" fill="var(--text-main)" text-anchor="middle">${stats.ats}%</text>
          </svg>
          <p style="font-size:0.75rem; color:#10b981; margin-top:10px; font-weight:600;"><i class="lucide-trending-up"></i> Dynamic Match</p>
        </div>

        <!-- Score 2: READABILITY -->
        <div class="glass-panel-luxury" style="padding:20px; border-radius:12px;">
          <h4 style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px; text-transform:uppercase;">Readability</h4>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" stroke-width="8"></circle>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" stroke-width="8"
              stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * stats.readability / 100)}"
              style="transition: stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1); transform: rotate(-90deg); transform-origin: 50% 50%;"
            ></circle>
            <text x="50" y="55" font-family="var(--font-mono)" font-size="16" font-weight="bold" fill="var(--text-main)" text-anchor="middle">${stats.readability}%</text>
          </svg>
          <p style="font-size:0.75rem; color:#10b981; margin-top:10px; font-weight:600;">Clear phrasing</p>
        </div>

        <!-- Score 3: KEYWORD REACH -->
        <div class="glass-panel-luxury" style="padding:20px; border-radius:12px;">
          <h4 style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px; text-transform:uppercase;">Keyword Match</h4>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" stroke-width="8"></circle>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#38bdf8" stroke-width="8"
              stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * stats.keyword / 100)}"
              style="transition: stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1); transform: rotate(-90deg); transform-origin: 50% 50%;"
            ></circle>
            <text x="50" y="55" font-family="var(--font-mono)" font-size="16" font-weight="bold" fill="var(--text-main)" text-anchor="middle">${stats.keyword}%</text>
          </svg>
          <p style="font-size:0.75rem; color:var(--accent); margin-top:10px; font-weight:600;">Density target</p>
        </div>

        <!-- Score 4: DESIGN PATTERN -->
        <div class="glass-panel-luxury" style="padding:20px; border-radius:12px;">
          <h4 style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px; text-transform:uppercase;">Formatting Style</h4>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" stroke-width="8"></circle>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ec4899" stroke-width="8"
              stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * stats.design / 100)}"
              style="transition: stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1); transform: rotate(-90deg); transform-origin: 50% 50%;"
            ></circle>
            <text x="50" y="55" font-family="var(--font-mono)" font-size="16" font-weight="bold" fill="var(--text-main)" text-anchor="middle">${stats.design}%</text>
          </svg>
          <p style="font-size:0.75rem; color:#ec4899; margin-top:10px; font-weight:600;">Grid layout</p>
        </div>

        <!-- Score 5: HEALTH index -->
        <div class="glass-panel-luxury" style="padding:20px; border-radius:12px;">
          <h4 style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px; text-transform:uppercase;">Doc Health</h4>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" stroke-width="8"></circle>
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" stroke-width="8"
              stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * stats.health / 100)}"
              style="transition: stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1); transform: rotate(-90deg); transform-origin: 50% 50%;"
            ></circle>
            <text x="50" y="55" font-family="var(--font-mono)" font-size="16" font-weight="bold" fill="var(--text-main)" text-anchor="middle">${stats.health}%</text>
          </svg>
          <p style="font-size:0.75rem; color:#f59e0b; margin-top:10px; font-weight:600;">Recruit scale</p>
        </div>

      </div>
    `;
  }
}

export const dashboardManager = new DashboardPanelManager();
// Set up handlers in context
dashboardManager.init();
