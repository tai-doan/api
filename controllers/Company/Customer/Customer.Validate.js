const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    CustomerModel = require('../../../models/Company/Customer/Customer.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new Customer
exports.checkBeforeCreate = async function (model) {
    const CustomerCodeValidateResult = await checkCustomerCodeValidate(model.Customer_Code);
    if (CustomerCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: CustomerCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: CustomerCodeValidateResult.data
        });
    }
};

// Function check validate infomation of Customer before update Customer
exports.checkBeforeUpdate = async function (model) {
    const CustomerCodeValidateResult = await checkCustomerValidate(model._id);
    if (CustomerCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: CustomerCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: CustomerCodeValidateResult.data
        });
    }
};

// Function check validate Customer before delete Customer
exports.checkBeforeDelete = async function (listID) {
    const CustomerCodeValidateResult = await checkListCustomerValidate(listID);
    if (CustomerCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: CustomerCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: CustomerCodeValidateResult.data
        });
    }
};

// Function check Customer Code is exist
const checkCustomerCodeValidate = code => {
    return new Promise(async resolve => {
        await CustomerModel.findOne({ Customer_Code: code }, function (err, doc) {
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

// Function check Customer is exist
const checkCustomerValidate = id => {
    return new Promise(async resolve => {
        await CustomerModel.findOne({ _id: id }, function (err, doc) {
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

// Function check list Customer is exist by list Customer Id
const checkListCustomerValidate = list => {
    return new Promise(async resolve => {
        await CustomerModel.find({ _id: { $in: list } }, function (err, doc) {
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
