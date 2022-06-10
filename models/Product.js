"use strict";

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: String
    },
    explanation: {
        type: String
    },
    quantity: {
        type: Number
    },
    username: {
        type: String
    },
    user: {
        type: String
    },
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Product", productSchema);
