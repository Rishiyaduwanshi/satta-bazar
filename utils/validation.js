// validation.js
const { z } = require("zod");

const dailyResultSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  game: z
    .string()
    .min(1, "Game is required")
    .refine(val => !val.includes("?"), {
      message: "Game format is invalid",
    }),
});

module.exports = {
  dailyResultSchema,
};
