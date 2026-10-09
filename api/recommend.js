export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const prompt = String(req.body?.prompt ?? "").trim().slice(0, 300);
  if (!prompt) return res.status(400).json({ error: "Describe what you want to hear." });

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "GEMINI_API_KEY is missing. Check .env.local and restart." });
  }

  const MODEL = "gemini-3.5-flash-lite"; // use a current free-tier model from AI Studio

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  'You recommend music albums. Reply only with JSON: {"albums":[{"title":"","artist":"","reason":""}]}. ' +
                  "Give exactly 6 real, released albums. Keep each reason under 15 words. Never include song lyrics.",
              },
            ],
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!r.ok) {
      const detail = await r.text();
      console.error("Gemini error:", r.status, detail);
      return res.status(502).json({ error: `Gemini returned ${r.status}. Check the terminal for details.` });
    }

    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(text);
    return res.status(200).json({ albums: parsed.albums ?? [] });
  } catch (err) {
    console.error("Function error:", err);
    return res.status(500).json({ error: "Something went wrong. Check the terminal for details." });
  }
}