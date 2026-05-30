/* ==========================================================================
   REVBSUS TEMPLATE LIBRARIES - 6 LUXURY DESIGNS
   Renders user resume parameters into precise, elegant document bodies.
   ========================================================================= */

export const resumeTemplates = {
  // 1. MODERN TEMPLATE (High-Contrast Tech/SaaS layout)
  modern: (data, theme) => {
    const accentColor = themeController.getCurrentAccentHex();
    return `
      <div class="tmpl-modern" style="--tmpl-accent: ${accentColor};">
        <header class="tmpl-header" style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid var(--tmpl-accent); padding-bottom: 20px; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 2.8rem; font-weight: 800; color: #111827; letter-spacing: -1.5px; line-height: 1.1; margin: 0;">${data.personal.name || "Alex Sterling"}</h1>
            <p style="font-size: 1.15rem; color: var(--tmpl-accent); font-weight: 600; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px;">${data.personal.title || "Senior Creative Director"}</p>
          </div>
          <div style="font-size: 0.85rem; color: #4b5563; text-align: right; line-height: 1.5;">
            <div>${data.personal.email || "sterling@revbsus.io"}</div>
            <div>${data.personal.phone || "+1 (555) 303-1294"}</div>
            <div>${data.personal.address || "San Francisco, CA"}</div>
            <div>${data.personal.website || "www.sterling-design.io"}</div>
          </div>
        </header>

        <div class="tmpl-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
          <!-- Left Column (Core info) -->
          <div>
            ${data.profile ? `
              <section style="margin-bottom: 28px;">
                <h3 style="font-size: 1.1rem; color: #111827; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px;">Executive Summary</h3>
                <p style="font-size: 0.92rem; color: #374151; line-height: 1.6;">${data.profile}</p>
              </section>
            ` : ''}

            ${data.experience && data.experience.length ? `
              <section style="margin-bottom: 28px;">
                <h3 style="font-size: 1.1rem; color: #111827; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 16px;">Professional Experience</h3>
                ${data.experience.map(exp => `
                  <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                      <h4 style="font-size: 1rem; color: #111827; font-weight: 700;">${exp.role || "Lead Designer"}</h4>
                      <span style="font-size: 0.8rem; font-weight: 600; color: var(--tmpl-accent);">${exp.startDate || "2024"} — ${exp.endDate || "Present"}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #4b5563; margin-bottom: 6px; font-weight: 500;">
                      <span>${exp.company || "Linear Technologies"}</span>
                      <span>${exp.location || "Remote"}</span>
                    </div>
                    <p style="font-size: 0.88rem; color: #374151; line-height: 1.5;">${exp.description || "Spearheaded complex design system initiatives and scaled product aesthetics across multiple visual suites."}</p>
                  </div>
                `).join('')}
              </section>
            ` : ''}

            ${data.projects && data.projects.length ? `
              <section style="margin-bottom: 28px;">
                <h3 style="font-size: 1.1rem; color: #111827; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 16px;">Representative Projects</h3>
                ${data.projects.map(proj => `
                  <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                      <h4 style="font-size: 0.95rem; color: #111827; font-weight: 700;">${proj.title || "Vanguard UI System"}</h4>
                      ${proj.url ? `<span style="font-size: 0.8rem; color: var(--tmpl-accent); font-family: var(--font-mono);">${proj.url}</span>` : ''}
                    </div>
                    <p style="font-size: 0.88rem; color: #374151; line-height: 1.5; margin-bottom: 4px;">${proj.description || "Created and optimized the company design blueprints."}</p>
                    ${proj.techStack ? `<div style="font-size: 0.78rem; font-family: var(--font-mono); color: #6b7280;">Stack: ${proj.techStack}</div>` : ''}
                  </div>
                `).join('')}
              </section>
            ` : ''}
          </div>

          <!-- Right Column (Meta info, Skills, Education) -->
          <div>
            ${data.skills && data.skills.length ? `
              <section style="margin-bottom: 28px;">
                <h3 style="font-size: 1.1rem; color: #111827; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 16px;">Core Competencies</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${data.skills.map(skill => `
                    <span style="font-size: 0.8rem; background: #f3f4f6; color: #111827; font-weight: 500; border-left: 3px solid var(--tmpl-accent); padding: 5px 10px; border-radius: 4px;">
                      ${skill.name || "UI Design"}
                    </span>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            ${data.education && data.education.length ? `
              <section style="margin-bottom: 28px;">
                <h3 style="font-size: 1.1rem; color: #111827; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 16px;">Education</h3>
                ${data.education.map(edu => `
                  <div style="margin-bottom: 16px;">
                    <div style="font-size: 0.82rem; font-weight: 600; color: var(--tmpl-accent); margin-bottom: 2px;">${edu.startDate || "2020"} — ${edu.endDate || "2024"}</div>
                    <h4 style="font-size: 0.92rem; color: #111827; font-weight: 700;">${edu.degree || "M.S. in Interaction Design"}</h4>
                    <p style="font-size: 0.85rem; color: #4b5563;">${edu.school || "Stanford University"}</p>
                    ${edu.description ? `<p style="font-size: 0.8rem; color: #6b7280; margin-top: 4px;">${edu.description}</p>` : ''}
                  </div>
                `).join('')}
              </section>
            ` : ''}

            ${data.languages && data.languages.length ? `
              <section style="margin-bottom: 28px;">
                <h3 style="font-size: 1.1rem; color: #111827; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px;">Languages</h3>
                ${data.languages.map(lang => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: #374151; margin-bottom: 6px;">
                    <span style="font-weight: 600;">${lang.name || "English"}</span>
                    <span style="color: #6b7280;">${lang.proficiency || "Native"}</span>
                  </div>
                `).join('')}
              </section>
            ` : ''}

            ${data.certifications && data.certifications.length ? `
              <section style="margin-bottom: 28px;">
                <h3 style="font-size: 1.1rem; color: #111827; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px;">Certifications</h3>
                ${data.certifications.map(cert => `
                  <div style="margin-bottom: 10px;">
                    <div style="font-size: 0.88rem; font-weight: 700; color: #111827;">${cert.title || ""}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #6b7280;">
                      <span>${cert.issuer || ""}</span>
                      <span>${cert.date || ""}</span>
                    </div>
                  </div>
                `).join('')}
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // 2. EXECUTIVE TEMPLATE (Prestigious, Centered, Serif Typography)
  executive: (data, theme) => {
    return `
      <div class="tmpl-executive" style="text-align: center; color: #1c1917;">
        <header style="margin-bottom: 32px; border-bottom: 1px solid #d6d3d1; padding-bottom: 24px;">
          <h1 style="font-family: 'Playfair Display', serif; font-size: 2.6rem; font-weight: 700; color: #1c1917; margin-bottom: 8px;">${data.personal.name || "Charles Windsor"}</h1>
          <p style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 2px; color: #78716c; font-weight: 600; margin-bottom: 12px;">${data.personal.title || "Chief Operating Officer"}</p>
          <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; font-size: 0.82rem; color: #44403c;">
            <span>${data.personal.email || "charles@alliance.org"}</span>
            <span>•</span>
            <span>${data.personal.phone || "+1 (555) 700-1192"}</span>
            <span>•</span>
            <span>${data.personal.address || "New York, NY"}</span>
            <span>•</span>
            <span>${data.personal.website || "www.charles-windsor.org"}</span>
          </div>
        </header>

        ${data.profile ? `
          <section style="margin-bottom: 32px; text-align: justify;">
            <p style="font-size: 0.95rem; line-height: 1.7; color: #292524; font-style: italic; max-width: 90%; margin: 0 auto;">"${data.profile}"</p>
          </section>
        ` : ''}

        <div style="text-align: left; max-width: 90%; margin: 0 auto;">
          ${data.experience && data.experience.length ? `
            <section style="margin-bottom: 32px;">
              <h2 style="font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px double #d6d3d1; padding-bottom: 6px; margin-bottom: 18px; color: #1c1917;">Strategic Career Milestones</h2>
              ${data.experience.map(exp => `
                <div style="margin-bottom: 24px;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                    <span style="font-size: 1.05rem; font-weight: 700; color: #1c1917;">${exp.role || "Executive Vice President"}</span>
                    <span style="font-size: 0.85rem; font-family: var(--font-mono); color: #78716c;">${exp.startDate || "2020"} — ${exp.endDate || "Present"}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: #57534e; margin-bottom: 8px; font-weight: 550; font-style: italic;">
                    <span>${exp.company || "Atlas Financial Group"}</span>
                    <span>${exp.location || "New York"}</span>
                  </div>
                  <p style="font-size: 0.9rem; color: #292524; line-height: 1.6;">${exp.description || "Pioneered operational re-architecture, improving delivery velocities by 35% and mitigating over $2.5MM in yearly infrastructure deficits."}</p>
                </div>
              `).join('')}
            </section>
          ` : ''}

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 24px;">
            <div>
              ${data.education && data.education.length ? `
                <section style="margin-bottom: 32px;">
                  <h2 style="font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px double #d6d3d1; padding-bottom: 6px; margin-bottom: 18px; color: #1c1917;">Academic Pedigree</h2>
                  ${data.education.map(edu => `
                    <div style="margin-bottom: 16px;">
                      <h4 style="font-size: 0.95rem; color: #1c1917; font-weight: 700;">${edu.degree || "M.B.A. in Finance"}</h4>
                      <p style="font-size: 0.88rem; color: #57534e;">${edu.school || "Columbia Business School"} <span style="float: right;">${edu.endDate || "2020"}</span></p>
                    </div>
                  `).join('')}
                </section>
              ` : ''}
            </div>

            <div>
              ${data.skills && data.skills.length ? `
                <section style="margin-bottom: 24px;">
                  <h2 style="font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px double #d6d3d1; padding-bottom: 6px; margin-bottom: 18px; color: #1c1917;">Leadership Domains</h2>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${data.skills.map(skill => `
                      <span style="font-size: 0.85rem; color: #292524; font-weight: 500;">• ${skill.name || "Strategic Planning"}</span>
                    `).join('')}
                  </div>
                </section>
              ` : ''}

              ${data.languages && data.languages.length ? `
                <section style="margin-bottom: 24px;">
                  <h2 style="font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px double #d6d3d1; padding-bottom: 6px; margin-bottom: 12px; color: #1c1917;">Languages</h2>
                  <div style="font-size: 0.88rem; color: #44403c; line-height: 1.5;">
                    ${data.languages.map(lang => `
                      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-weight: 600;">${lang.name}</span>
                        <span style="color: #78716c;">${lang.proficiency}</span>
                      </div>
                    `).join('')}
                  </div>
                </section>
              ` : ''}

              ${data.certifications && data.certifications.length ? `
                <section>
                  <h2 style="font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px double #d6d3d1; padding-bottom: 6px; margin-bottom: 12px; color: #1c1917;">Certifications</h2>
                  <div style="font-size: 0.88rem; color: #44403c; line-height: 1.5;">
                    ${data.certifications.map(cert => `
                      <div style="margin-bottom: 6px;">
                        <div style="font-weight: 600;">${cert.title}</div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #78716c;">
                          <span>${cert.issuer}</span>
                          <span>${cert.date}</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </section>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 3. ATS MINIMAL TEMPLATE (No Colors, Strict, Black & White, Highly Machine Readable)
  ats: (data, theme) => {
    return `
      <div class="tmpl-ats" style="font-family: Arial, sans-serif; color: #000000; line-height: 1.4; font-size: 10pt;">
        <div style="text-align: center; margin-bottom: 18px;">
          <h1 style="font-size: 18pt; font-weight: bold; margin: 0 0 4px 0; text-transform: uppercase;">${data.personal.name || "Samantha Vance"}</h1>
          <div style="font-size: 9.5pt; margin-bottom: 4px;">
            ${data.personal.address || "Austin, TX"} | ${data.personal.phone || "(512) 555-8392"} | ${data.personal.email || "samantha.vance@techmail.com"}
          </div>
          ${data.personal.website ? `<div style="font-size: 9.5pt;">${data.personal.website}</div>` : ''}
        </div>

        ${data.profile ? `
          <div style="margin-bottom: 16px;">
            <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000000; font-size: 11pt; margin-bottom: 6px;">Professional Summary</div>
            <p style="margin: 0; text-align: justify;">${data.profile}</p>
          </div>
        ` : ''}

        ${data.experience && data.experience.length ? `
          <div style="margin-bottom: 16px;">
            <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000000; font-size: 11pt; margin-bottom: 8px;">Professional Experience</div>
            ${data.experience.map(exp => `
              <div style="margin-bottom: 12px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 2px;">
                  <tr>
                    <td style="font-weight: bold; text-align: left;">${exp.company || "Amazon Web Services"}</td>
                    <td style="text-align: right; font-weight: bold;">${exp.startDate || "2021"} - ${exp.endDate || "Present"}</td>
                  </tr>
                  <tr>
                    <td style="font-style: italic; text-align: left;">${exp.role || "Cloud Infrastructure Engineer"}</td>
                    <td style="text-align: right; font-style: italic;">${exp.location || "Seattle, WA"}</td>
                  </tr>
                </table>
                <p style="margin: 0 0 0 12px; text-align: justify;">${exp.description || "Supported migration pipelines and increased stack delivery by 20% using AWS tooling and Terraform scripts."}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.projects && data.projects.length ? `
          <div style="margin-bottom: 16px;">
            <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000000; font-size: 11pt; margin-bottom: 8px;">Technical Projects</div>
            ${data.projects.map(proj => `
              <div style="margin-bottom: 8px;">
                <div style="font-weight: bold;">${proj.title || "Orion Pipeline Tool"} ${proj.url ? `(${proj.url})` : ''}</div>
                <p style="margin: 0 0 0 12px;">${proj.description || "Constructed responsive build workflows."} ${proj.techStack ? `Technologies: ${proj.techStack}` : ''}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            ${data.education && data.education.length ? `
              <td style="vertical-align: top; width: 50%; padding-right: 15px;">
                <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000000; font-size: 11pt; margin-bottom: 6px;">Education</div>
                ${data.education.map(edu => `
                  <div style="margin-bottom: 8px;">
                    <div style="font-weight: bold;">${edu.degree || "B.S. Computer Science"}</div>
                    <div>${edu.school || "University of Texas at Austin"}</div>
                    <div style="font-style: italic; font-size: 9pt;">Graduated: ${edu.endDate || "2021"}</div>
                  </div>
                `).join('')}
              </td>
            ` : ''}

            ${data.skills && data.skills.length ? `
              <td style="vertical-align: top; width: 50%;">
                <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000000; font-size: 11pt; margin-bottom: 6px;">Technical Skills</div>
                <p style="margin: 0; line-height: 1.5;">
                  ${data.skills.map(s => s.name || "").join(', ')}
                </p>
              </td>
            ` : ''}
          </tr>
        </table>

        ${(data.languages && data.languages.length) || (data.certifications && data.certifications.length) ? `
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              ${data.languages && data.languages.length ? `
                <td style="vertical-align: top; width: 50%; padding-right: 15px;">
                  <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000000; font-size: 11pt; margin-bottom: 6px;">Languages</div>
                  <p style="margin: 0; line-height: 1.5;">
                    ${data.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}
                  </p>
                </td>
              ` : ''}

              ${data.certifications && data.certifications.length ? `
                <td style="vertical-align: top; width: 50%;">
                  <div style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000000; font-size: 11pt; margin-bottom: 6px;">Certifications</div>
                  ${data.certifications.map(c => `
                    <div style="margin-bottom: 4px;">
                      <span style="font-weight: bold;">${c.title}</span> — <span>${c.issuer}</span> (${c.date})
                    </div>
                  `).join('')}
                </td>
              ` : ''}
            </tr>
          </table>
        ` : ''}
      </div>
    `;
  },

  // 4. MINIMAL TEMPLATE (Fine margins, elegant structural asymmetry)
  minimal: (data, theme) => {
    return `
      <div class="tmpl-minimal" style="color: #374151; font-family: 'Inter', sans-serif;">
        <div style="display: flex; gap: 40px;">
          <!-- Left Column: Name & details -->
          <div style="width: 30%; border-right: 1px solid #e5e7eb; padding-right: 30px;">
            <h1 style="font-size: 2.2rem; font-weight: 700; color: #111827; letter-spacing: -1px; margin-bottom: 10px;">${data.personal.name || "Kerr Ryan"}</h1>
            <p style="font-size: 0.95rem; color: #9ca3af; margin-bottom: 24px;">${data.personal.title || "Staff Architect"}</p>
            
            <div style="font-size: 0.8rem; color: #6b7280; display: flex; flex-direction: column; gap: 8px; margin-top: 30px;">
              <div>sterling@office.me</div>
              <div>+11 80-2394a</div>
              <div>Berlin, DE</div>
              <div>${data.personal.website || ""}</div>
            </div>

            ${data.languages && data.languages.length ? `
              <div style="margin-top: 30px;">
                <h3 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">Languages</h3>
                ${data.languages.map(lang => `
                  <div style="font-size: 0.82rem; color: #4b5563; display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-weight: 600;">${lang.name}</span>
                    <span>${lang.proficiency}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${data.certifications && data.certifications.length ? `
              <div style="margin-top: 30px;">
                <h3 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; color: #9ca3af; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">Certifications</h3>
                ${data.certifications.map(cert => `
                  <div style="font-size: 0.82rem; color: #4b5563; margin-bottom: 8px; line-height: 1.3;">
                    <span style="font-weight: 600; display: block; color: #111827;">${cert.title}</span>
                    <span>${cert.issuer} (${cert.date})</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Right Column: Exp & details -->
          <div style="flex: 1;">
            ${data.profile ? `<p style="font-size: 0.9rem; font-style: italic; line-height: 1.6; margin-bottom: 24px; color: #4b5563;">${data.profile}</p>` : ''}

            ${data.experience && data.experience.length ? `
              <div style="margin-bottom: 24px;">
                <h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; font-weight: 700; margin-bottom: 16px;">Core Experience</h3>
                ${data.experience.map(exp => `
                  <div style="margin-bottom: 20px;">
                    <div style="font-size: 0.8rem; color: #9ca3af; font-family: var(--font-mono); margin-bottom: 2px;">${exp.startDate || "2020"} — ${exp.endDate || "Present"}</div>
                    <div style="font-size: 0.95rem; font-weight: 600; color: #111827;">${exp.role || "Lead Architect"} — ${exp.company || "Studio Berlin"}</div>
                    <p style="font-size: 0.85rem; color: #4b5563; line-height: 1.5; margin-top: 4px;">${exp.description || "Drafted complex CAD models and secured green permits."}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // 5. CREATIVE TEMPLATE (Futuristic, Neo-Gothic, Space Grotesk Font Accent)
  creative: (data, theme) => {
    const accentColor = themeController.getCurrentAccentHex();
    return `
      <div class="tmpl-creative" style="--tmpl-accent: ${accentColor}; font-family: 'Space Grotesk', sans-serif; color: #09090b;">
        <div style="background: var(--tmpl-accent); color: white; margin: -48px -48px 32px -48px; padding: 48px; border-bottom: 6px solid #000000;">
          <h1 style="font-size: 3.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: -2px; margin: 0; line-height: 1;">${data.personal.name || "Sasha Grey"}</h1>
          <p style="font-size: 1.3rem; font-weight: 500; font-family: var(--font-mono); text-transform: uppercase; color: rgba(255,255,255,0.85); margin-top: 8px;">${data.personal.title || "AI Systems Engineer"}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 24px; font-size: 0.85rem; margin-top: 24px; font-family: var(--font-mono);">
            <span>EMAIL: ${data.personal.email || "sasha@cyber.org"}</span>
            <span>CELL: ${data.personal.phone || "+1-800-NEON"}</span>
            <span>COORD: ${data.personal.address || "Neon District"}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.8fr 1.2fr; gap: 36px;">
          <div>
            ${data.profile ? `
              <section style="margin-bottom: 24px; background: #fafafa; border: 2px solid #000; padding: 20px; border-radius: 8px;">
                <h3 style="font-size: 1rem; font-weight: 700; text-transform: uppercase; margin-bottom: 10px;">Transmission Log</h3>
                <p style="font-size: 0.9rem; line-height: 1.6;">${data.profile}</p>
              </section>
            ` : ''}

            ${data.experience && data.experience.length ? `
              <section style="margin-bottom: 30px;">
                <h3 style="font-size: 1.15rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 4px solid #000000; padding-bottom: 4px; margin-bottom: 16px;">System Logs (Work Loop)</h3>
                ${data.experience.map(exp => `
                  <div style="margin-bottom: 20px; border-left: 3px solid var(--tmpl-accent); padding-left: 16px;">
                    <h4 style="font-size: 1rem; font-weight: 700;">${exp.role || "AI Engineer"} @ ${exp.company || "Synthetix"}</h4>
                    <div style="font-size: 0.8rem; font-family: var(--font-mono); color: #555; margin-bottom: 6px;">[${exp.startDate || "2020"} // ${exp.endDate || "Present"}]</div>
                    <p style="font-size: 0.88rem; line-height: 1.5;">${exp.description || "Optimizing model inference loops."}</p>
                  </div>
                `).join('')}
              </section>
            ` : ''}
          </div>

          <div>
            ${data.skills && data.skills.length ? `
              <section style="margin-bottom: 30px; background: #fafafa; border: 2px solid #000; padding: 20px; border-radius: 8px;">
                <h3 style="font-size: 1rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; font-family: var(--font-mono);">Matrix Arsenal</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${data.skills.map(s => `
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-family: var(--font-mono);">
                      <span>${s.name || "Cyber Defense"}</span>
                      <span style="color: var(--tmpl-accent);">[COMPLETE]</span>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            ${data.languages && data.languages.length ? `
              <section style="margin-bottom: 30px; background: #fafafa; border: 2px solid #000; padding: 20px; border-radius: 8px;">
                <h3 style="font-size: 1rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; font-family: var(--font-mono);">Languages</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${data.languages.map(l => `
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-family: var(--font-mono);">
                      <span>${l.name}</span>
                      <span style="color: var(--tmpl-accent); font-weight: 600;">${l.proficiency}</span>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            ${data.certifications && data.certifications.length ? `
              <section style="margin-bottom: 30px; background: #fafafa; border: 2px solid #000; padding: 20px; border-radius: 8px;">
                <h3 style="font-size: 1rem; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; font-family: var(--font-mono);">Credentials</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  ${data.certifications.map(c => `
                    <div style="font-size: 0.85rem; font-family: var(--font-mono); line-height: 1.35;">
                      <div style="font-weight: bold; color: var(--tmpl-accent);">${c.title}</div>
                      <div style="display: flex; justify-content: space-between; color: #555; font-size: 0.78rem;">
                        <span>${c.issuer}</span>
                        <span>[${c.date}]</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // 6. CORPORATE TEMPLATE (Classic Times Serif layout, high formal alignment)
  corporate: (data, theme) => {
    return `
      <div class="tmpl-corporate" style="font-family: 'Times New Roman', Times, serif; color: #111111; line-height: 1.5; font-size: 10.5pt;">
        <div style="text-align: center; border-bottom: 1px solid #111111; padding-bottom: 12px; margin-bottom: 18px;">
          <h1 style="font-size: 22pt; font-family: 'Times New Roman', Times, serif; font-weight: bold; margin: 0 0 6px 0;">${data.personal.name || "Jonathan J. Mercer"}</h1>
          <div style="font-size: 10pt; line-height: 1.4;">
            ${data.personal.address || "Chicago, IL"} <br>
            Phone: ${data.personal.phone || "(312) 555-0392"} | Email: ${data.personal.email || "jonathan.mercer@corp.com"}
          </div>
        </div>

        ${data.profile ? `
          <div style="margin-bottom: 18px;">
            <p style="font-size: 10.5pt; text-align: justify; margin: 0; font-style: italic;">${data.profile}</p>
          </div>
        ` : ''}

        ${data.experience && data.experience.length ? `
          <div style="margin-bottom: 18px;">
            <h3 style="font-size: 12pt; font-weight: bold; border-bottom: 1px solid #111111; padding-bottom: 2px; margin: 0 0 10px 0; text-transform: uppercase;">Professional Practice</h3>
            ${data.experience.map(exp => `
              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                  <span>${exp.company || "Mercer Consulting LLC"}</span>
                  <span>${exp.startDate || "2019"} – ${exp.endDate || "Present"}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-style: italic; margin-bottom: 4px;">
                  <span>${exp.role || "Senior Principal Advisor"}</span>
                  <span>${exp.location || "Chicago"}</span>
                </div>
                <p style="text-align: justify; margin: 0; font-size: 10pt;">${exp.description || "Managed organizational client consultations representing multi-billion assets."}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.education && data.education.length ? `
          <div style="margin-bottom: 18px;">
            <h3 style="font-size: 12pt; font-weight: bold; border-bottom: 1px solid #111111; padding-bottom: 2px; margin: 0 0 10px 0; text-transform: uppercase;">Educational Qualifications</h3>
            ${data.education.map(edu => `
              <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                  <span>${edu.school || "University of Chicago"}</span>
                  <span>Graduated: ${edu.endDate || "2019"}</span>
                </div>
                <div style="font-style: italic;">${edu.degree || "M.S. Economics"}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.certifications && data.certifications.length ? `
          <div style="margin-bottom: 18px;">
            <h3 style="font-size: 12pt; font-weight: bold; border-bottom: 1px solid #111111; padding-bottom: 2px; margin: 0 0 10px 0; text-transform: uppercase;">Certifications & Organizations</h3>
            ${data.certifications.map(cert => `
              <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span><span style="font-weight: bold;">${cert.title}</span> — ${cert.issuer}</span>
                <span style="font-style: italic;">${cert.date}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.languages && data.languages.length ? `
          <div style="margin-bottom: 18px;">
            <h3 style="font-size: 12pt; font-weight: bold; border-bottom: 1px solid #111111; padding-bottom: 2px; margin: 0 0 10px 0; text-transform: uppercase;">Languages</h3>
            <p style="margin: 0;">
              ${data.languages.map(l => `<span style="font-weight: bold;">${l.name}</span> (${l.proficiency})`).join('  |  ')}
            </p>
          </div>
        ` : ''}
      </div>
    `;
  }
};
