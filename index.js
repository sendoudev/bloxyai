const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

// Récupère la clé depuis Render
const API_KEY = process.env.GOOGLE_API_KEY;

app.post('/generate', async (req, res) => {
    try {
        // URL de l'API Google Gemini
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Tu es un expert en Roblox Luau. Réponds UNIQUEMENT avec le code source brut pour cette demande : " + req.body.message }]
                }]
            })
        });

        const data = await response.json();
        
        // Extraction du texte de la réponse Google
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            res.json({ code: data.candidates[0].content.parts[0].text });
        } else {
            console.error("Erreur Google API:", data);
            res.status(500).json({ error: "L'IA n'a pas pu répondre" });
        }

    } catch (error) {
        console.error("Erreur Serveur:", error);
        res.status(500).json({ error: "Erreur interne" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Bridge Ready with Google Gemini!"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Bridge Ready!"));
