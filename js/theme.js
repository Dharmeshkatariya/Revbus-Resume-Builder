/* ==========================================================================
   REVBSUS THEME CONTROLLER
   Manages Presets, Light/Dark Modes, custom radius, and font pairings.
   ========================================================================= */

export const DefaultThemeConfig = {
  preset: "midnight-black",
  mode: "dark",
  font: "inter",
  radius: "elegant",
  subtleShadows: false,
  fontSize: 14,
  margins: 40,
  lineSpacing: 1.5,
  paperShade: "pure-white",
  paperShadeCode: "#ffffff"
};

class ThemeEngine {
  constructor() {
    this.config = { ...DefaultThemeConfig };
    this.subscribers = [];
  }

  init() {
    // Load from local storage
    const savedConfig = localStorage.getItem("revbsus_theme_config");
    if (savedConfig) {
      try {
        this.config = { ...DefaultThemeConfig, ...JSON.parse(savedConfig) };
      } catch (e) {
        console.error("Theme config parsing failed, loading defaults", e);
      }
    } else {
      // Check for system preference
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      this.config.mode = prefersLight ? "light" : "dark";
    }

    this.apply();
    this.setupListeners();
  }

  // Subscribe to theme updates (e.g. for canvas dynamic color re-rendering)
  subscribe(callback) {
    this.subscribers.push(callback);
    // instant callback with current state
    callback(this.config);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.config));
  }

  setPreset(preset) {
    this.config.preset = preset;
    this.apply();
    this.save();
    this.notify();
  }

  setMode(mode) {
    if (mode === "system") {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      this.config.mode = prefersLight ? "light" : "dark";
    } else {
      this.config.mode = mode;
    }
    this.apply();
    this.save();
    this.notify();
  }

  toggleMode() {
    const nextMode = this.config.mode === "dark" ? "light" : "dark";
    this.setMode(nextMode);
  }

  setFont(font) {
    this.config.font = font;
    this.apply();
    this.save();
    this.notify();
  }

  setRadius(radius) {
    this.config.radius = radius;
    this.apply();
    this.save();
    this.notify();
  }

  setSubtleShadows(bool) {
    this.config.subtleShadows = !!bool;
    this.apply();
    this.save();
    this.notify();
  }

  setFontSize(size) {
    this.config.fontSize = parseInt(size);
    this.apply();
    this.save();
    this.notify();
  }

  setMargins(margins) {
    this.config.margins = parseInt(margins);
    this.apply();
    this.save();
    this.notify();
  }

  setLineSpacing(spacing) {
    this.config.lineSpacing = parseFloat(spacing);
    this.apply();
    this.save();
    this.notify();
  }

  setPaperShade(shade, code) {
    this.config.paperShade = shade;
    this.config.paperShadeCode = code;
    this.apply();
    this.save();
    this.notify();
  }

  apply() {
    const doc = document.documentElement;
    
    // Apply Preset HTML Attribute
    doc.setAttribute("data-theme-preset", this.config.preset);
    
    // Apply Mode HTML Attribute
    doc.setAttribute("data-theme-mode", this.config.mode);

    // Apply Font Pairing Attribute
    doc.setAttribute("data-theme-font", this.config.font);

    // Apply Radius Mode
    doc.setAttribute("data-theme-radius", this.config.radius);

    // Set subtle shadows bool
    doc.setAttribute("data-theme-subtle-shadows", this.config.subtleShadows.toString());

    // Update index.html theme toggle icons if present
    const toggleBtn = document.querySelector(".theme-mode-btn i");
    if (toggleBtn) {
      if (this.config.mode === "light") {
        toggleBtn.className = "lucide-moon";
        if (window.lucide) window.lucide.createIcons();
      } else {
        toggleBtn.className = "lucide-sun";
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }

  save() {
    localStorage.setItem("revbsus_theme_config", JSON.stringify(this.config));
  }

  setupListeners() {
    // Listen for OS scheme updates
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
      const savedConfig = localStorage.getItem("revbsus_theme_config");
      // Only auto-update if user hasn't explicitly locking mode manually
      if (!savedConfig || !JSON.parse(savedConfig).mode) {
        this.setMode(e.matches ? "light" : "dark");
      }
    });
  }

  // Helper helper to get current accent hex (useful for Chart.js)
  getCurrentAccentHex() {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue('--accent').trim() || "#8b5cf6";
  }
}

export const themeController = new ThemeEngine();
window.themeController = themeController;
// Fire dynamic initialization as module loads
themeController.init();
