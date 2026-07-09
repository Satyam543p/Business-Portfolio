import nodemailer from 'nodemailer';

export default async ({ req, res, log, error }) => {
  // Triggered on document creation in Client_Leads collection
  log('Function triggered by database event.');
  
  if (req.method !== 'POST') {
    return res.json({ success: false, message: 'Only POST method is allowed.' }, 400);
  }

  try {
    // Appwrite sends the event payload in the request body
    // The payload is the created document
    const lead = req.body;
    log(`New Lead details: Client Name: ${lead.client_name}, Business: ${lead.business_name}`);

    // Read SMTP config from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const toEmail = process.env.OWNER_EMAIL; // Agency owner's notification recipient

    if (!smtpHost || !smtpUser || !smtpPass || !toEmail) {
      error('SMTP configuration or Owner Email is missing in environment variables.');
      return res.json({ success: false, message: 'SMTP environment variables are not configured.' }, 500);
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '587'),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"Code Captain Leads" <${smtpUser}>`,
      to: toEmail,
      subject: `🔥 New B2B Lead: ${lead.business_name} - ${lead.client_name}`,
      html: `
        <h2>New Lead Details</h2>
        <p><strong>Client Name:</strong> ${lead.client_name}</p>
        <p><strong>Business Name:</strong> ${lead.business_name}</p>
        <p><strong>WhatsApp Number:</strong> ${lead.whatsapp_number}</p>
        <p><strong>Business Type:</strong> ${lead.business_type || 'Not specified'}</p>
        <p><strong>Message:</strong> ${lead.message || 'No message provided'}</p>
        <br/>
        <hr/>
        <p>This lead was captured dynamically via the Code Captain Storefront and written to your Appwrite Database.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    log('Email sent successfully!');
    return res.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    error('Failed to send email: ' + err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
