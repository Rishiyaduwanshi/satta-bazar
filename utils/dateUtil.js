module.exports = {
  getStartAndEndOfMonth: (date) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        throw new Error("Invalid date format");
      }
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0); // 0 means the last day of the previous month
      return {
        startOfMonthUTC: startOfMonth.toISOString(),
        endOfMonthUTC: endOfMonth.toISOString(),
      };
    } catch (error) {
      return { error: error.message }; // Return the error message
    }
  },
  getStartAndEndOfDay: (date) => {
    try {
      const d = new Date(date);
      const startOfDay = new Date(d.setHours(0, 0, 0, 0)); // Start at 00:00:00
      const endOfDay = new Date(d.setHours(23, 59, 59, 999)); // End at 23:59:59
      return {
        startOfDayUTC: startOfDay.toISOString(),
        endOfDayUTC: endOfDay.toISOString(),
      };
    } catch (error) {
      return { error: "Invalid date format" };
    }
  },
  getLocalDateString: (date) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        throw new Error("Invalid date format");
      }
      return d.toLocaleDateString(); // Returns the local date string
    } catch (error) {
      return { error: error.message }; // Return the error message
    }
  },
  getLocalDateTimeString: (date) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        throw new Error("Invalid date format");
      }
      return d.toLocaleString(); // Returns the local date and time string
    } catch (error) {
      return { error: error.message }; // Return the error message
    }
  },
  convertToUTC: (date) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        throw new Error("Invalid date format");
      }
      return d.toISOString(); // Converts to UTC
    } catch (error) {
      return { error: error.message }; // Return the error message
    }
  },
};
