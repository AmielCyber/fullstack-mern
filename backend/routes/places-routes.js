import express from "express";
import { check } from "express-validator";
import fileUpload from "../middleware/file-upload.js";
// My imports.
import checkAuth from "../middleware/check-auth.js";
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
router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlacesByUserId);

// Routers above are open to everyone, but below only to authenticated users with the following MW
// Any route below here are authenticated protected.
router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlaceById
);

router.delete("/:pid", deletePlaceById);

export default router;
