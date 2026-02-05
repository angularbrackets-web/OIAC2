import type { APIRoute } from 'astro';
import { createFeedback, type FeedbackInput } from '../../../lib/db';
import { Resend } from 'resend';

const VALID_CATEGORIES = ['feedback', 'suggestion', 'complaint'];

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Honeypot check — bots fill hidden fields
    if (body.website) {
      // Silently accept to not tip off bots
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { name, email, category, message } = body;

    // Validate required fields
    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (message.length > 1000) {
      return new Response(JSON.stringify({ error: 'Message must be 1000 characters or less' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return new Response(JSON.stringify({ error: 'Invalid category' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const feedbackData: FeedbackInput = {
      name: name?.trim() || undefined,
      email: email?.trim() || undefined,
      category,
      message: message.trim(),
    };

    await createFeedback(feedbackData);

    // Send email notification via Resend
    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'OIAC Website <noreply@oiacedmonton.ca>',
          to: 'info@oiacedmonton.ca',
          subject: `New ${category} received from OIAC website`,
          html: `
            <h2>New ${category} submission</h2>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Name:</strong> ${feedbackData.name || 'Anonymous'}</p>
            <p><strong>Email:</strong> ${feedbackData.email || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${feedbackData.message.replace(/\n/g, '<br>')}</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send feedback email notification:', emailError);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
