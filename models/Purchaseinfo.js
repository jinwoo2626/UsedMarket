"use strict";

const mongoose = require("mongoose");

const purchaseinfoSchema = new mongoose.Schema({
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
    money: {
        type: Number
    },
    state:{
        type: String
    },
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Purchaseinfo", purchaseinfoSchema);
