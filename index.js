const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

app.post('/generate', (req, res) => {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const userMessage = req.body.message || "Script de base";

    const payload = JSON.stringify({
        contents: [{ parts: [{ text: "Génère UNIQUEMENT du code Luau Roblox pour : " + userMessage }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    const request = https.request(options, (response) => {
        let str = '';
        response.on('data', (chunk) => { str += chunk; });
        response.on('end', () => {
            try {
                const data = JSON.parse(str);
                // Vérification stricte de la réponse Google Gemini
                if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
                    const result = data.candidates[0].content.parts[0].text;
                    res.json({ code: result });
                } else {
                    res.status(500).json({ error: "Google n'a pas pu générer de code" });
                }
            } catch (e) {
                res.status(500).json({ error: "Erreur de lecture serveur" });
            }
        });
    });

    request.on('error', (err) => res.status(500).json({ error: err.message }));
    request.write(payload);
    request.end();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("SERVEUR OK");
    console.log("Clé détectée : OUI");
});
