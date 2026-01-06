const express = require('express');
const app = express();
app.use(express.json());

// Utilise une version compatible de fetch intégrée à Node 18+
app.post('/generate', async (req, res) => {
    const API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!API_KEY) {
        return res.status(500).json({ error: "Clé API manquante sur Render" });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Tu es un expert en Roblox Luau. Réponds UNIQUEMENT avec le code source brut pour : " + req.body.message }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let code = data.candidates[0].content.parts[0].text;
            res.json({ code: code });
        } else {
            res.status(500).json({ error: "L'IA n'a pas pu générer de code" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Bridge Ready with Google!"));
