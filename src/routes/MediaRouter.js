// Resource routes
const express=require("express");
const ResourceController = require("../controllers/MediaController");
const authMiddleware = require("../middlewares/authMiddleware");
const resourceRouter = express.Router();
resourceRouter.post('/', authMiddleware, ResourceController.addResource);
resourceRouter.get('/:subjectId', ResourceController.getResourcesBySubject);

module.exports=resourceRouter;