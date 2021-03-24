const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    ProductModel = require('../../../models/Product/Product/Product.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new Product
exports.checkBeforeCreate = async function (model) {
    const ProductCodeValidateResult = await checkProductCodeValidate(model.Product_Code);
    if (ProductCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: ProductCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: ProductCodeValidateResult.data
        });
    }
};

// Function check validate infomation of Product before update Product
exports.checkBeforeUpdate = async function (model) {
    const ProductCodeValidateResult = await checkProductValidate(model._id);
    if (ProductCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: ProductCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: ProductCodeValidateResult.data
        });
    }
};

// Function check validate Product before delete Product
exports.checkBeforeDelete = async function (listID) {
    const ProductCodeValidateResult = await checkListProductValidate(listID);
    if (ProductCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: ProductCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: ProductCodeValidateResult.data
        });
    }
};

// Function check Product Code is exist
const checkProductCodeValidate = code => {
    return new Promise(async resolve => {
        await ProductModel.findOne({ Product_Code: code }, function (err, doc) {
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

// Function check Product is exist
const checkProductValidate = id => {
    return new Promise(async resolve => {
        await ProductModel.findOne({ _id: id }, function (err, doc) {
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

// Function check list Product is exist by list Product Id
const checkListProductValidate = list => {
    return new Promise(async resolve => {
        await ProductModel.find({ _id: { $in: list } }, function (err, doc) {
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
