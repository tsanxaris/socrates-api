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

    if (!question) {
      prompt = "Ask a deep Socratic philosophical question.";
    } else {
      prompt = `Question: ${question}\nUser answer: ${answer}\nRespond like Socrates with another question.`;
    }

    // ✅ ΝΕΟ endpoint για sk-proj
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

    console.log(data); // debug

    if (!data.output) {
      return res.json({
        text: "ERROR: " + JSON.stringify(data)
      });
    }

    // ✅ παίρνει απάντηση σωστά
    const text = data.output[0].content[0].text;

    res.json({ text });

  } catch (err) {
    console.log(err);
    res.json({ text: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
