const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Sell_MiniMart_DetailModel = require('../../../models/MiniMart/Sell_MiniMart/Sell_MiniMart_Detail.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new Sell_MiniMart_Detail
exports.checkBeforeCreate = async function (model) {
    // const Sell_MiniMart_DetailCodeValidateResult = await checkSell_MiniMart_DetailCodeValidate(model.Sell_MiniMart_Detail_Code);
    // if (Sell_MiniMart_DetailCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: []//Sell_MiniMart_DetailCodeValidateResult.data
        });
    // } else {
    //     return ({
    //         returnCode: Constant_Common.RESULT_CODE.ERROR,
    //         data: Sell_MiniMart_DetailCodeValidateResult.data
    //     });
    // }
};

// Function check validate infomation of Sell_MiniMart_Detail before update Sell_MiniMart_Detail
exports.checkBeforeUpdate = async function (model) {
    const Sell_MiniMart_DetailCodeValidateResult = await checkSell_MiniMart_DetailValidate(model._id);
    if (Sell_MiniMart_DetailCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: Sell_MiniMart_DetailCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: Sell_MiniMart_DetailCodeValidateResult.data
        });
    }
};

// Function check validate Sell_MiniMart_Detail before delete Sell_MiniMart_Detail
exports.checkBeforeDelete = async function (listID) {
    const Sell_MiniMart_DetailCodeValidateResult = await checkListSell_MiniMart_DetailValidate(listID);
    if (Sell_MiniMart_DetailCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: Sell_MiniMart_DetailCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: Sell_MiniMart_DetailCodeValidateResult.data
        });
    }
};

// Function check Sell_MiniMart_Detail Code is exist
const checkSell_MiniMart_DetailCodeValidate = code => {
    return new Promise(async resolve => {
        await Sell_MiniMart_DetailModel.findOne({ Sell_MiniMart_Detail_Code: code }, function (err, doc) {
            if (!err && !doc) {
                resolve({
                    returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                    data: doc
                });
            } else {
                resolve({
                    returnCode: Constant_Common.RESULT_CODE.ERROR,
                    data: err
                });
            }
        });
    });
};

// Function check Sell_MiniMart_Detail is exist
const checkSell_MiniMart_DetailValidate = id => {
    return new Promise(async resolve => {
        await Sell_MiniMart_DetailModel.findOne({ _id: id }, function (err, doc) {
            if (!err && !!doc) {
                resolve({
                    returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                    data: doc
                });
            } else {
                resolve({
                    returnCode: Constant_Common.RESULT_CODE.ERROR,
                    data: err
                });
            }
        });
    });
};

// Function check list Sell_MiniMart_Detail is exist by list Sell_MiniMart_Detail Id
const checkListSell_MiniMart_DetailValidate = list => {
    return new Promise(async resolve => {
        await Sell_MiniMart_DetailModel.find({ _id: { $in: list } }, function (err, doc) {
            if (!err && !!doc) {
                resolve({
                    returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                    data: doc
                });
            } else {
                resolve({
                    returnCode: Constant_Common.RESULT_CODE.ERROR,
                    data: err
                });
            }
        });
    });
};
