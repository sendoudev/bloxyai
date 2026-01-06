const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

app.post('/generate', (req, res) => {
    const API_KEY = process.env.GOOGLE_API_KEY;
    
    const payload = JSON.stringify({
        contents: [{ parts: [{ text: "Tu es un expert Roblox. Réponds uniquement avec le code Luau pour : " + req.body.message }] }]
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
                // On vérifie que Google a bien répondu
                if (data.candidates && data.candidates[0].content) {
                    const result = data.candidates[0].content.parts[0].text;
                    res.json({ code: result });
                } else {
                    res.status(500).json({ error: "Erreur structure Google" });
                }
            } catch (e) {
                res.status(500).json({ error: "Erreur JSON" });
            }
        });
    });

    request.on('error', (err) => { res.status(500).json({ error: err.message }); });
    request.write(payload);
    request.end();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("SERVEUR OK");
    console.log("Clé détectée : OUI");
});
