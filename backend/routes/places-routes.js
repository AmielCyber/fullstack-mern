import express from "express";
import { check } from "express-validator";
// My imports.
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} from "../controllers/places-controllers.js";

// Router to export to register middleware for this path.
const router = express.Router();
// router.httpMethod(path, middleWareFunction, nextMiddleWareFunction...);
// router.httpMethod(path, Array<middleWareFunction>);
// path => /api/places/..

router.get("/user/:uid", getPlacesByUserId);

router.get("/:pid", getPlaceById);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlaceById
);

router.delete("/:pid", deletePlaceById);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

export default router;
