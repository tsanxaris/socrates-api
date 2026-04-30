import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/ai", async (req, res) => {
  try {
    const { mode } = req.body || {};

    if (mode === "question") {

      const prompt = `
You are generating a Socratic quiz.

STRICT RULES:
- Philosophical question (virtue, truth, ethics, knowledge)
- Deep like Socrates
- 4 options (A, B, C, D)
- Only ONE correct
- NEVER show correct answer
- DO NOT write "Correct"

FORMAT:

Question: ...

A) ...
B) ...
C) ...
D) ...

[ANSWER:X]
`;

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          input: prompt
        })
      });

      const data = await response.json();
      const raw = data.output[0].content[0].text;

      const match = raw.match(/\[ANSWER:([A-D])\]/);
      const correct = match ? match[1] : null;

      const clean = raw.replace(/\[ANSWER:[A-D]\]/, "").trim();

      return res.json({ text: clean, correct });
    }

    res.json({ text: "Error" });

  } catch (err) {
    console.log(err);
    res.json({ text: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
