import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory submissions backup so no leads are lost
const submissions: any[] = [];

// API route to submit questionnaire responses
app.post('/api/submit-lead', async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      submittedAt: new Date().toISOString(),
    };

    submissions.unshift(leadData);
    console.log(`[Lead Received] ${leadData.fullName || 'Anonymous'} - ${leadData.phone || 'No phone'}`);

    const webhookUrl =
      process.env.GOOGLE_SHEET_WEBHOOK_URL ||
      'https://script.google.com/macros/s/AKfycbz85Z6wW1ByEmMn64Qavns7wbAhqVeG9NhEKttGfFg16G-xuXHNJAHr9BuOXyiiWt0U/exec';
    let forwarded = false;

    if (webhookUrl && webhookUrl.trim() !== '') {
      try {
        const response = await fetch(webhookUrl.trim(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData),
          redirect: 'follow',
        });

        if (response.ok) {
          forwarded = true;
          console.log('[Google Sheet Webhook] Lead successfully forwarded.');
        } else {
          console.warn(`[Google Sheet Webhook] Response status: ${response.status}`);
        }
      } catch (webhookErr) {
        console.error('[Google Sheet Webhook Error]:', webhookErr);
      }
    } else {
      console.log('[Google Sheet Webhook] GOOGLE_SHEET_WEBHOOK_URL not set in environment. Saved in backup log.');
    }

    res.json({
      success: true,
      forwarded,
      message: forwarded
        ? 'Lead saved to Google Sheet'
        : 'Lead saved locally. Set GOOGLE_SHEET_WEBHOOK_URL in environment to sync to Google Sheet.',
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Endpoint to view submissions summary
app.get('/api/submissions', (req, res) => {
  res.json({
    total: submissions.length,
    webhookConfigured: Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL),
    submissions,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
