const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Sell_MiniMart_HeaderModel = require('../../../models/MiniMart/Sell_MiniMart/Sell_MiniMart_Header.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new Sell_MiniMart_Header
exports.checkBeforeCreate = async function (model) {
    // const Sell_MiniMart_HeaderCodeValidateResult = await checkSell_MiniMart_HeaderCodeValidate(model.Sell_MiniMart_Header_Code);
    // if (Sell_MiniMart_HeaderCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: []//Sell_MiniMart_HeaderCodeValidateResult.data
        });
    // } else {
    //     return ({
    //         returnCode: Constant_Common.RESULT_CODE.ERROR,
    //         data: Sell_MiniMart_HeaderCodeValidateResult.data
    //     });
    // }
};

// Function check validate infomation of Sell_MiniMart_Header before update Sell_MiniMart_Header
exports.checkBeforeUpdate = async function (model) {
    const Sell_MiniMart_HeaderCodeValidateResult = await checkSell_MiniMart_HeaderValidate(model._id);
    if (Sell_MiniMart_HeaderCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: Sell_MiniMart_HeaderCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: Sell_MiniMart_HeaderCodeValidateResult.data
        });
    }
};

exports.checkBeforeCancel = async function (listID){
    const Sell_MiniMart_HeaderValidateResult = await checkListSell_MiniMart_HeaderValidate(listID);
    if (Sell_MiniMart_HeaderValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: Sell_MiniMart_HeaderValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: Sell_MiniMart_HeaderValidateResult.data
        });
    }
}

// Function check validate Sell_MiniMart_Header before delete Sell_MiniMart_Header
exports.checkBeforeDelete = async function (listID) {
    const Sell_MiniMart_HeaderCodeValidateResult = await checkListSell_MiniMart_HeaderValidate(listID);
    if (Sell_MiniMart_HeaderCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: Sell_MiniMart_HeaderCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: Sell_MiniMart_HeaderCodeValidateResult.data
        });
    }
};

// Function check Sell_MiniMart_Header Code is exist
const checkSell_MiniMart_HeaderCodeValidate = code => {
    return new Promise(async resolve => {
        await Sell_MiniMart_HeaderModel.findOne({ Sell_MiniMart_Header_Code: code }, function (err, doc) {
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

// Function check Sell_MiniMart_Header is exist
const checkSell_MiniMart_HeaderValidate = id => {
    return new Promise(async resolve => {
        await Sell_MiniMart_HeaderModel.findOne({ _id: id }, function (err, doc) {
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

// Function check list Sell_MiniMart_Header is exist by list Sell_MiniMart_Header Id
const checkListSell_MiniMart_HeaderValidate = list => {
    return new Promise(async resolve => {
        await Sell_MiniMart_HeaderModel.find({ _id: { $in: list } }, function (err, doc) {
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
