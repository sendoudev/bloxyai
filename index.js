const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const API_KEY = process.env.OPENROUTER_KEY;

app.post('/generate', async (req, res) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://roblox.com",
                "X-Title": "BloxyAI"
            },
            body: JSON.stringify({
                "model": "openai/gpt-oss-120b:free",
                "messages": [
                    {
                        "role": "system", 
                        "content": "Tu es un expert en Roblox Luau. Réponds UNIQUEMENT avec le code source brut, sans explications, sans balises."
                    },
                    {
                        "role": "user", 
                        "content": req.body.message
                    }
                ]
            })
        });

        const data = await response.json();
        res.json({ code: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Bridge Ready!"));