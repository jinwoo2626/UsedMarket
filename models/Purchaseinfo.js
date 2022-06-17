"use strict";

const mongoose = require("mongoose");

const purchaseinfoSchema = new mongoose.Schema({
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
    user: {     //거래를 진행한 회원 id
        type: String
    },
    money: {    //사용금액
        type: Number
    },
    state:{     //구매 / 판매 구분
        type: String
    },
    date: {type: Date, default: Date.now}   //거래일자
});

module.exports = mongoose.model("Purchaseinfo", purchaseinfoSchema);
