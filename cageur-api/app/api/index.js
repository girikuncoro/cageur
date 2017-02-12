const router = require('express').Router();

router.get('/', (req, res) => { res.send('Welcome to Cageur API v1 ...'); });

module.exports = router;
