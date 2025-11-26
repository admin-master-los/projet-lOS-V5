const i=async e=>{const o="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";try{const t=await fetch("https://api.brevo.com/v3/smtp/email",{method:"POST",headers:{accept:"application/json","api-key":o,"content-type":"application/json"},body:JSON.stringify({sender:{name:"Leonce Ouattara Studio",email:"contact@leonceouattarastudiogroup.site"},to:[e.to],subject:e.subject,htmlContent:e.htmlContent,textContent:e.textContent})});if(!t.ok){const a=await t.json();return console.error("❌ Erreur Brevo:",a),!1}return console.log("✅ Email envoyé:",e.to.email),!0}catch(t){return console.error("❌ Erreur envoi email:",t),!1}},n=e=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 30px;
        }
        .field {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        .field:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #667eea;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .value {
          color: #333;
          font-size: 16px;
          word-wrap: break-word;
        }
        .message-box {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          white-space: pre-wrap;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background: #f9f9f9;
          color: #666;
          font-size: 14px;
        }
        .reply-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Nouveau Message de Contact</h1>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">De</div>
            <div class="value">${e.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email</div>
            <div class="value">
              <a href="mailto:${e.email}" style="color: #667eea; text-decoration: none;">
                ${e.email}
              </a>
            </div>
          </div>
          
          ${e.company?`
          <div class="field">
            <div class="label">Entreprise</div>
            <div class="value">${e.company}</div>
          </div>
          `:""}
          
          <div class="field">
            <div class="label">Budget</div>
            <div class="value">${e.budget}</div>
          </div>
          
          <div class="field">
            <div class="label">Description du Projet</div>
            <div class="message-box">${e.project}</div>
          </div>
          
          <div style="text-align: center;">
            <a href="mailto:${e.email}" class="reply-button">
              Répondre à ${e.name}
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>Message reçu via le formulaire de contact</p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">
            Répondez directement à ${e.email}
          </p>
        </div>
      </div>
    </body>
    </html>
  `,r=e=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .checkmark {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px auto 0;
          font-size: 30px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .message-recap {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          margin: 25px 0;
        }
        .message-recap h3 {
          margin-top: 0;
          color: #667eea;
          font-size: 16px;
        }
        .message-text {
          white-space: pre-wrap;
          color: #555;
        }
        .footer {
          text-align: center;
          padding: 30px;
          background: #f9f9f9;
          color: #666;
          font-size: 14px;
        }
        .info-box {
          background: #e8f4f8;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Message bien reçu !</h1>
          <div class="checkmark">✓</div>
        </div>
        
        <div class="content">
          <p class="greeting">Bonjour ${e.name},</p>
          
          <p>
            Merci de nous avoir contacté ! Nous avons bien reçu votre message 
            et nous vous répondrons dans les plus brefs délais.
          </p>
          
          <div class="message-recap">
            <h3>Récapitulatif de votre message :</h3>
            ${e.company?`<p><strong>Entreprise :</strong> ${e.company}</p>`:""}
            <p><strong>Budget :</strong> ${e.budget}</p>
            <p><strong>Votre projet :</strong></p>
            <div class="message-text">${e.project}</div>
          </div>
          
          <div class="info-box">
            <p style="margin: 0; font-weight: 600; color: #667eea;">
              ⏱️ Délai de réponse : 24-48 heures
            </p>
          </div>
          
          <p>
            Notre équipe étudiera votre demande avec attention et reviendra 
            vers vous rapidement avec une réponse personnalisée.
          </p>
          
          <p style="margin-top: 30px;">
            Cordialement,<br>
            <strong>L'équipe</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>
            Cet email a été envoyé automatiquement suite à votre demande de contact.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">
            Merci de ne pas répondre à cet email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,s=async e=>await i({to:{email:"contact@leonceouattarastudiogroup.site",name:"Admin"},subject:`Nouveau message de contact : ${e.name}`,htmlContent:n(e)}),d=async e=>await i({to:{email:e.email,name:e.name},subject:"Message bien reçu !",htmlContent:r(e)}),l=async e=>{const[o,t]=await Promise.all([d(e),s(e)]);return{clientSent:o,adminSent:t}};export{s as sendContactAdminNotification,d as sendContactClientConfirmation,l as sendContactEmails,i as sendEmail};
