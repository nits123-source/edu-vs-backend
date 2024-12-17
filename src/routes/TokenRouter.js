const express = require('express');
const TokenController = require('../controllers/TokenController');

const tokenRouter = express.Router();

// Refresh token route
tokenRouter.post('/refresh', TokenController.refreshToken);

module.exports = tokenRouter;
