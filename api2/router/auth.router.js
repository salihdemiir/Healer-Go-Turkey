const express = require("express")
const router = express.Router()
//aa
const authController = require("../controller/auth.controller")

router.post("/register", authController.register)

router.post('/login',  authController.login, (req, res) => {
    res.redirect('/anasayfa');
  });


// Logout endpoint
router.post('/logout', (req, res) => {
  // Silme işlemi gerçekleştirilir
  res.clearCookie('accessToken');
  res.json({ message: 'You have successfully logged out.' });
});


module.exports = router