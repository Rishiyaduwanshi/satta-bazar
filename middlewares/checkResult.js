const resultSchema = require("../models/resultSchema");

async function checkResult(req, res, next) {
    try {
        const { game, date, time } = req.body;
        // Combine date and time to create a Date object
        const dateObject = new Date(`${date}T${time}:00`); // Assuming time format is "HH:mm"
        
        // Check if the game is Super Faridabad
        if (game === "Super Faridabad") {
            // Check for Super Faridabad with exact date and time
            const existingResult = await resultSchema.findOne({
                game: "Super Faridabad",
                date: dateObject // Check with exact date and time
            });

            if (existingResult) {
                req.flash("error", `Result for Super Faridabad already exists on ${date} and ${time}.`);
                return res.redirect('/submitresult');
            }
        } else {
            // For other games, check if a result exists for the same date (ignore time)
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0); // Start of the day
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999); // End of the day

            const existingResult = await resultSchema.findOne({
                game: game, // Check for the same game
                date: { $gte: startOfDay, $lte: endOfDay } // Check only for the same date
            });

            if (existingResult) {
                req.flash("error", `Result for ${game} already exists on ${date}`);
                return res.redirect('/submitresult');
            }
        }

        // If no conflicts found, proceed to the next middleware
        next();
        
    } catch (error) {
        console.error("Error checking result:", error);
        req.flash("error", "An error occurred while checking results.");
        return res.redirect("/submitResult");
    }
}

module.exports = checkResult;
