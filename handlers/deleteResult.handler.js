const Result = require("../models/resultSchema");

const deleteResult = async (req, res) => {
    try {
      const resultId = req.params.id;
      const deletedResult = await Result.findByIdAndDelete(resultId);
      if (!deletedResult) {
        return res.status(404).json({ message: 'Result not found' });
      }
      res.json({ message: 'Result deleted successfully' });
    } catch (error) {
      console.error('Error deleting result:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

module.exports = deleteResult;
