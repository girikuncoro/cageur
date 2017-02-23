const ctl = {
  getSelfProfile(req, res, next) {
    const user = req.user;
    res.status(200).json({
      status: 'success',
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        clinic_id: user['clinic_id'],
      },
      message: 'Retrieved user own profile',
    });
  },
};

module.exports = ctl;
