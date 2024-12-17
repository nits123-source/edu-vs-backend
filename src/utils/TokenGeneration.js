// Helper function to generate an access token
const jwt=require("jsonwebtoken");
function generateAccessToken(user) {
    try {
      console.log("User from token generation", user);
  
      if (!user || !user._id || !user.username || !user.contact) {
        throw new Error("Missing required user fields for token generation");
      }
  
      const token = jwt.sign(
        { userId: user._id, username: user.username, contact: user.contact },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME } // Token expiration time
      );
  
      return token;
    } catch (error) {
      console.error("Error generating access token:", error.message);
      throw new Error("Failed to generate access token"); // Rethrow with a custom message
    }
  }
  
  
  // Helper function to generate a refresh token
  function generateRefreshToken(user) {
    try {
      console.log("User from token generation", user);
  
      if (!user || !user._id || !user.username || !user.contact) {
        throw new Error("Missing required user fields for token generation");
      }
  
      const token = jwt.sign(
        { userId: user._id, username: user.username, contact: user.contact },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME } // Token expiration time
      );
  
      return token;
    } catch (error) {
      console.error("Error generating refresh token:", error.message);
      throw new Error("Failed to generate refresh token"); // Rethrow with a custom message
    }
  }
  
  module.exports={generateAccessToken,generateRefreshToken};