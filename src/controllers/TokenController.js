const jwt = require('jsonwebtoken');
const User = require('../models/User/UserSchema'); // Replace with your User model

const TokenController = {
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token is required' });
      }

      // Verify the refresh token
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid refresh token' });
        }

        // Find the user by ID from the decoded refresh token
        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Generate a new access token
        const accessToken = await generateAccessToken(user);

        res.status(200).json({ accessToken });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = TokenController;
