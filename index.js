import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/ai", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are Socrates. Ask short philosophical riddles."
          },
          {
            role: "user",
            content: "Ask me a question about knowledge."
          }
        ]
      })
    });

    const data = await response.json();

    // ΣΤΕΛΝΟΥΜΕ ΜΟΝΟ ΤΟ ΚΕΙΜΕΝΟ
   res.send(
  data.choices[0].message.content.replace(/"/g, "")
);

  } catch (error) {
    res.send("Error generating response");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
