const userService = require('../services/userService');

class AuthController {
  async register(req, res) {
    try {
      const { name, email } = req.body;
      
      // Validation
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const result = await userService.createUser({ name, email });
      
      if (!result.success) {
        return res.status(409).json({ error: result.message });
      }

      res.status(201).json({
        message: 'User registered successfully',
        user: result.user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await userService.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Login successful',
        user
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
}

module.exports = new AuthController();
