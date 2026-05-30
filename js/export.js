/* ==========================================================================
   REVBSUS EXPORT CENTRE ENGINE
   Implements multi-format exports: PDF, TXT, JSON, HTML, and Word Doc simulation.
   ========================================================================= */

export const exporter = {
  // 1. PDF Export via high-fidelity window.print or html2pdf simulation
  exportPDF: (elementTitle = "resume-document") => {
    // Elegant client-side PDF export
    // We isolate the target preview leaf, trigger print mode constraints, or print directly
    const printContent = document.getElementById("document-paper-sheet");
    if (!printContent) {
      alert("No active document preview found!");
      return;
    }

    // Try to trigger modern native PDF window.print directly on a cloned isolated element
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popups are blocked. Please enable popups to trigger print/PDF generation.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${elementTitle}</title>
          <style>
            body {
              background: #ffffff !important;
              color: #111111 !important;
              font-family: inherit;
              padding: 40px;
              margin: 0;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
          <!-- Load standard premium Display Fonts if needed -->
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&display=swap">
        </head>
        <body onload="window.print();window.close();">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
  },

  // 2. Export TXT
  exportTXT: (data, fileName = "resume.txt") => {
    let content = `==================================================
${(data.personal.name || "Alex Sterling").toUpperCase()}
${data.personal.title || "Creative Design Professional"}
==================================================

CONTACT DETAILS
--------------------------------------------------
Email:    ${data.personal.email || "sterling@revbsus.io"}
Phone:    ${data.personal.phone || "Not Specified"}
Zip:      ${data.personal.address || "Not Specified"}
Website:  ${data.personal.website || "Not Specified"}

`;

    if (data.profile) {
      content += `EXECUTIVE PROFILE
--------------------------------------------------
${data.profile}

\n`;
    }

    if (data.experience && data.experience.length) {
      content += `PROFESSIONAL EXPERIENCE
--------------------------------------------------\n`;
      data.experience.forEach(exp => {
        content += `${exp.role || "Role"} | ${exp.company || "Company"} | ${exp.location || "City"}
Period: ${exp.startDate || "N/A"} - ${exp.endDate || "N/A"}
Description:
${exp.description || "N/A"}
\n`;
      });
    }

    if (data.projects && data.projects.length) {
      content += `REPRESENTATIVE PROJECTS
--------------------------------------------------\n`;
      data.projects.forEach(proj => {
        content += `${proj.title || "Project Title"}
URL: ${proj.url || "N/A"}
Stack: ${proj.techStack || "N/A"}
Description:
${proj.description || "N/A"}
\n`;
      });
    }

    if (data.education && data.education.length) {
      content += `EDUCATION CERTIFICATIONS
--------------------------------------------------\n`;
      data.education.forEach(edu => {
        content += `${edu.degree || "Degree"} | ${edu.school || "School"}
Period: ${edu.startDate || "N/A"} - ${edu.endDate || "N/A"}
Details: ${edu.description || "N/A"}
\n`;
      });
    }

    if (data.skills && data.skills.length) {
      content += `CORE DOMAIN COMPETENCY
--------------------------------------------------\n`;
      content += data.skills.map(skill => `- ${skill.name || "N/A"}`).join('\n');
      content += `\n\n`;
    }

    content += `Generated using Revbsus Automated Builder on ${new Date().toLocaleDateString()}.\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  },

  // 3. Backup JSON
  exportJSON: (data, fileName = "resume_backup.json") => {
    const backupStr = JSON.stringify(data, null, 2);
    const blob = new Blob([backupStr], { type: "application/json;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  },

  // 4. Standalone HTML Export (Formatted document ready to mount or host)
  exportHTML: (data, htmlContent, themeName = "modern", fileName = "resume.html") => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.personal.name || "Resume"}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono&display=swap">
  <style>
    body {
      background: #fafafa;
      color: #1f2937;
      padding: 50px 20px;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .sheet {
      background: #ffffff;
      max-width: 800px;
      margin: 0 auto;
      padding: 48px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="sheet">
    ${htmlContent}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  },

  // 5. Simulated MS Word DOCX Export (Word compatible Mime representation)
  exportDOCX: (data, htmlContent, fileName = "resume.doc") => {
    // MS Word parses standard HTML beautifully of we wrap it in a proper header block with Microsoft namespaces!
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
          <head><title>Resume</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 1in; padding: 0; }
          </style>
          </head>
          <body>`;
    const footer = "</body></html>";
    const docHtml = header + htmlContent + footer;

    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
};
