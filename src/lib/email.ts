// Email template generators

export function generateContactEmailHTML(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  reason: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0B5563 0%, #2D9C88 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .field {
            margin-bottom: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0B5563;
          }
          .field-label {
            font-weight: 600;
            color: #0B5563;
            margin-bottom: 5px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .field-value {
            color: #333;
            font-size: 15px;
          }
          .message-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2D9C88;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🕌 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Islamic College Website</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">Contact Reason</div>
            <div class="field-value">${data.reason}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Name</div>
            <div class="field-value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value"><a href="mailto:${data.email}" style="color: #0B5563; text-decoration: none;">${data.email}</a></div>
          </div>
          
          ${data.phone ? `
            <div class="field">
              <div class="field-label">Phone</div>
              <div class="field-value"><a href="tel:${data.phone}" style="color: #0B5563; text-decoration: none;">${data.phone}</a></div>
            </div>
          ` : ''}
          
          ${data.subject ? `
            <div class="field">
              <div class="field-label">Subject</div>
              <div class="field-value">${data.subject}</div>
            </div>
          ` : ''}
          
          <div class="message-box">
            <div class="field-label">Message</div>
            <div class="field-value" style="white-space: pre-wrap;">${data.message}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the Islamic College contact form.</p>
          <p>Reply directly to this email to respond to ${data.name}.</p>
        </div>
      </body>
    </html>
  `
}

export function generateConfirmationEmailHTML(name: string, reason: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0B5563 0%, #2D9C88 100%);
            color: white;
            padding: 40px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: white;
            padding: 40px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #0B5563 0%, #2D9C88 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Reaching Out!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your message</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          
          <p>Thank you for contacting Islamic College. We have received your message regarding <strong>${reason}</strong> and appreciate your interest in our school.</p>
          
          <p>Our team will review your inquiry and respond within 24-48 hours during business days. If your matter is urgent, please feel free to call us at <strong>+1 (555) 123-4567</strong>.</p>
          
          <p style="margin-top: 30px; margin-bottom: 30px; text-align: center;">
            <a href="https://islamiccollege.edu" class="button">Visit Our Website</a>
          </p>
          
          <p>In the meantime, feel free to explore our website to learn more about our programs, faculty, and the Islamic College community.</p>
          
          <p style="margin-top: 30px;">
            Sincerely,<br>
            <strong>Islamic College Admissions Team</strong>
          </p>
        </div>
        <div class="footer">
          <p><strong>Islamic College</strong></p>
          <p>123 Education Drive, City, State 12345</p>
          <p>Phone: +1 (555) 123-4567 | Email: info@islamiccollege.edu</p>
        </div>
      </body>
    </html>
  `
}

export function generateNewsletterWelcomeHTML(name?: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0B5563 0%, #2D9C88 100%);
            color: white;
            padding: 40px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: white;
            padding: 40px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to Our Newsletter!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Islamic College Updates</p>
        </div>
        <div class="content">
          <p>Dear ${name || 'Subscriber'},</p>
          
          <p>Thank you for subscribing to the Islamic College newsletter! We're excited to keep you informed about:</p>
          
          <ul style="line-height: 2;">
            <li>School news and announcements</li>
            <li>Upcoming events and activities</li>
            <li>Student achievements</li>
            <li>Educational resources</li>
            <li>Community updates</li>
          </ul>
          
          <p>You'll receive our newsletter monthly, along with important updates throughout the school year.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Islamic College Team</strong>
          </p>
        </div>
        <div class="footer">
          <p><strong>Islamic College</strong></p>
          <p>123 Education Drive, City, State 12345</p>
          <p>You're receiving this email because you subscribed to our newsletter.</p>
          <p><a href="#" style="color: #0B5563;">Unsubscribe</a></p>
        </div>
      </body>
    </html>
  `
}