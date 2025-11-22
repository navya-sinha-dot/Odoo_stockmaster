import express from "express";
import {
  listLedger,
  groupedMoves,
  getLedgerEntry,
} from "../controllers/ledgecontroller.js";

const router = express.Router();

router.get("/", listLedger); // list raw ledger entries (filterable)
router.get("/grouped", groupedMoves); // grouped by reference (list view)
router.get("/:id", getLedgerEntry); // single entry

export default router;
