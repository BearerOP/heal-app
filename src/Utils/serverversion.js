const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get("/", (req, res) => {
    const repoName = "Swasthya-backend";

    fetch(`https://api.github.com/repos/Slug-For-Sure/${repoName}`)
    .then(response => response.json())
    .then(json => {
        if (json.pushed_at) {
            const pushedDate = new Date(json.pushed_at);
            const formattedDate = pushedDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
            res.send(`Last Updated At: ${formattedDate}`);
        } else {
            res.send({ error: "Repository not found or no push data" });
        }
    })
    .catch(err => {
        res.send({ error: 'Failed to fetch repository data' });
    });
});

module.exports = router;
