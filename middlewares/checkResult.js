const resultSchema = require("../models/resultSchema");

async function checkResult(req, res, next) {
    try {
        const { game, date, time } = req.body;
        const dateObject = new Date(date + "T" + time);
        
        // Check for existing result
        const existingResult = await resultSchema.findOne({
            date: dateObject,
            $or: [
                { game: "Mumbai Starline" },
                { game: { $ne: "Mumbai Starline" } }
            ]
        });

        if (existingResult) {
            if (game === "Mumbai Starline") {
                req.flash("error", "Result for Mumbai Starline already exists for this date and time.");
            } else {
                req.flash("error", `You have already submitted a result for ${game} on date ${date}.`);
            }
            return res.redirect('/submitresult');
        }

        // If no conditions were met, proceed to the next middleware or route handler
        next();
        
    } catch (error) {
        console.error("Error checking result:", error);
        req.flash("error", "An error occurred while checking results.");
        res.redirect("/submitresult");
    }
}

module.exports = checkResult;
