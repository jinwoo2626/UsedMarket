"use strict";

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {       //제품명
        type: String,
        required: true,
    },
    category: {   //제품분류
        type: String,
        required: true,
    },
    price: {      //제품가격
        type: String
    },
    explanation: {//제품설명
        type: String
    },
    quantity: {   //제품수량
        type: Number
    },
    username: {   //제품을 등록한 회원명
        type: String
    },
    user: {       //제품을 등록한 회원 id
        type: String
    },
    date: {type: Date, default: Date.now}   //제품 등록일자
});

module.exports = mongoose.model("Product", productSchema);
