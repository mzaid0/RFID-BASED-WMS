import { Router } from "express";
import {
  allParcels,
  createParcel,
  deleteParcel,
  singleParcel,
  updateParcel,
  updateParcelStatus,
} from "../controllers/parcel-controller.js";

const router = Router();

router.route("/add").post(createParcel);
router.route("/all").get(allParcels);
router.route("/view/:id").get(singleParcel);
router.route("/edit/:id").put(updateParcel);
router.route("/status/:id").put(updateParcelStatus);
router.route("/delete/:id").delete(deleteParcel);

export default router;
