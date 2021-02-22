const router = require("express").Router();
const path = require("path");

// exercise html route
router.get("/exercise", (req, res) => {

    res.sendFile(path.join(__dirname, "../public/exercise.html"));

});

// stats html route
router.get("/stats", (req, res) => {

    res.sendFile(path.join(__dirname, "../public/stats.html"));

});

module.exports = router;