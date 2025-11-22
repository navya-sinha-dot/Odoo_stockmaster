import express from "express";
import {
  listLedger,
  groupedMoves,
  getLedgerEntry,
} from "../controllers/ledgecontroller.js";

const router = express.Router();

router.get("/", listLedger);
router.get("/grouped", groupedMoves);
router.get("/:id", getLedgerEntry);

export default router;
