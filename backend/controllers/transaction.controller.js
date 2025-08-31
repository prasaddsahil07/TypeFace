import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// add a new transaction
export const addTransaction = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { description, paymentType, category, amount, location, date } = req.body;

        if (!description || !paymentType || !category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required except location" });
        }

        // check is amount is a number
        if (isNaN(amount)) {
            return res.status(400).json({ message: "Amount should be a number" });
        }

        // check is date is a valid date
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // check is user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // create a new transaction
        const newTransaction = await Transaction.create({
            userId,
            description,
            paymentType,
            category,
            amount,
            location,
            date
        });

        if (!newTransaction) {
            return res.status(500).json({ message: "Unable to add a new transaction" });
        }

        res.status(201).json({ message: "New transaction added successfully", data: newTransaction });
    } catch (error) {
        console.log("Error while adding a new transaction: ", error);
        res.status(500).json({ message: "Internal server error while adding a new transaction" });
    }
}


// get all transactions of a user using pagination
export const getAllTransactions = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find({ userId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (!transactions) {
            return res.status(404).json({ message: "No transactions found" });
        }

        res.status(200).json({ message: "Transactions fetched successfully", data: transactions });
    } catch (error) {
        console.log("Error while fetching all transactions: ", error);
        res.status(500).json({ message: "Internal server error while fetching all transactions" });
    }
}


// get a single transaction by id
export const getTransactionById = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Transaction id is required" });
        }

        const transaction = await Transaction.findOne({ _id: id, userId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction fetched successfully", data: transaction });
    } catch (error) {
        console.log("Error while fetching a transaction by id: ", error);
        res.status(500).json({ message: "Internal server error while fetching a transaction by id" });
    }
}

// update a transaction by id
export const updateTransactionById = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const { description, paymentType, category, amount, location, date } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Transaction id is required" });
        }

        // check if amount is a number if present
        if (amount && isNaN(amount)) {
            return res.status(400).json({ message: "Amount should be a number" });
        }

        // check if date is a valid date if present
        if (date && isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const updateFields = {};
        if (description) updateFields.description = description;
        if (paymentType) updateFields.paymentType = paymentType;
        if (category) updateFields.category = category;
        if (amount) updateFields.amount = amount;
        if (location) updateFields.location = location;
        if (date) updateFields.date = date;

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: id, userId },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found or unable to update" });
        }

        res.status(200).json({ message: "Transaction updated successfully", data: updatedTransaction });
    } catch (error) {
        console.log("Error while updating a transaction by id: ", error);
        res.status(500).json({ message: "Internal server error while updating a transaction by id" });
    }
}

// delete a transaction by id
export const deleteTransactionById = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Transaction id is required" });
        }
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, userId });
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found or unable to delete" });
        }
        res.status(200).json({ message: "Transaction deleted successfully", data: deletedTransaction });
    } catch (error) {
        console.log("Error while deleting a transaction by id: ", error);
        res.status(500).json({ message: "Internal server error while deleting a transaction by id" });
    }
}


// category statistics of transactions
export const getCategoryStatistics = async (req, res) => {
    try {
        const userId = req.user?._id;
        const stats = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$category", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);
        res.status(200).json({ message: "Category statistics fetched successfully", data: stats });
    } catch (error) {
        console.log("Error while fetching category statistics: ", error);
        res.status(500).json({ message: "Internal server error while fetching category statistics" });
    }
}


// paymentType statistics of transactions
export const getPaymentTypeStatistics = async (req, res) => {
    try {
        const userId = req.user?._id;
        const stats = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$paymentType", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);
        res.status(200).json({ message: "Payment type statistics fetched successfully", data: stats });
    } catch (error) {
        console.log("Error while fetching payment type statistics: ", error);
        res.status(500).json({ message: "Internal server error while fetching payment type statistics" });
    }
}


// monthly statistics of transactions
export const getMonthlyStatistics = async (req, res) => {
    try {
        const userId = req.user?._id;
        const stats = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);
        res.status(200).json({ message: "Monthly statistics fetched successfully", data: stats });
    } catch (error) {
        console.log("Error while fetching monthly statistics: ", error);
        res.status(500).json({ message: "Internal server error while fetching monthly statistics" });
    }
}