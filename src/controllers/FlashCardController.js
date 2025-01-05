
// ResourceController.js
const flashcardSchema = require('../models/FlashCardSchema');

const FlashCardController = {
    // Get user-specific flashcards
    async getUserSpecificCards(req, res) {
        console.log("get all flash api is called", req)
        try {
            const flashcards = await flashcardSchema.find({ userId: req.user.userId });
            res.json(flashcards);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getInitialFlashcards(req, res) {
        try {
            const userId = req.user?.userId;
            console.log("userId called", userId); // Assuming you're storing the logged-in user ID in the request object

            if (!userId) {
                return res.status(400).json({ success: false, message: "User not authenticated" });
            }

            // Fetch flashcards sorted by priority:
            const flashcards = await flashcardSchema.find({ userId })
                .sort({
                    nextReviewDate: 1,  // Flashcards due for review first (ascending order)
                    quality: 1,         // Show cards marked "Hard" next (ascending order)
                    createdAt: 1        // Lastly, show newly created cards (ascending order)
                })
                .limit(10);  // Limit the number of flashcards to display at once

            res.status(200).json(flashcards);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Failed to fetch flashcards." });
        }
    },

    // Get all due flashcards
    async getAllFlashCardDue(req, res) {
        console.log("called due");
        try {
            const today = new Date();
            const userId = req.user.userId; // Adjusted destructuring to correctly retrieve `userId`
            
            // Fix the query
            const flashcards = await flashcardSchema.find({
                userId: userId, // Match by userId
                nextReviewDate: { $lte: today }, // Match by nextReviewDate less than or equal to today
            });
    
            res.json(flashcards);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    

    // Get public flashcards

    async getAllPublicFlashCards(req, res) {
        try {
            const flashcards = await flashcardSchema.find({ isPublic: true, isApproved: true });
            res.json(flashcards);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Create a new flashcard
    async createNewFlashCard(req, res) {
        try {
            const { question, answer, isPublic, subject, difficulty } = req.body;
            console.log("difficulty",difficulty)
            const userId = req.user?.userId;
    
            if (!userId) {
                return res.status(400).json({ error: "User not authenticated" });
            }
    
            // Set the initial nextReviewDate based on the difficulty
            const currentDate = new Date();
            let daysToAdd = 0;
    
            switch (difficulty) {
                case 'easy': // Easy
                    daysToAdd = 5; // Review in 5 days
                    break;
                case 'medium': // Medium
                    daysToAdd = 3; // Review in 3 days
                    break;
                case 'hard': // Hard
                    daysToAdd = 1; // Review in 1 day
                    break;
                default:
                    daysToAdd = 3; // Default to Medium (3 days) if no difficulty is provided
            }
    
            // Calculate the nextReviewDate
            let nextReviewDate = new Date(currentDate.setDate(currentDate.getDate() + daysToAdd));
    
            // Create a new flashcard object
            const flashcard = new flashcardSchema({
                userId,
                question,
                answer,
                isPublic,
                subject,
                nextReviewDate, // Set the next review date based on the difficulty
                difficulty, // Save the difficulty level
            });
    
            // Save the flashcard
            await flashcard.save();
    
            // Return the created flashcard object
            res.status(201).json(flashcard);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update flashcard after review
    async updateFlashCardAfterReview(req, res) {
        console.log("called update")
        try {
            const { quality } = req.body;
            const flashcard = await flashcardSchema.findById(req.params.id);

            if (!flashcard || flashcard.userId.toString() !== req.user.userId) {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Spaced repetition logic
            let easeFactor = flashcard.easeFactor;
            easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
            easeFactor = Math.max(1.3, easeFactor);

            let interval;
            if (quality < 3) {
                interval = 1;
            } else {
                interval = flashcard.interval * easeFactor;
            }

            const nextReviewDate = new Date();
            nextReviewDate.setDate(nextReviewDate.getDate() + Math.round(interval));

            flashcard.interval = interval;
            flashcard.easeFactor = easeFactor;
            flashcard.reviewCount += 1;
            flashcard.nextReviewDate = nextReviewDate;

            await flashcard.save();
            res.json(flashcard);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Admin: Get all pending flashcards
    async getAllPendingCards(req, res) {
        try {
            const flashcards = await flashcardSchema.find({ isPublic: true, isApproved: false });
            res.json(flashcards);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Admin: Approve or reject flashcard
    async approvedOrReject(req, res) {
        try {
            const { isApproved } = req.body;
            const flashcard = await flashcardSchema.findById(req.params.id);

            if (!flashcard || !flashcard.isPublic) {
                return res.status(404).json({ error: 'Flashcard not found or not public' });
            }

            flashcard.isApproved = isApproved;
            await flashcard.save();

            res.json(flashcard);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = FlashCardController;