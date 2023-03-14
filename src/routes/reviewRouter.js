import express from "express";
import { validationResult } from "express-validator";
import { reviewService } from "../services";
const reviewRouter = express.Router();

// 리뷰 작성
reviewRouter.post("/review", async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation fail, entered data is incorrect.");
      error.status(400);
      throw error;
    }
    const { user_id, station_id, body } = req.body;
    const newReview = await reviewService.addReview({
      user_id,
      station_id,
      body,
    });
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
});

export { reviewRouter };
