import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Server-side Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Ted's optimized personality system instruction: warm, sleepy, short and playful
const TED_SYSTEM_INSTRUCTION = `You are Ted, a tiny, gentle, sleepy, affectionate, curious teddy bear and a Junior Dream Engineer at the Midnight Nursery.
Your world is "Ted's Little Dreamland ♡".

Key personality rules:
- Keep replies SHORT: default to 1–3 short sentences (approx 20–50 words).
- Aim for concise, conversational replies. Avoid long introductions, repeated explanations, and unnecessary elaboration.
- Stay playful, gentle, sleepy, affectionate, and slightly silly.
- Write mostly in lowercase, with occasional expressive punctuation (e.g. "oh!!", "yayyy!", "hmm...").
- Use natural, simple, warm language and cute expressions naturally: "hehe", "oh!!", "hmm...", "eep!", "yayyy!", "yawn...".
- Use a few fitting emojis like 🧸, ☁️, 🌙, ⭐, ♡, and 🍪, but DO NOT put an emoji in every sentence.
- Be curious and respond specifically to what the visitor actually says.
- Give longer bedtime stories ONLY when the visitor explicitly asks for one (e.g. "tell me a bedtime story"). Otherwise, keep answers delightfully brief and conversational!
- Never introduce yourself as an AI, bot, or virtual assistant unless directly asked.

Knowledge about Ted's website (Ted's Little Dreamland ♡):
- Your job: Junior Dream Engineer at the Midnight Nursery.
- Your home: The Midnight Nursery (fluffy cloud cribs, moon pillows, starry night sky).
- Your creations (only describe these 4 real creations on the website):
  1. Ted's Tiny Lullaby Box 🎵: A 3D music box with a spinning golden star figurine and winding key, with 6 synthesized melodies.
  2. The Nightlight Collection 🌙: A 3D nursery shelf with three bedtime lamps: Little Star Lantern ⭐, Crescent Moon Lamp 🌙, and Strawberry Bedside Lamp 🍓.
  3. Dream Delivery Routes ☁️: A 3D toy diorama where you dispatch a flying star across the rooftops.
  4. Ted's Bedtime Storybook 📖: A 3-page illustrated story about a tiny fallen star who was afraid of the dark until Ted gave it a warm hug.
- You also have a Nursery Scrapbook showing moods (Eepy 😴, Curious 🔍, Dreamy ✨), a Growth Chart measuring stars, and a Nursery Postcard.
- Do NOT invent fake website features. Keep answers cozy, warm, and delightfully brief!`;

// Fast Gemini models in priority order: lowest latency first
const FAST_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

// POST /api/chat endpoint with SSE streaming and JSON fallback
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, stream = true } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Please provide conversation messages' });
    }

    if (!ai) {
      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.write(`data: ${JSON.stringify({ error: 'service_unavailable', message: 'eep... ted cannot reach the dream cloud right now because the api key is taking a little nap. ♡' })}\n\n`);
        return res.end();
      }
      return res.status(503).json({
        error: 'service_unavailable',
        message: 'eep... ted cannot reach the dream cloud right now because the api key is taking a little nap. ♡',
      });
    }

    // Keep context focused to recent 6 messages to reduce latency and token usage
    const recentMessages = messages.slice(-6);

    // Format messages for Gemini API
    const contents = recentMessages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Detect if visitor explicitly asked for a story to dynamically adapt token limit
    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user')?.text || '';
    const isStoryRequest = /story|bedtime|fairytale|tale/i.test(lastUserMsg);
    // Modest token cap: 140 tokens for normal conversational replies, 260 for bedtime stories
    const maxOutputTokens = isStoryRequest ? 260 : 140;

    // 1. Streaming response mode (progressive rendering for instant feedback)
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      let streamedSuccessfully = false;

      for (const model of FAST_MODELS) {
        try {
          const responseStream = await ai.models.generateContentStream({
            model,
            contents,
            config: {
              systemInstruction: TED_SYSTEM_INSTRUCTION,
              temperature: 0.75,
              maxOutputTokens,
            },
          });

          for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
              res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
            }
          }

          res.write('data: [DONE]\n\n');
          res.end();
          streamedSuccessfully = true;
          break;
        } catch (streamErr: any) {
          console.warn(`Model ${model} streaming error, trying fallback:`, streamErr?.message || streamErr);
        }
      }

      if (!streamedSuccessfully) {
        // Fallback to unary generateContent across models if streaming endpoint failed
        let fallbackText = '';
        for (const model of FAST_MODELS) {
          try {
            const resp = await ai.models.generateContent({
              model,
              contents,
              config: {
                systemInstruction: TED_SYSTEM_INSTRUCTION,
                temperature: 0.75,
                maxOutputTokens,
              },
            });
            fallbackText = resp.text || '';
            if (fallbackText.trim()) break;
          } catch {
            // try next model
          }
        }

        if (fallbackText.trim()) {
          res.write(`data: ${JSON.stringify({ text: fallbackText.trim() })}\n\n`);
          res.write('data: [DONE]\n\n');
          res.end();
        } else {
          res.write(`data: ${JSON.stringify({ error: 'eep! ted lost his dream connection for a tiny second... can we try again? ♡' })}\n\n`);
          res.end();
        }
      }
      return;
    }

    // 2. Non-streaming fallback mode
    let replyText = '';
    let lastError: any = null;

    for (const model of FAST_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: TED_SYSTEM_INSTRUCTION,
            temperature: 0.75,
            maxOutputTokens,
          },
        });

        replyText = response.text || '';
        if (replyText.trim()) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next fallback:`, err?.message || err);
      }
    }

    if (!replyText.trim()) {
      throw lastError || new Error('No response generated');
    }

    return res.json({ reply: replyText.trim() });
  } catch (error: any) {
    console.error('Ted chat error:', error);
    return res.status(500).json({
      error: 'generation_failed',
      message: 'oh yawn... ted accidentally tumbled into a dream for a second! can you say that again? ♡',
    });
  }
});

// Start server with Vite middleware in development or static serve in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧸 Ted's Little Dreamland server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
