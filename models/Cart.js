"use strict";

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    name: {     //제품명
        type: String,
        required: true,
    },
    price: {    //제품가격
        type: String
    },
    quantity: { //제품수량
        type: Number
    },
    user: {     //장바구니에 담은 유저정보
        type: String
    },
    productid: {//장바구니에 담긴 제품의 id정보
        type: String
    }
});

module.exports = mongoose.model("Cart", cartSchema);
