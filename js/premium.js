/* ==========================================================================
   REVBSUS PHASE 2 PREMIUM UX & VISUAL DESIGNER ENGINE
   Adds advanced luxury interactions: Command Palette, Context Menus, Custom Cursor,
   Tooltips, Toast, Canvas Rulers, Smart Skeletons, Layer Manager, and AI Inline Rewrite.
   ========================================================================= */

import { themeController } from "./theme.js";
import { workspaceBuilder } from "./builder.js";
import { exporter } from "./export.js";
import { AIAssistant } from "./ai.js";

class PremiumUXEngine {
  constructor() {
    this.selectedItemIndex = -1; // tracks builder list items
    this.selectedItemSection = null;
    this.cursorEnabled = true;
    this.customGradients = this.getSavedGradients();
    this.activeGradient = null;
  }

  init() {
    this.setupCursorSystem();
    this.setupToastSystem();
    this.setupTooltipSystem();
    this.setupCommandPalette();
    this.setupContextMenus();
    this.setupKeyboardShortcuts();
    this.setupRulersAndGuides();
    this.setupAutoSaveTracker();
    this.setupResponsiveDesigner();
    this.setupThemeStudio();
    this.setupVisualLayerManager();
    this.setupHoverFeedback();
    this.setupMiniMap();
    this.setupEmptyStateIntercept();
    this.renderHealthWidget();
    this.setupInlineAIRewriters();

    // Universal Icon fallback support
    this.initUniversalIconManager();
  }

  // ==========================================================================
  // 1. UNIVERSAL ICON ENGINE
  // ==========================================================================
  initUniversalIconManager() {
    window.UniversalIcon = (name, fallbackEmoji = "📄") => {
      if (!name) return `<span class="u-icon">${fallbackEmoji}</span>`;
      const normalizedName = name.toLowerCase().trim();
      
      // 1. check if loaded in window.lucide
      if (window.lucide && window.lucide.icons && window.lucide.icons[normalizedName]) {
        return `<i data-lucide="${normalizedName}" class="u-icon-lucide"></i>`;
      }
      
      // 2. Phosphor fallbacks
      const phosphorFallbacks = {
        "user": "ph-user",
        "profile": "ph-user-focus",
        "briefcase": "ph-briefcase",
        "experience": "ph-briefcase-metal",
        "folder": "ph-folder-simple-star",
        "projects": "ph-kanban",
        "graduation-cap": "ph-student",
        "education": "ph-graduation-cap",
        "wrench": "ph-wrench",
        "skills": "ph-chart-bar",
        "languages": "ph-translate",
        "award": "ph-trophy",
        "star": "ph-star-four",
        "camera": "ph-camera",
        "download": "ph-download-simple",
        "settings": "ph-sliders",
        "history": "ph-clock-counter-clockwise",
        "trash": "ph-trash-simple"
      };

      const cleanKey = normalizedName.replace("lucide-", "").replace("ph-", "");
      if (phosphorFallbacks[cleanKey]) {
        return `<i class="ph ${phosphorFallbacks[cleanKey]} u-icon-ph"></i>`;
      }

      // 3. Custom beautiful SVGs
      const customSVGs = {
        "timeline-block": `<svg class="u-icon-svg" style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2;" viewBox="0 0 24 24"><path d="M12 8v4l3 3M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z"/></svg>`,
        "skill-meter-block": `<svg class="u-icon-svg" style="width:1.1em; height:1.1em; fill:none; stroke:currentColor; stroke-width:2;" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17v-4M15 17V7"/></svg>`,
        "diamond-accent": `<svg class="u-icon-svg" style="width:0.8em; height:0.8em; fill:var(--accent);" viewBox="0 0 24 24"><path d="M12 2 2 12l10 10 10-10Z"/></svg>`
      };
      if (customSVGs[cleanKey]) {
        return customSVGs[cleanKey];
      }

      // 4. Emoji failsafe
      const emojiIcons = {
        "user": "👤", "profile": "👤",
        "briefcase": "💼", "experience": "💼",
        "folder": "📁", "projects": "📁",
        "graduation-cap": "🎓", "education": "🎓",
        "wrench": "🛠️", "skills": "🛠️",
        "languages": "🌐", "award": "🏆",
        "settings": "⚙️", "trash": "🗑️", "sparkles": "✨"
      };

      if (emojiIcons[cleanKey]) {
        return `<span class="u-icon-emoji">${emojiIcons[cleanKey]}</span>`;
      }

      return `<span class="u-icon-emoji">${fallbackEmoji}</span>`;
    };
  }

  // ==========================================================================
  // 2. SMART COHESIVE TOAST SYSTEM
  // ==========================================================================
  setupToastSystem() {
    const container = document.createElement("div");
    container.id = "premium-toast-container";
    container.className = "toast-wrapper";
    document.body.appendChild(container);

    window.toast = {
      show: (type, title, message = "", duration = 4000) => {
        const toastItem = document.createElement("div");
        toastItem.className = `toast-item toast-${type}`;
        
        let icon = "💡";
        if (type === "success") icon = "✨";
        if (type === "error") icon = "🚨";
        if (type === "warning") icon = "⚠️";

        toastItem.innerHTML = `
          <div class="toast-glass"></div>
          <div class="toast-indicator" style="background: var(--toast-brand);"></div>
          <span class="toast-icon">${icon}</span>
          <div class="toast-body">
            <h5 class="toast-title">${title}</h5>
            ${message ? `<p class="toast-desc">${message}</p>` : ""}
          </div>
          <button class="toast-close">&times;</button>
        `;

        container.appendChild(toastItem);

        // Slide/blur entrance trigger
        setTimeout(() => toastItem.classList.add("toast-visible"), 10);

        // Hover stop timing
        let timeoutId = setTimeout(() => {
          this.dismissToast(toastItem);
        }, duration);

        toastItem.addEventListener("mouseenter", () => clearTimeout(timeoutId));
        toastItem.addEventListener("mouseleave", () => {
          timeoutId = setTimeout(() => this.dismissToast(toastItem), 2000);
        });

        toastItem.querySelector(".toast-close").addEventListener("click", () => {
          this.dismissToast(toastItem);
        });
      },
      success: (title, desc) => window.toast.show("success", title, desc),
      info: (title, desc) => window.toast.show("info", title, desc),
      warning: (title, desc) => window.toast.show("warning", title, desc),
      error: (title, desc) => window.toast.show("error", title, desc)
    };
  }

  dismissToast(toastItem) {
    toastItem.classList.remove("toast-visible");
    toastItem.classList.add("toast-leaving");
    setTimeout(() => {
      toastItem.remove();
    }, 400);
  }

  // ==========================================================================
  // 3. CUSTOM MESH CURSOR SYSTEM (With Mobile Disable)
  // ==========================================================================
  setupCursorSystem() {
    // Disable automatically on mobiles/tablets
    if (window.matchMedia("(pointer: coarse)").matches) {
      this.cursorEnabled = false;
      return;
    }

    const cursorFollower = document.createElement("div");
    cursorFollower.id = "custom-luxury-cursor";
    cursorFollower.className = "luxury-cursor-follower";
    document.body.appendChild(cursorFollower);

    const cursorCore = document.createElement("div");
    cursorCore.id = "custom-luxury-cursor-core";
    cursorCore.className = "luxury-cursor-core";
    document.body.appendChild(cursorCore);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorCore.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Spring interpolation animations logic
    const renderCursor = () => {
      const speedOffset = 0.16; // delay coefficient
      followerX += (mouseX - followerX) * speedOffset;
      followerY += (mouseY - followerY) * speedOffset;

      cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Custom morph hover rules
    document.addEventListener("mouseover", (e) => {
      if (!e.target || typeof e.target.closest !== "function") return;
      const hoverTarget = e.target.closest("button, input, select, textarea, a, .template-card-selector, .snapshot-card");
      if (hoverTarget) {
        cursorFollower.classList.add("cursor-hover-active");
        cursorCore.classList.add("cursor-core-hover");
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (!e.target || typeof e.target.closest !== "function") return;
      const hoverTarget = e.target.closest("button, input, select, textarea, a, .template-card-selector, .snapshot-card");
      if (hoverTarget) {
        cursorFollower.classList.remove("cursor-hover-active");
        cursorCore.classList.remove("cursor-core-hover");
      }
    });
  }

  // ==========================================================================
  // 4. SMART CONTEXT MENU (Figma/Canva style right-clicks)
  // ==========================================================================
  setupContextMenus() {
    const contextMenu = document.createElement("div");
    contextMenu.id = "luxury-context-menu";
    contextMenu.className = "premium-context-menu";
    document.body.appendChild(contextMenu);

    document.addEventListener("contextmenu", (e) => {
      if (!e.target || typeof e.target.closest !== "function") return;
      const builderItem = e.target.closest(".builder-repeater-item");
      const blockCard = e.target.closest(".builder-form-group");
      
      if (builderItem || blockCard) {
        e.preventDefault();
        
        const activeName = builderItem ? "List Row" : "Section Block";
        const sectionId = blockCard ? blockCard.getAttribute("data-section") || "experience" : "experience";
        this.selectedItemSection = sectionId;

        contextMenu.innerHTML = `
          <div class="context-title">Action Console: ${activeName}</div>
          <button class="context-item" id="ctx-opt-rename"><span class="context-icon">✍️</span> Rename / Edit Title</button>
          <button class="context-item" id="ctx-opt-duplicate"><span class="context-icon">👯</span> Duplicate Row <span class="context-shortcut">Ctrl+D</span></button>
          <button class="context-item" id="ctx-opt-moveup"><span class="context-icon">⬆️</span> Move Up <span class="context-shortcut">▲</span></button>
          <button class="context-item" id="ctx-opt-movedown"><span class="context-icon">⬇️</span> Move Down <span class="context-shortcut">▼</span></button>
          <button class="context-item context-item-danger" id="ctx-opt-delete"><span class="context-icon">🗑️</span> Delete Item <span class="context-shortcut">Del</span></button>
        `;

        contextMenu.style.top = `${e.clientY + window.scrollY}px`;
        contextMenu.style.left = `${e.clientX + window.scrollX}px`;
        contextMenu.classList.add("open");

        // Action triggers
        document.getElementById("ctx-opt-rename")?.addEventListener("click", () => {
          this.triggerRenameFlow(builderItem || blockCard);
          contextMenu.classList.remove("open");
        });

        document.getElementById("ctx-opt-duplicate")?.addEventListener("click", () => {
          if (builderItem) {
            this.duplicateListRow(builderItem);
          } else {
            window.toast.warning("Select individual list blocks to duplicate.");
          }
          contextMenu.classList.remove("open");
        });

        document.getElementById("ctx-opt-moveup")?.addEventListener("click", () => {
          this.shiftRowUpDown(builderItem, "up");
          contextMenu.classList.remove("open");
        });

        document.getElementById("ctx-opt-movedown")?.addEventListener("click", () => {
          this.shiftRowUpDown(builderItem, "down");
          contextMenu.classList.remove("open");
        });

        document.getElementById("ctx-opt-delete")?.addEventListener("click", () => {
          if (builderItem) {
            builderItem.querySelector(".delete-repeater-item")?.click();
          } else {
            window.toast.warning("Default sections can only be hidden inside the sidebar Layers Manager.");
          }
          contextMenu.classList.remove("open");
        });
      } else {
        contextMenu.classList.remove("open");
      }
    });

    document.addEventListener("click", () => {
      contextMenu.classList.remove("open");
    });
  }

  triggerRenameFlow(elem) {
    const labelField = elem.querySelector("input, h4");
    if (labelField) {
      window.toast.info("Click into field to rename", "You can custom-tailor any input directly inside the input cards.");
      labelField.focus();
    }
  }

  duplicateListRow(builderItem) {
    // Find section identifier
    const container = builderItem.closest("[id$='list-container']");
    if (container) {
      // Create duplicate state using workspaceBuilder structure
      const inputs = builderItem.querySelectorAll("input, textarea");
      window.toast.success("Row duplicated successfully!");
      
      // Select add button
      const addBtn = builderItem.closest(".builder-form-body")?.querySelector(".add-repeater-item");
      if (addBtn) {
        addBtn.click();
        // prefill the newly added row
        setTimeout(() => {
          const lastItem = container.lastElementChild;
          if (lastItem) {
            const newInputs = lastItem.querySelectorAll("input, textarea");
            inputs.forEach((inp, idx) => {
              if (newInputs[idx]) {
                newInputs[idx].value = inp.value;
                newInputs[idx].dispatchEvent(new Event('input', { bubbles: true }));
              }
            });
            workspaceBuilder.updatePreview();
          }
        }, 100);
      }
    }
  }

  shiftRowUpDown(builderItem, direction) {
    if (!builderItem) return;
    const parent = builderItem.parentNode;
    if (direction === "up" && builderItem.previousElementSibling) {
      parent.insertBefore(builderItem, builderItem.previousElementSibling);
      window.toast.success("Swapped layer elements higher");
    } else if (direction === "down" && builderItem.nextElementSibling) {
      parent.insertBefore(builderItem.nextElementSibling, builderItem);
      window.toast.success("Swapped layer elements lower");
    }
    // Fire dynamic input event to force order update
    builderItem.querySelector("input")?.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // ==========================================================================
  // 5. GLASSMORPHIC SMART TOOLTIPS (Arrow & Smart alignment)
  // ==========================================================================
  setupTooltipSystem() {
    const tooltip = document.createElement("div");
    tooltip.id = "luxury-tooltip-bubble";
    tooltip.className = "luxury-tooltip-box";
    document.body.appendChild(tooltip);

    // Apply interactive data triggers to actions
    const tooltipActions = [
      { element: "#btn-zoom-in", title: "Zoom In", shortcut: "Ctrl +" },
      { element: "#btn-zoom-out", title: "Zoom Out", shortcut: "Ctrl -" },
      { element: "#btn-zoom-fit", title: "Fit Canvas To Layout Page", shortcut: "Ctrl 0" },
      { element: "#btn-toggle-left-pane", title: "Collapse Form Editor Menu", shortcut: "[ " },
      { element: "#btn-toggle-right-pane", title: "Collapse Settings Pane", shortcut: "] " },
      { element: "#btn-toggle-focus-mode", title: "Immersive View", shortcut: "F " },
      { element: "#btn-save-snapshot", title: "Snapshot Builder State", shortcut: "Ctrl S" },
      { element: ".trigger-format-export[data-format='pdf']", title: "Download PDF document", shortcut: "Ctrl P" }
    ];

    tooltipActions.forEach(act => {
      const el = document.querySelector(act.element);
      if (el) {
        el.setAttribute("data-premium-tooltip", act.title);
        el.setAttribute("data-premium-shortcut", act.shortcut);
      }
    });

    document.addEventListener("mouseenter", (e) => {
      if (!e.target || typeof e.target.closest !== "function") return;
      const tooltipTrigger = e.target.closest("[data-premium-tooltip]");
      if (tooltipTrigger) {
        const title = tooltipTrigger.getAttribute("data-premium-tooltip");
        const shortcut = tooltipTrigger.getAttribute("data-premium-shortcut") || "";

        tooltip.innerHTML = `
          <span>${title}</span>
          ${shortcut ? `<span class="tooltip-shortcut">${shortcut}</span>` : ""}
          <div class="tooltip-arrow"></div>
        `;

        const bounds = tooltipTrigger.getBoundingClientRect();
        tooltip.classList.add("open");

        // Align coordinates top center
        const alignX = bounds.left + (bounds.width / 2) - (tooltip.offsetWidth / 2);
        const alignY = bounds.top - tooltip.offsetHeight - 8;

        tooltip.style.left = `${alignX + window.scrollX}px`;
        tooltip.style.top = `${alignY + window.scrollY}px`;
      }
    }, true);

    document.addEventListener("mouseleave", (e) => {
      if (e.target && typeof e.target.closest === "function" && e.target.closest("[data-premium-tooltip]")) {
        tooltip.classList.remove("open");
      }
    }, true);
  }

  // ==========================================================================
  // 6. COMMAND PALETTE ENGINE (Ctrl + K)
  // ==========================================================================
  setupCommandPalette() {
    const wrapper = document.createElement("div");
    wrapper.id = "command-palette-backdrop";
    wrapper.className = "search-palette-backdrop";
    wrapper.innerHTML = `
      <div class="palette-container">
        <div class="palette-searchbar-wrapper">
          <span class="palette-search-icon">🔍</span>
          <input type="text" id="palette-search-input" placeholder="Type a command or search action (e.g., PDF, Template, Summary)..." autofocus>
          <span class="palette-close-esc">Esc</span>
        </div>
        <div class="palette-results-wrapper" id="palette-results-list">
          <!-- Action options lists render here -->
        </div>
        <div class="palette-footer-nav">
          <span>▲▼ Navigate</span>
          <span>↵ Execute</span>
          <span>Tab To Cycle Options</span>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    const input = document.getElementById("palette-search-input");
    const results = document.getElementById("palette-results-list");

    const actions = [
      { id: "add-exp", name: "Add Work Experience Row", category: "Builder Content", icon: "💼", execution: () => { document.querySelector("[data-section='experience']").click(); } },
      { id: "add-proj", name: "Add Technical Project Row", category: "Builder Content", icon: "📁", execution: () => { document.querySelector("[data-section='projects']").click(); } },
      { id: "add-edu", name: "Add Academic Degree", category: "Builder Content", icon: "🎓", execution: () => { document.querySelector("[data-section='education']").click(); } },
      { id: "add-skill", name: "Add New Skill Competency", category: "Builder Content", icon: "🛠️", execution: () => { document.querySelector("[data-section='skills']").click(); } },
      { id: "export-pdf", name: "Export Resume as high-res A4 PDF", category: "Exports Modules", icon: "📈", execution: () => { exporter.exportPDF(`${workspaceBuilder.data.personal.name || "Resume"}_CV`); } },
      { id: "export-json", name: "Download JSON Backup code", category: "Exports Modules", icon: "💾", execution: () => { exporter.exportJSON(workspaceBuilder.data, "resume_config.json"); } },
      { id: "open-drawer", name: "Open System Presets Drawers", category: "Layout Designer", icon: "⚙️", execution: () => { document.querySelector(".floating-customizer-btn").click(); } },
      { id: "theme-sunset", name: "Switch theme to Luxury Midnight", category: "Themes", icon: "🌌", execution: () => { themeController.setPreset("midnight-black"); } },
      { id: "theme-cream", name: "Switch theme to Warm Cream", category: "Themes", icon: "🪵", execution: () => { themeController.setPreset("warm-cream"); } },
      { id: "view-focus", name: "Toggle focus view boundaries", category: "Workspace Layout", icon: "👁️", execution: () => { document.getElementById("btn-toggle-focus-mode").click(); } },
      { id: "save-snap", name: "Instant Snapshot Draft Point", category: "Backup", icon: "📷", execution: () => { workspaceBuilder.saveSnapshot("CMD Snapshot draft"); window.toast.success("Draft saved inside Version snapshot panel!"); } }
    ];

    const filterActions = (query) => {
      const q = query.toLowerCase().trim();
      const matched = actions.filter(act => act.name.toLowerCase().includes(q) || act.category.toLowerCase().includes(q));

      results.innerHTML = matched.map((act, idx) => `
        <div class="palette-row ${idx === 0 ? "active" : ""}" data-idx="${idx}" id="palette-opt-${act.id}">
          <span class="palette-row-icon">${act.icon}</span>
          <div class="palette-row-text">
            <span class="palette-row-name">${act.name}</span>
            <span class="palette-row-cat">${act.category}</span>
          </div>
          <span class="palette-row-run">↵ Run</span>
        </div>
      `).join('');

      // Add click execution
      matched.forEach((act, idx) => {
        document.getElementById(`palette-opt-${act.id}`).addEventListener("click", () => {
          act.execution();
          wrapper.classList.remove("open");
        });
      });
    };

    // Global toggle listener
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        wrapper.classList.add("open");
        input.value = "";
        filterActions("");
        setTimeout(() => input.focus(), 150);
      }

      if (e.key === "Escape" && wrapper.classList.contains("open")) {
        wrapper.classList.remove("open");
      }
    });

    wrapper.addEventListener("click", (e) => {
      if (e.target === wrapper) wrapper.classList.remove("open");
    });

    input.addEventListener("input", (e) => filterActions(e.target.value));
  }

  // ==========================================================================
  // 7. KEYBOARD SHORTCUTS CONTROLLER
  // ==========================================================================
  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Avoid firing while editing texts/forms
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        if (e.key === "Escape") {
          document.activeElement.blur();
        }
        return;
      }

      // 1. ZUM IN / ZUM OUT / SETTINGS
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const saveBtn = document.getElementById("btn-save-snapshot");
        if (saveBtn) saveBtn.click();
      }

      // 2. Undo-Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        workspaceBuilder.undo();
        window.toast.info("Draft snapshot rolled back successfully!");
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        workspaceBuilder.redo();
        window.toast.info("Draft snapshot restored successfully!");
      }
    });
  }

  // ==========================================================================
  // 8. CANVAS RULERS, GUIDES, PRINT-SAFE AREA
  // ==========================================================================
  setupRulersAndGuides() {
    const container = document.querySelector(".canvas-zoom-wrapper");
    if (!container) return;

    // Create rules wrap
    const hr = document.createElement("div");
    hr.id = "canvas-horizontal-ruler";
    hr.className = "canvas-ruler horizontal-ruler-track";
    container.appendChild(hr);

    const vr = document.createElement("div");
    vr.id = "canvas-vertical-ruler";
    vr.className = "canvas-ruler vertical-ruler-track";
    container.appendChild(vr);

    // Populate marks dynamically
    let hMarks = "";
    for (let i = 0; i < 900; i += 50) {
      hMarks += `<span style="left:${i}px;">${i % 100 === 0 ? i : ""}</span>`;
    }
    hr.innerHTML = hMarks;

    let vMarks = "";
    for (let i = 0; i < 1150; i += 50) {
      vMarks += `<span style="top:${i}px;">${i % 100 === 0 ? i : ""}</span>`;
    }
    vr.innerHTML = vMarks;

    // Toggle guidelines switch button
    const toolsTray = document.querySelector(".canvas-interactive-tools-tray");
    if (toolsTray) {
      const guideToggler = document.createElement("button");
      guideToggler.className = "btn-glass";
      guideToggler.style.padding = "6px 12px";
      guideToggler.style.fontSize = "0.78rem";
      guideToggler.innerHTML = `📐 Canvas Guides`;
      toolsTray.appendChild(guideToggler);

      guideToggler.addEventListener("click", () => {
        const sheet = document.getElementById("document-paper-sheet");
        if (sheet) {
          const hasGuides = sheet.classList.contains("print-safety-active");
          if (hasGuides) {
            sheet.classList.remove("print-safety-active");
            window.toast.info("Print guidelines hidden.");
          } else {
            sheet.classList.add("print-safety-active");
            window.toast.success("Print-safe margin indicators overlay enabled!");
          }
        }
      });
    }
  }

  // ==========================================================================
  // 9. COHESIVE SMART AUTO-SAVE FEEDBACK
  // ==========================================================================
  setupAutoSaveTracker() {
    const topBar = document.querySelector(".dashboard-topbar div");
    if (topBar) {
      const saveStateWrap = document.createElement("div");
      saveStateWrap.id = "smart-autosave-cloud-state";
      saveStateWrap.className = "premium-autosave-badge";
      saveStateWrap.innerHTML = `<span class="autosave-circle"></span> Saved to local cloud`;
      topBar.appendChild(saveStateWrap);

      // Listen to form inputs changes to flash saving animation
      document.addEventListener("input", () => {
        saveStateWrap.innerHTML = `<span class="autosave-circle saving-active"></span> Core synchronization...`;
        saveStateWrap.style.opacity = "1";
        
        // Debounce simulated complete save
        if (this.saveTimer) clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => {
          saveStateWrap.innerHTML = `<span class="autosave-circle"></span> Cloud Synced`;
          setTimeout(() => {
            saveStateWrap.innerHTML = `<span class="autosave-circle active-circle"></span> Ready`;
          }, 1500);
        }, 1200);
      });
    }
  }

  // ==========================================================================
  // 10. VISUAL LAYER DRAFTER MANAGER (Canva / Figma Layout sorting)
  // ==========================================================================
  setupVisualLayerManager() {
    const listPanel = document.getElementById("drawer-tab-sections");
    if (!listPanel) return;

    // Append dynamic Layer component
    const layerManagerWrap = document.createElement("div");
    layerManagerWrap.className = "layer-manager-wrapper";
    layerManagerWrap.innerHTML = `
      <div class="layer-manager-header">
        <h5>Visual layer manager</h5>
        <span class="layer-badge">Canva Engine Mode</span>
      </div>
      <div id="visual-layers-list-container" class="layers-container">
        <!-- populated from template section state dynamically -->
      </div>
    `;

    listPanel.insertBefore(layerManagerWrap, listPanel.lastElementChild);

    this.renderLayers();
  }

  renderLayers() {
    const layersBox = document.getElementById("visual-layers-list-container");
    if (!layersBox) return;

    const items = [
      { id: "profile", label: "Executive Summary", icon: "👤", locked: false, visible: true },
      { id: "experience", label: "Work History", icon: "💼", locked: false, visible: true },
      { id: "projects", label: "Developer Projects", icon: "📁", locked: false, visible: true },
      { id: "skills", label: "Skills Matrix Panel", icon: "📊", locked: false, visible: true },
      { id: "education", label: "Academic Pedigrees", icon: "🎓", locked: false, visible: true }
    ];

    layersBox.innerHTML = items.map(item => `
      <div class="layer-block-row" id="layer-row-${item.id}">
        <span class="layer-row-drag">☰</span>
        <span class="layer-row-icon">${item.icon}</span>
        <span class="layer-row-title">${item.label}</span>
        <div class="layer-row-actions">
          <button class="layer-action-btn" id="layer-visible-${item.id}" title="Toggle Visiblity">👁️</button>
          <button class="layer-action-btn" id="layer-lock-${item.id}" title="Toggle Editing Lock">🔓</button>
        </div>
      </div>
    `).join('');

    // Connect layer toggle hooks
    items.forEach(item => {
      document.getElementById(`layer-visible-${item.id}`).addEventListener("click", (e) => {
        const btn = e.target;
        if (btn.innerText === "👁️") {
          btn.innerText = "✖️";
          btn.style.opacity = "0.5";
          window.toast.info(`${item.label} hidden in printed output.`);
          // Hide actual render block inside document preview sheet
          const tgt = document.getElementById(`document-paper-sheet`)?.querySelector(`[data-section-block="${item.id}"]`);
          if (tgt) tgt.style.display = "none";
        } else {
          btn.innerText = "👁️";
          btn.style.opacity = "1";
          window.toast.success(`${item.label} restored on canvas!`);
          const tgt = document.getElementById(`document-paper-sheet`)?.querySelector(`[data-section-block="${item.id}"]`);
          if (tgt) tgt.style.display = "block";
        }
      });

      document.getElementById(`layer-lock-${item.id}`).addEventListener("click", (e) => {
        const btn = e.target;
        if (btn.innerText === "🔓") {
          btn.innerText = "🔒";
          btn.style.color = "var(--accent)";
          window.toast.warning(`${item.label} is now locked in form editor.`);
          // Lock fields belonging to section
          document.querySelector(`[data-section="${item.id}"]`)?.closest(".builder-form-group")?.querySelectorAll("input, textarea").forEach(el => el.disabled = true);
        } else {
          btn.innerText = "🔓";
          btn.style.color = "inherit";
          window.toast.success(`${item.label} unlocked in editor.`);
          document.querySelector(`[data-section="${item.id}"]`)?.closest(".builder-form-group")?.querySelectorAll("input, textarea").forEach(el => el.disabled = false);
        }
      });
    });
  }

  // ==========================================================================
  // 11. STREAMLINED THEME STUDIO PRO & CUSTOM ACCENTS
  // ==========================================================================
  setupThemeStudio() {
    const listPanel = document.getElementById("drawer-tab-presets");
    if (!listPanel) return;

    const studioWrap = document.createElement("div");
    studioWrap.className = "studio-wrapper";
    studioWrap.innerHTML = `
      <div class="studio-header">
        <h5>Visual theme gradients studio</h5>
        <span class="studio-badge">Gradient builder</span>
      </div>
      <div class="studio-g-grid">
        <button class="gradient-btn-swatch swatch-aurora" data-grad="linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)">Aurora Flare</button>
        <button class="gradient-btn-swatch swatch-linear" data-grad="linear-gradient(90deg, #111827, #3b82f6)">Linear Minimal</button>
        <button class="gradient-btn-swatch swatch-conic" data-grad="conic-gradient(from 180deg at 50% 50%, #8b5cf6, #38bdf8, #8b5cf6)">Conic Luxury</button>
        <button class="gradient-btn-swatch swatch-radial" data-grad="radial-gradient(circle, #8b5cf6 0%, #111827 100%)">Radial Glow</button>
        <button class="gradient-btn-swatch swatch-mesh" data-grad="linear-gradient(45deg, #ff007f, #7f00ff, #00ffff)">Cyber Punk Mesh</button>
      </div>
      <div style="margin-top:12px; display:flex; gap:6px;">
        <button id="btn-save-custom-theme" class="btn-premiumPrice" style="flex:1; padding:6px 10px; font-size:0.75rem;">💾 Save Theme</button>
        <button id="btn-reset-custom-theme" class="btn-glass" style="flex:1; padding:6px 10px; font-size:0.75rem;">🔄 Reset Accent</button>
      </div>
    `;

    listPanel.appendChild(studioWrap);

    // Swatches listeners
    document.querySelectorAll(".gradient-btn-swatch").forEach(sw => {
      sw.addEventListener("click", () => {
        const formula = sw.getAttribute("data-grad");
        const sheet = document.getElementById("document-paper-sheet");
        if (sheet) {
          // Set canvas background to custom mesh gradient
          sheet.style.background = formula;
          sheet.style.borderColor = "var(--accent)";
          window.toast.success("Mesh visual gradient applied to resume sheet beautifully!");
        }
      });
    });

    document.getElementById("btn-reset-custom-theme")?.addEventListener("click", () => {
      const sheet = document.getElementById("document-paper-sheet");
      if (sheet) {
        sheet.style.background = "#ffffff";
        sheet.style.borderColor = "var(--border-color)";
        window.toast.info("Themes defaulted to bleached paper style.");
      }
    });
  }

  getSavedGradients() {
    const saved = localStorage.getItem("revbsus_custom_gradients");
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  // ==========================================================================
  // 12. RESPONSIVE DESIGNER MODE (Desktop, Tablet, Mobile canvas views)
  // ==========================================================================
  setupResponsiveDesigner() {
    const parentContainer = document.querySelector(".canvas-zoom-indicator-box");
    if (!parentContainer) return;

    const respModeWidget = document.createElement("div");
    respModeWidget.className = "responsive-mode-widget";
    respModeWidget.innerHTML = `
      <button class="resp-btn active" id="resp-desk" title="Desktop view Mode">🖥️ Desktop</button>
      <button class="resp-btn" id="resp-tab" title="Tablet preview view">📱 Tablet</button>
      <button class="resp-btn" id="resp-mob" title="Interactive mobile visual">🤳 Mobile</button>
    `;

    parentContainer.appendChild(respModeWidget);

    const zoomWrap = document.querySelector(".canvas-zoom-wrapper");

    document.getElementById("resp-desk").addEventListener("click", (e) => {
      this.switchRespState(e.target, "100%", zoomWrap);
    });

    document.getElementById("resp-tab").addEventListener("click", (e) => {
      this.switchRespState(e.target, "768px", zoomWrap);
    });

    document.getElementById("resp-mob").addEventListener("click", (e) => {
      this.switchRespState(e.target, "414px", zoomWrap);
    });
  }

  switchRespState(btn, val, zoomWrap) {
    document.querySelectorAll(".resp-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (zoomWrap) {
      zoomWrap.style.width = val;
      zoomWrap.style.maxWidth = "100%";
      window.toast.success(`Designer scaled to ${val} grid view.`);
    }
  }

  // ==========================================================================
  // 13. INTERACTIVE MINIMAP & AUTO NAV HIGHLIGHT
  // ==========================================================================
  setupMiniMap() {
    const appContainer = document.getElementById("workspace-builder-panel");
    if (!appContainer) return;

    const miniMap = document.createElement("div");
    miniMap.id = "builder-minimap-nav";
    miniMap.className = "visual-canvas-minimap";
    miniMap.innerHTML = `
      <div class="minimap-dot" data-nav="personal" title="Personal Info"></div>
      <div class="minimap-dot" data-nav="profile" title="Summary Executive"></div>
      <div class="minimap-dot" data-nav="experience" title="Work Experiences"></div>
      <div class="minimap-dot" data-nav="projects" title="Core Projects"></div>
      <div class="minimap-dot" data-nav="skills" title="Skill Competencies"></div>
    `;

    appContainer.appendChild(miniMap);

    // MiniMap Click Navigation
    document.querySelectorAll(".minimap-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        const id = dot.getAttribute("data-nav");
        // Scroll workspace input to current block
        const targetBlock = document.querySelector(`[data-section="${id}"]`) || document.getElementById(`personal-name`);
        if (targetBlock) {
          targetBlock.closest(".builder-form-group")?.scrollIntoView({ behavior: "smooth", block: "start" });
          window.toast.info(`Scrolled workspace content to ${id.toUpperCase()} inputs.`);
        }
      });
    });
  }

  // ==========================================================================
  // 14. ELEGANT SKELETON LOADERS
  // ==========================================================================
  triggerSkeletonLoaderOnSheet() {
    const sheet = document.getElementById("document-paper-sheet");
    if (!sheet) return;

    // Save previous
    const previousHtml = sheet.innerHTML;
    sheet.innerHTML = `
      <div class="resume-skeleton-container shimmer-effect">
        <div class="skel-line skel-banner"></div>
        <div class="skel-line skel-title"></div>
        <div class="skel-row">
          <div class="skel-line skel-para" style="width:70%;"></div>
          <div class="skel-line skel-para" style="width:80%;"></div>
        </div>
        <div class="skel-line skel-banner" style="margin-top:40px; height:20px;"></div>
        <div class="skel-grid">
          <div class="skel-box"></div>
          <div class="skel-box"></div>
        </div>
      </div>
    `;

    setTimeout(() => {
      sheet.innerHTML = previousHtml;
    }, 450);
  }

  // ==========================================================================
  // 15. LIVE RESUME HEALTH INTEGRATED MONITOR
  // ==========================================================================
  renderHealthWidget() {
    const viewPort = document.querySelector(".builder-split-screen");
    if (!viewPort) return;

    const healthBadge = document.createElement("div");
    healthBadge.id = "resume-health-monitor-floating-panel";
    healthBadge.className = "health-monitor-capsule";
    healthBadge.innerHTML = `
      <div class="health-head">
        <span class="health-dot"></span>
        <h6>ATS Radar Score</h6>
      </div>
      <div class="health-radial-wrap" style="display:flex; align-items:center; gap:16px; margin: 10px 0;">
        <svg class="score-ring" viewBox="0 0 36 36" style="width:40px; height:40px;">
          <circle class="ring-bg" cx="18" cy="18" r="16"></circle>
          <circle class="ring-fill" id="health-svg-ring" cx="18" cy="18" r="16" stroke-dasharray="75 100"></circle>
        </svg>
        <div>
          <div class="health-score" id="health-live-percent" style="font-size:0.95rem; font-weight:800; color:var(--text-main);">75% Match</div>
          <div style="font-size:0.62rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Optimized Form</div>
        </div>
      </div>
      <div class="health-expand-details" id="health-toggle-expand" style="cursor:pointer; font-size:0.65rem; color:var(--accent); text-align:center; padding: 6px 0; border-top:1px solid rgba(255,255,255,0.04); margin-top:4px;">👁️ ATS Recommendations</div>
      <div id="health-hidden-bullets" style="display:none; flex-direction:column; gap:6px; margin-top:8px; border-top:1px solid rgba(255,255,255,0.06); padding-top:6px;">
        <p style="font-size:0.68rem; color:var(--text-muted); display:flex; align-items:start; gap:6px;"><span style="color:var(--accent);">✓</span> Complete email & linkedin</p>
        <p style="font-size:0.68rem; color:var(--text-muted); display:flex; align-items:start; gap:6px;"><span style="color:var(--accent);">✓</span> Leverage metric impact verbs</p>
        <p style="font-size:0.68rem; color:var(--text-muted); display:flex; align-items:start; gap:6px;"><span style="color:var(--accent);">✓</span> Target STAR phrase model</p>
      </div>
    `;

    viewPort.appendChild(healthBadge);

    // Expand toggle listener
    document.getElementById("health-toggle-expand").addEventListener("click", () => {
      const block = document.getElementById("health-hidden-bullets");
      if (block.style.display === "none") {
        block.style.display = "flex";
      } else {
        block.style.display = "none";
      }
    });

    // Update live health when preview compiles
    document.addEventListener("input", () => {
      setTimeout(() => {
        if (!window.workspaceBuilder) return;
        const stats = AIAssistant.analyzeResume(window.workspaceBuilder.data);
        const ring = document.getElementById("health-svg-ring");
        const lbl = document.getElementById("health-live-percent");
        if (ring && lbl) {
          const score = stats.scores.health;
          ring.setAttribute("stroke-dasharray", `${score} 100`);
          lbl.innerText = `${score}% Match`;
        }
      }, 350);
    });
  }

  // ==========================================================================
  // 16. SHIMMERING AI-POWERED INLINE REWRITE WIDGETS
  // ==========================================================================
  setupInlineAIRewriters() {
    // Inject custom hover triggers into inputs/textareas of sections
    document.querySelectorAll("textarea, .input-premium").forEach(field => {
      const parent = field.parentNode;
      if (parent && !parent.querySelector(".inline-rewrite-sparkle-btn")) {
        const sparkle = document.createElement("button");
        sparkle.className = "inline-rewrite-sparkle-btn";
        sparkle.innerHTML = "✨";
        sparkle.type = "button";
        sparkle.title = "Transform wording using Google Gemini high-grade models";

        parent.style.position = "relative";
        parent.appendChild(sparkle);

        sparkle.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();

          // Clear any active dropdown
          const oldMenu = document.querySelector(".ai-dropdown-choice-menu");
          if (oldMenu) oldMenu.remove();

          const activeText = field.value;
          if (!activeText || activeText.trim().length < 5) {
            window.toast.warning("Draft text is empty", "Type a basic bullet point list or sentence first before running modern AI optimizations.");
            return;
          }

          // Create the dropdown menu floating container
          const menu = document.createElement("div");
          menu.className = "ai-dropdown-choice-menu";
          menu.innerHTML = `
            <div class="ai-menu-option" data-mode="star">
              <i class="lucide-sparkles"></i>
              <span>🎯 STAR Format Wording</span>
            </div>
            <div class="ai-menu-option" data-mode="verbs">
              <i class="lucide-zap"></i>
              <span>⚡ Enhance Action Verbs</span>
            </div>
            <div class="ai-menu-option" data-mode="metrics">
              <i class="lucide-trending-up"></i>
              <span>📈 Quantify Impact (Add Metrics)</span>
            </div>
            <div class="ai-menu-option" data-mode="flow">
              <i class="lucide-align-left"></i>
              <span>✍️ Perfect Grammar & Flow</span>
            </div>
          `;

          document.body.appendChild(menu);

          // Precision absolute position relative to screen coords
          const rect = sparkle.getBoundingClientRect();
          menu.style.position = "absolute";
          menu.style.top = `${rect.bottom + window.scrollY + 6}px`;
          menu.style.left = `${Math.max(10, rect.right - 240 + window.scrollX)}px`;

          // Handle choice selections
          menu.querySelectorAll(".ai-menu-option").forEach(opt => {
            opt.addEventListener("click", async (optEvent) => {
              optEvent.stopPropagation();
              const mode = opt.getAttribute("data-mode");
              menu.remove();

              let modifier = "";
              if (mode === "star") modifier = " (Style instruction: Apply state-of-the-art STAR - Situation Task Action Result formatting with active impact metrics)";
              else if (mode === "verbs") modifier = " (Style instruction: Swap passive words with top-tier product leader action verbs)";
              else if (mode === "metrics") modifier = " (Style instruction: Creatively inject realistic estimated numbers, KPIs and percentage gains)";
              else if (mode === "flow") modifier = " (Style instruction: Polish readability metrics, flow and general grammar layout)";

              sparkle.innerHTML = "⚡";
              sparkle.classList.add("sparkle-spin-shimmer");

              try {
                const resp = await fetch("/api/ai/optimize-bullet", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ bulletText: activeText + modifier })
                });
                const payload = await resp.json();
                
                if (payload && payload.optimizedText) {
                  field.value = payload.optimizedText;
                  // Trigger input sync to form state
                  field.dispatchEvent(new Event('input', { bubbles: true }));
                  if (window.workspaceBuilder) {
                    window.workspaceBuilder.updatePreview();
                  }

                  window.toast.success("AI optimization applied!", payload.explanation || "Updated wording structure.");
                }
              } catch (err) {
                console.error("AI optimise fail:", err);
                window.toast.error("AI service error", "Gemini optimization temporary unavailable. Please check your setup.");
              } finally {
                sparkle.innerHTML = "✨";
                sparkle.classList.remove("sparkle-spin-shimmer");
              }
            });
          });

          // Secondary close handler
          const outsideClick = () => {
            menu.remove();
            document.removeEventListener("click", outsideClick);
          };
          setTimeout(() => document.addEventListener("click", outsideClick), 50);
        });
      }
    });
  }

  // ==========================================================================
  // 17. EMPTY STATE DESIGN SYSTEM
  // ==========================================================================
  setupEmptyStateIntercept() {
    // Intercept when builder sections list clears and inject premium visuals
    document.addEventListener("click", (e) => {
      if (!e.target || typeof e.target.closest !== "function") return;
      const delBtn = e.target.closest(".delete-repeater-item");
      if (delBtn) {
        setTimeout(() => {
          const containers = ["experience-list-container", "projects-list-container", "skills-list-container"];
          containers.forEach(id => {
            const box = document.getElementById(id);
            if (box && box.children.length === 0) {
              const secName = id.replace("-list-container", "").toUpperCase();
              box.innerHTML = `
                <div class="workspace-card-empty-state shimmer-subtle">
                  <div class="empty-shape-art"></div>
                  <h6 class="empty-title">Draft list is empty</h6>
                  <p class="empty-desc">Optimize compliance rates by providing metrics-focused experience items inside this ${secName} module.</p>
                  <button class="btn-premium empty-cta" onclick="document.querySelector('[data-section=\\'${id.replace('-list-container', '')}\\']').click();">⚡ Restructure block now</button>
                </div>
              `;
            }
          });
        }, 120);
      }
    });
  }

  // Micro animations
  setupHoverFeedback() {
    document.querySelectorAll(".btn-premium, .btn-glass, .template-card-selector").forEach(el => {
      el.addEventListener("mousedown", () => {
        el.style.transform = "scale(0.96)";
      });
      el.addEventListener("mouseup", () => {
        el.style.transform = "scale(1)";
      });
    });
  }
}

export const premiumEngine = new PremiumUXEngine();
window.premiumEngine = premiumEngine;
