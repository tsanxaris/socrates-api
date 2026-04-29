import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/ai", async (req, res) => {
  try {
    const { question, answer } = req.body || {};

    let prompt;

    // 🎯 ΝΕΑ ΕΡΩΤΗΣΗ (QUIZ MODE)
    if (!question) {
      prompt = `
Create a multiple choice quiz question.

Rules:
- 1 question
- 4 answers (A, B, C, D)
- show them clearly
- at the end write: Correct: X
- keep it simple
`;
    }

    // 🎯 ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΗΣ
    else {
      prompt = `
Question: ${question}
User answer: ${answer}

If correct:
- say "Correct ✅"
- give a KEY (one word only)
- say "Προχώρα στο επόμενο"

If wrong:
- say "Wrong ❌"
- say "Try again"

Keep it short.
`;
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

    console.log("OPENAI:", data);

    if (!data.output) {
      return res.json({
        text: "ERROR: " + JSON.stringify(data)
      });
    }

    const text = data.output[0].content[0].text;

    res.json({ text });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.json({ text: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
