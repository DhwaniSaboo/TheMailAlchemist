import fetch, { Headers } from 'node-fetch';
globalThis.fetch = fetch;
globalThis.Headers = Headers;

import express from 'express';
import { Resend } from 'resend';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-email', async (req, res) => {
  console.log("Request received at /send-email");
  console.log('Request body:', req.body);
  try {
    const response = await resend.emails.send({
      from: 'dhwani.saboo@themailalchemist.site',  // Make sure this is a verified sender in Resend
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.html,
    });

    if (response.data) {
      console.log("Email sent successfully");
      res.status(200).json({ success: true, message: "Emails sent successfully!" });
    } else {
      console.error(response.error);
      res.status(500).json({ message: 'Error sending email: ' + response.error.message });
    }
  } catch (error) {
    console.error('Error in email sending:', error);
    res.status(500).send({ error: 'An error occurred while sending the email' });
  
  }
});

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
