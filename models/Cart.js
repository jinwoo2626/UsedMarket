"use strict";

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String
    },
    quantity: {
        type: Number
    },
    user: {
        type: String
    },
    productid: {
        type: String
    }
});

module.exports = mongoose.model("Cart", cartSchema);
