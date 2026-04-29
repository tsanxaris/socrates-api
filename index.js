import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/ai", async (req, res) => {
  try {
    const { mode, question, answer, correct } = req.body || {};

    let prompt;

    // 🎯 STEP 1: Δημιουργία ερώτησης
    if (mode === "question") {
      prompt = `
Create a Socratic-style multiple choice question.

Rules:
- Philosophical (virtue, truth, knowledge, ethics)
- Deep and reflective like Socrates
- 4 options (A, B, C, D)
- Only one correct answer
- DO NOT reveal correct answer in visible text
- At the end include: [ANSWER:X]

Example:
[ANSWER:B]
`;
    }

    // 🎯 STEP 2: Έλεγχος απάντησης
    else {
      if (answer === correct) {
        return res.json({
          text: `Correct ✅\nKEY: wisdom\nΠροχώρα στο επόμενο`
        });
      } else {
        return res.json({
          text: `Wrong ❌\nTry again`
        });
      }
    }

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

    // 🔍 βρίσκουμε το σωστό answer
    const match = raw.match(/\[ANSWER:([A-D])\]/);
    const correct = match ? match[1] : null;

    // ❌ αφαιρούμε το answer από το text
    const clean = raw.replace(/\[ANSWER:[A-D]\]/, "").trim();

    res.json({
      text: clean,
      correct
    });

  } catch (err) {
    console.log(err);
    res.json({ text: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
