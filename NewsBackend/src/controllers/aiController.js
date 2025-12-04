import OpenAI from "openai";

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function extractTagsFallback(text) {
  if (!text) return [];
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 4)
    )
  ).slice(0, 8);
}

export const generateTags = async (req, res) => {
  try {
    const { title, content } = req.body;
    const fullText = `${title} ${content}`;

    if (!fullText.trim()) {
      return res.status(400).json({ error: "No content provided." });
    }

    const prompt = `
      Extract 5–10 SEO-friendly tags from the blog content below.
      Return ONLY a comma-separated list.

      TEXT:
      ${fullText}
    `;

    const aiRes = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });

    let output = aiRes.choices[0].message.content.trim();

    let tags = output
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!tags.length) {
      tags = extractTagsFallback(fullText);
    }

    return res.json({ tags });
  } catch (err) {
    console.error("AI Error:", err.message);

    const fallback = extractTagsFallback(
      (req.body.title || "") + " " + (req.body.content || "")
    );

    return res.json({ tags: fallback });
  }
};
