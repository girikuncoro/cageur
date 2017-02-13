const router = require('express').Router();

// test restricted page
router.get("/", (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
    message: 'Authorization succeeded',
  });
});

module.exports = router;
