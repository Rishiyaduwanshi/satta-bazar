const fs = require('fs');

module.exports = {
    logError: (error, contextCode) => { // Use => to define a function
        const logEntry = `${new Date().toLocaleString()} - Code: ${contextCode} - Error: ${error.message}\n`;
        fs.appendFile('error.log', logEntry, (err) => {
            if (err) console.error("Failed to log error:", err);
        });
    }
};
