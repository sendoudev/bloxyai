const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

app.post('/generate', (req, res) => {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const prompt = "Tu es un expert en Roblox Luau. Réponds UNIQUEMENT avec le code source brut pour : " + req.body.message;
    
    const data = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (d) => body += d);
        response.on('end', () => {
            try {
                const json = JSON.parse(body);
                if (json.candidates && json.candidates[0].content.parts[0].text) {
                    res.json({ code: json.candidates[0].content.parts[0].text });
                } else {
                    res.status(500).json({ error: "Pas de réponse de l'IA" });
                }
            } catch (e) {
                res.status(500).json({ error: "Erreur JSON" });
            }
        });
    });

    request.on('error', (e) => res.status(500).json({ error: e.message }));
    request.write(data);
    request.end();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Bridge Ready with Google!"));
