
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

//router: belirli URL yollarına gelen istekleri alır ve bu istekleri ilgili işlevlere (middleware veya controller işlevleri) yönlendirir.
const router = express.Router();
//"/auth/register" URL yoluna gelen bir POST isteği, "registerUser" işlevini çalıştıran route tarafından yakalanacaktır. 
router.post('/register', registerUser);
router.post('/login', loginUser);
module.exports = router;
