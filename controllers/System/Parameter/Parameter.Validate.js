const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    ParameterModel = require('../../../models/System/Parameter/Parameter.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new Parameter
exports.checkBeforeCreate = async function (model) {
    const ParameterCodeValidateResult = await checkParameterCodeValidate(model.Parameter_Code);
    if (ParameterCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: ParameterCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: ParameterCodeValidateResult.data
        });
    }
};

// Function check validate infomation of Parameter before update Parameter
exports.checkBeforeUpdate = async function (model) {
    const ParameterCodeValidateResult = await checkParameterValidate(model._id);
    if (ParameterCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: ParameterCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: ParameterCodeValidateResult.data
        });
    }
};

// Function check validate Parameter before delete Parameter
exports.checkBeforeDelete = async function (listID) {
    const ParameterCodeValidateResult = await checkListParameterValidate(listID);
    if (ParameterCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: ParameterCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: ParameterCodeValidateResult.data
        });
    }
};

// Function check Parameter Code is exist
const checkParameterCodeValidate = code => {
    return new Promise(async resolve => {
        await ParameterModel.findOne({ Parameter_Code: code }, function (err, doc) {
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

// Function check Parameter is exist
const checkParameterValidate = id => {
    return new Promise(async resolve => {
        await ParameterModel.findOne({ _id: id }, function (err, doc) {
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

// Function check list Parameter is exist by list Parameter Id
const checkListParameterValidate = list => {
    return new Promise(async resolve => {
        await ParameterModel.find({ _id: { $in: list } }, function (err, doc) {
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
