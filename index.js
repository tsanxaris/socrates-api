import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/ai", async (req, res) => {
  try {
    const { mode, answer, correct } = req.body || {};

    // 🎯 1. Δημιουργία ερώτησης
    if (mode === "question") {

      const prompt = `
You are generating a Socratic quiz.

STRICT RULES:
- Philosophical question (virtue, truth, ethics, knowledge)
- Must sound like Socrates (deep & reflective)
- 4 options (A, B, C, D)
- ONLY one correct
- NEVER write "Correct" or reveal answer
- NO explanations

FORMAT EXACTLY:

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

      // 🔍 βρίσκουμε σωστή απάντηση
      const match = raw.match(/\[ANSWER:([A-D])\]/);
      const correctAnswer = match ? match[1] : null;

      // ❌ αφαιρούμε το [ANSWER:X]
      const cleanText = raw.replace(/\[ANSWER:[A-D]\]/, "").trim();

      return res.json({
        text: cleanText,
        correct: correctAnswer
      });
    }

    // 🎯 2. Έλεγχος απάντησης
    else {
      if (answer === correct) {
        return res.json({
          text: "Correct ✅\nKEY: wisdom\nΠροχώρα στο επόμενο"
        });
      } else {
        return res.json({
          text: "Wrong ❌\nTry again"
        });
      }
    }

  } catch (err) {
    console.log(err);
    res.json({ text: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
