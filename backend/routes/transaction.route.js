import { Router } from "express";
import { addTransaction, getAllTransactions, getTransactionById, updateTransactionById, deleteTransactionById, getCategoryStatistics, getPaymentTypeStatistics, getMonthlyStatistics } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/add", addTransaction);
router.get("/", getAllTransactions);

router.get("/stats/category", getCategoryStatistics);
router.get("/stats/payment-type", getPaymentTypeStatistics);
router.get("/stats/monthly", getMonthlyStatistics);

router.get("/:id", getTransactionById);
router.put("/:id", updateTransactionById);
router.delete("/:id", deleteTransactionById);

export default router;