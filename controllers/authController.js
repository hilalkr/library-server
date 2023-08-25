// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => { //"registerUser" işlevi, gelen kullanıcı bilgilerini alır, veritabanında kaydeder ve sonunda uygun bir yanıt döndürür.
  try {
    const { name, email, password } = req.body; //req.headers IP adresi alırız
    console.log(name);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.log('error: ', error)
    res.status(500).json({ message: 'An error occurred while registering the user.', error });
  }
};
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
  
      const token = jwt.sign({ userId: user._id }, 'my_super_secret_key_123'); // Burada gizli anahtarınızı kullanın
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while logging in.' });
    }
  };
module.exports = { registerUser, loginUser };
