const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');

router.post('/ask', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const openAIRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }]
            })
        });
        
        const data = await openAIRes.json();
        if (data.error) {
            console.error("OpenAI error:", data.error);
            return res.status(500).json({ reply: "OpenAI error: " + data.error.message });
          }
        const reply = data.choices?.[0]?.message?.content || "Sorry, couldn't generate response.";

        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Falied to get AI response'});
    }
});

module.exports = router;