const User=require("../models/User/UserSchema")
const BookmarkController={
    addQuestionToBookmark:async (req, res) => {
        const {itemId, itemType, title, url } = req.body;
        const userId=req.user.userId;
      
        try {
          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ message: "User not found" });
      
          const existingBookmark = user.bookmarks.find(
            (b) => b.itemId.toString() === itemId && b.itemType === itemType
          );
          if (existingBookmark) {
            return res.status(400).json({ message: "Item already bookmarked" });
          }
      
          user.bookmarks.push({ itemId, itemType, title, url });
          await user.save();
      
          res.status(201).json({ message: "Item bookmarked successfully" });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
    fetchBookmark:async (req, res) => {
        const { userId } = req.user.userId;
      
        try {
          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ message: "User not found" });
      
          res.status(200).json(user.bookmarks);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
      removeFromBookmark:async (req, res) => {
        const { itemId } = req.params;
        const userId=req.user.userId;
      
        try {
          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ message: "User not found" });
      
          user.bookmarks = user.bookmarks.filter(
            (b) => b.itemId.toString() !== itemId
          );
          await user.save();
      
          res.status(200).json({ message: "Bookmark removed successfully" });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }}
}

module.exports=BookmarkController;