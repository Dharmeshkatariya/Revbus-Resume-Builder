/* ==========================================================================
   REVBSUS MASTER CONTROL COORDINATOR
   Handles global assets, 3D Canvas, Preloader transitions, Modals, and Accordions.
   ========================================================================= */

import { themeController } from "./theme.js";
import { premiumEngine } from "./premium.js";
import "./dashboard.js";

class RevbsusMasterApp {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
  }

  init() {
    this.runIntroPreloader();
    this.initCanvasBackground();
    this.setupSmoothScroll();
    this.setupScrollIndicator();
    this.setupFAQAccordion();
    this.setupAuthentications();
    this.setupMagneticButtons();
    this.setupMouseParallax();
    this.setupInteractiveDrawer();
    
    // Bind resize
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  // 1. Luxury Micro Preloader percentage count pipeline
  runIntroPreloader() {
    const bar = document.getElementById("loader-fill-bar");
    const label = document.getElementById("loader-percent");
    const logo = document.getElementById("loader-logo-title");
    const mainWrap = document.getElementById("preloader-master");
    
    if (!label || !logo || !bar || !mainWrap) {
      // If elements are missing inside dashboard view, safely bypass preloader
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Trigger elegant logo float scaling
        logo.style.opacity = "1";
        logo.style.transform = "scale(1.02)";
        
        setTimeout(() => {
          mainWrap.classList.add("preloader-loaded");
          // Fade in main elements
          document.body.classList.remove("preloader-active");
        }, 800);
      }
      bar.style.width = `${progress}%`;
      label.innerText = `${progress}%`;
    }, 45);
  }

  // 2. Beautiful animated particle node web fallback in canvas
  initCanvasBackground() {
    this.canvas = document.getElementById("three-bg-canvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();

    // Create particles
    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 1,
        color: i % 2 === 0 ? "rgba(139, 92, 246, 0.45)" : "rgba(56, 189, 248, 0.45)",
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    // Register mouse tracker
    window.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.animateParticles();
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  animateParticles() {
    if (!this.ctx || !this.canvas) return;

    // Clear frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render nodes
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap boundaries
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Draw particle circle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      // Simple mouse reactive gravity drag
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(this.mouseX, this.mouseY);
        // Fade lines based on proximity
        this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`;
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      }

      // Chain adjacent particles
      for (let j = i + 1; j < len; j++) {
        const p2 = this.particles[j];
        const dx2 = p.x - p2.x;
        const dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * (1 - dist2 / 100)})`;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animateParticles());
  }

  // 3. Page Top scroll progress bar filled
  setupScrollIndicator() {
    window.addEventListener("scroll", () => {
      const bar = document.getElementById("top-loading-progress");
      if (!bar) return;

      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / totalH) * 100;
      bar.style.width = `${scrolled}%`;
    });
  }

  // 4. Smooth Anchor-links Scrolling fallbacks
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }

  // 5. Classic Interactive FAQ Accordions
  setupFAQAccordion() {
    document.addEventListener("click", (e) => {
      const q = e.target.closest(".faq-question");
      if (q) {
        const item = q.closest(".faq-item");
        const answer = item.querySelector(".faq-answer");
        
        // Hide others optionally, or toggle single
        const isActive = item.classList.contains("accordion-active");
        
        // reset others
        document.querySelectorAll(".faq-item").forEach(other => {
          other.classList.remove("accordion-active");
          const ans = other.querySelector(".faq-answer");
          if (ans) ans.style.maxHeight = "0";
        });

        if (!isActive) {
          item.classList.add("accordion-active");
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        } else {
          item.classList.remove("accordion-active");
          answer.style.maxHeight = "0";
        }
      }
    });
  }

  // 6. Complete Modals login, signup, forgot-password triggers
  setupAuthentications() {
    // Open action bindings
    document.addEventListener("click", (e) => {
      const loginTrigger = e.target.closest("#trigger-login-modal, .trigger-login");
      if (loginTrigger) {
        e.preventDefault();
        const modal = document.getElementById("auth-login-modal");
        if (modal) modal.classList.add("open");
      }

      const signupTrigger = e.target.closest("#trigger-signup-modal, .trigger-signup");
      if (signupTrigger) {
        e.preventDefault();
        const modal = document.getElementById("auth-signup-modal");
        if (modal) modal.classList.add("open");
      }

      const closeTrigger = e.target.closest(".auth-close, .auth-overlay");
      if (closeTrigger) {
        document.querySelectorAll(".auth-modal").forEach(modal => modal.classList.remove("open"));
      }
    });

    // Handle Forms Mock submissions
    const loginForm = document.getElementById("auth-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Redirect to dashboard layout directly
        this.enterApplicationWorkspace();
      });
    }

    const signupForm = document.getElementById("auth-signup-form");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.enterApplicationWorkspace();
      });
    }
  }

  enterApplicationWorkspace() {
    // Closes standard landing and slides open actual high-performance dashboard layout
    document.querySelectorAll(".auth-modal").forEach(m => m.classList.remove("open"));
    
    // Smooth transition page out
    document.body.classList.add("page-transition-active");
    setTimeout(() => {
      const landing = document.getElementById("landing-universe-page");
      const appWS = document.getElementById("application-dashboard-canvas");
      
      if (landing && appWS) {
        landing.style.display = "none";
        appWS.style.display = "flex";
        
        // Render statistics visualizer
        const analyticsNav = document.querySelector(".sidebar-item[data-target='workspace-builder-panel']");
        if (analyticsNav) analyticsNav.click();
      }
      
      // Release page transition overlay
      setTimeout(() => {
        document.body.classList.remove("page-transition-active");
      }, 500);

    }, 600);
  }

  // 7. Interactive Magnetic CTA effects
  setupMagneticButtons() {
    const magneticItems = document.querySelectorAll(".magnetic-btn");
    magneticItems.forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const bounds = btn.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left - bounds.width / 2;
        const mouseY = e.clientY - bounds.top - bounds.height / 2;
        
        // Shift button position magnetically towards pointer
        btn.style.transform = `translate(${mouseX * 0.35}px, ${mouseY * 0.35}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        // Return to normal
        btn.style.transform = `translate(0px, 0px)`;
      });
    });
  }

  // 8. 3D Hover tilt parallax on floating resume items on landing
  setupMouseParallax() {
    const tiltContainers = document.querySelectorAll(".card-tilt-wrap");
    tiltContainers.forEach(wrap => {
      const card = wrap.querySelector(".card-tilt-element");
      if (!card) return;

      wrap.addEventListener("mousemove", (e) => {
        const bounds = wrap.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;
        
        const rY = ((mouseX / bounds.width) - 0.5) * 15; // rotate y
        const rX = (((mouseY / bounds.height) - 0.5) * -15); // rotate x
        
        card.style.transform = `rotateY(${rY}deg) rotateX(${rX}deg) scale(1.02)`;
      });

      wrap.addEventListener("mouseleave", () => {
        card.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
      });
    });
  }

  // 9. Floating Theme customization drawer panel
  setupInteractiveDrawer() {
    const customizerBtn = document.querySelector(".floating-customizer-btn");
    const drawer = document.getElementById("theme-settings-panel");
    const backdrop = document.getElementById("theme-customizer-backdrop");
    const closeBtn = document.getElementById("close-customizer-btn");

    if (customizerBtn && drawer && backdrop) {
      customizerBtn.addEventListener("click", () => {
        // Sync active state UI immediately upon opening
        const conf = themeController.config;
        
        const sliderFontSize = document.getElementById("slider-font-size");
        const labelFontSize = document.getElementById("label-font-size");
        const sliderMargins = document.getElementById("slider-margins");
        const labelMargins = document.getElementById("label-margins");
        const sliderLineSpacing = document.getElementById("slider-line-spacing");
        const labelLineSpacing = document.getElementById("label-line-spacing");

        if (sliderFontSize && labelFontSize) {
          sliderFontSize.value = conf.fontSize || 14;
          labelFontSize.innerText = `${conf.fontSize || 14}px`;
        }
        if (sliderMargins && labelMargins) {
          sliderMargins.value = conf.margins || 40;
          labelMargins.innerText = `${conf.margins || 40}px`;
        }
        if (sliderLineSpacing && labelLineSpacing) {
          sliderLineSpacing.value = conf.lineSpacing || 1.5;
          labelLineSpacing.innerText = parseFloat(conf.lineSpacing || 1.5).toFixed(2);
        }

        const shadeButtons = document.querySelectorAll(".paper-shade-btn");
        shadeButtons.forEach(btn => {
          if (btn.getAttribute("data-shade") === conf.paperShade) {
            btn.classList.add("active");
            btn.style.outline = "2px solid var(--accent)";
          } else {
            btn.classList.remove("active");
            btn.style.outline = "none";
          }
        });

        drawer.classList.add("open");
        backdrop.classList.add("open");
      });

      backdrop.addEventListener("click", () => {
        drawer.classList.remove("open");
        backdrop.classList.remove("open");
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          drawer.classList.remove("open");
          backdrop.classList.remove("open");
        });
      }
    }

    // Connect Sliders listeners
    const sliderFontSize = document.getElementById("slider-font-size");
    const labelFontSize = document.getElementById("label-font-size");
    const sliderMargins = document.getElementById("slider-margins");
    const labelMargins = document.getElementById("label-margins");
    const sliderLineSpacing = document.getElementById("slider-line-spacing");
    const labelLineSpacing = document.getElementById("label-line-spacing");

    if (sliderFontSize && labelFontSize) {
      sliderFontSize.addEventListener("input", (e) => {
        const val = e.target.value;
        labelFontSize.innerText = `${val}px`;
        themeController.setFontSize(val);
        const builder = window.workspaceBuilder || null;
        if (builder) builder.updatePreview();
      });
    }

    if (sliderMargins && labelMargins) {
      sliderMargins.addEventListener("input", (e) => {
        const val = e.target.value;
        labelMargins.innerText = `${val}px`;
        themeController.setMargins(val);
        const builder = window.workspaceBuilder || null;
        if (builder) builder.updatePreview();
      });
    }

    if (sliderLineSpacing && labelLineSpacing) {
      sliderLineSpacing.addEventListener("input", (e) => {
        const val = e.target.value;
        labelLineSpacing.innerText = parseFloat(val).toFixed(2);
        themeController.setLineSpacing(val);
        const builder = window.workspaceBuilder || null;
        if (builder) builder.updatePreview();
      });
    }

    // Connect preset dots clicks to theme engine
    document.addEventListener("click", (e) => {
      // Paper shade buttons click
      const shadeBtn = e.target.closest(".paper-shade-btn");
      if (shadeBtn) {
        const shade = shadeBtn.getAttribute("data-shade");
        const code = shadeBtn.getAttribute("data-code");
        themeController.setPaperShade(shade, code);

        document.querySelectorAll(".paper-shade-btn").forEach(b => {
          b.classList.remove("active");
          b.style.outline = "none";
        });
        shadeBtn.classList.add("active");
        shadeBtn.style.outline = "2px solid var(--accent)";

        const builder = window.workspaceBuilder || null;
        if (builder) builder.updatePreview();
      }

      const dot = e.target.closest(".preset-dot");
      if (dot) {
        const themeKey = dot.getAttribute("data-preset");
        themeController.setPreset(themeKey);
        
        // Highlight dot
        document.querySelectorAll(".preset-dot").forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        
        // Trigger live redraw to preview wrapper A4 paper sheet directly
        const builder = window.workspaceBuilder || null;
        if (builder) builder.updatePreview();
      }

      // Theme font family changer
      const fontCard = e.target.closest("[data-set-font]");
      if (fontCard) {
        const font = fontCard.getAttribute("data-set-font");
        themeController.setFont(font);
        
        document.querySelectorAll("[data-set-font]").forEach(f => f.style.borderColor = "var(--border-color)");
        fontCard.style.borderColor = "var(--accent)";
        
        const builder = window.workspaceBuilder || null;
        if (builder) builder.updatePreview();
      }

      // Theme border radius changer
      const radCard = e.target.closest("[data-set-radius]");
      if (radCard) {
        const rad = radCard.getAttribute("data-set-radius");
        themeController.setRadius(rad);

        document.querySelectorAll("[data-set-radius]").forEach(r => r.style.borderColor = "var(--border-color)");
        radCard.style.borderColor = "var(--accent)";

        const builder = window.workspaceBuilder || null;
        if (builder) builder.updatePreview();
      }

      // Header Theme Toggle button direct click
      const hdrToggle = e.target.closest(".theme-mode-btn");
      if (hdrToggle) {
        themeController.toggleMode();
        
        // Live sync preview
        const builder = window.workspaceBuilder || null;
        if (builder) builder.updatePreview();
      }
    });
  }
}

// Instantiate master runner
const app = new RevbsusMasterApp();
document.addEventListener("DOMContentLoaded", () => {
  app.init();
  premiumEngine.init();
});
