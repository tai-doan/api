const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    BranchModel = require('../../../models/Company/Branch/Branch.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new Branch
exports.checkBeforeCreate = async function (model) {
    const BranchCodeValidateResult = await checkBranchCodeValidate(model.Branch_Code);
    if (BranchCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: BranchCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: BranchCodeValidateResult.data
        });
    }
};

// Function check validate infomation of Branch before update Branch
exports.checkBeforeUpdate = async function (model) {
    const BranchCodeValidateResult = await checkBranchValidate(model._id);
    if (BranchCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: BranchCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: BranchCodeValidateResult.data
        });
    }
};

// Function check validate Branch before delete Branch
exports.checkBeforeDelete = async function (listID) {
    const BranchCodeValidateResult = await checkListBranchValidate(listID);
    if (BranchCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: BranchCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: BranchCodeValidateResult.data
        });
    }
};

// Function check Branch Code is exist
const checkBranchCodeValidate = code => {
    return new Promise(async resolve => {
        await BranchModel.findOne({ Branch_Code: code }, function (err, doc) {
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

// Function check Branch is exist
const checkBranchValidate = id => {
    return new Promise(async resolve => {
        await BranchModel.findOne({ _id: id }, function (err, doc) {
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

// Function check list Branch is exist by list Branch Id
const checkListBranchValidate = list => {
    return new Promise(async resolve => {
        await BranchModel.find({ _id: { $in: list } }, function (err, doc) {
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
