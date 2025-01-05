// Falsh card  routes
const express=require("express");
const FlashCardController =require("../controllers/FlashCardController")

const authMiddleware = require("../middlewares/authMiddleware");
const FlashCardRouter = express.Router();
FlashCardRouter.post('/', authMiddleware, FlashCardController.createNewFlashCard);
FlashCardRouter.get('/', authMiddleware, FlashCardController.getUserSpecificCards);
FlashCardRouter.get('/public', authMiddleware, FlashCardController.getAllPublicFlashCards);
FlashCardRouter.get('/due', authMiddleware,FlashCardController.getAllFlashCardDue);
FlashCardRouter.get('/pending', authMiddleware,FlashCardController.getAllPendingCards);
FlashCardRouter.get('/approve/:id', authMiddleware,FlashCardController.approvedOrReject);
FlashCardRouter.get('/initial', authMiddleware,FlashCardController.getInitialFlashcards);
FlashCardRouter.post('/review/:id',authMiddleware,FlashCardController.updateFlashCardAfterReview);




FlashCardRouter.post('/review/:id',authMiddleware,FlashCardController.updateFlashCardAfterReview);

module.exports=FlashCardRouter;