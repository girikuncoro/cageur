const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Hello world from Cageur!');
});

module.exports = router;
