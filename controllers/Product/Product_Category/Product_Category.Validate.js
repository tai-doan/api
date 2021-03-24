const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Product_CategoryModel = require('../../../models/Product/Product_Category/Product_Category.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new Product_Category
exports.checkBeforeCreate = async function (model) {
    const Product_CategoryCodeValidateResult = await checkProduct_CategoryCodeValidate(model.Product_Category_Code);
    if (Product_CategoryCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: Product_CategoryCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: Product_CategoryCodeValidateResult.data
        });
    }
};

// Function check validate infomation of Product_Category before update Product_Category
exports.checkBeforeUpdate = async function (model) {
    const Product_CategoryCodeValidateResult = await checkProduct_CategoryValidate(model._id);
    if (Product_CategoryCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: Product_CategoryCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: Product_CategoryCodeValidateResult.data
        });
    }
};

// Function check validate Product_Category before delete Product_Category
exports.checkBeforeDelete = async function (listID) {
    const Product_CategoryCodeValidateResult = await checkListProduct_CategoryValidate(listID);
    if (Product_CategoryCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: Product_CategoryCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: Product_CategoryCodeValidateResult.data
        });
    }
};

// Function check Product_Category Code is exist
const checkProduct_CategoryCodeValidate = code => {
    return new Promise(async resolve => {
        await Product_CategoryModel.findOne({ Product_Category_Code: code }, function (err, doc) {
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

// Function check Product_Category is exist
const checkProduct_CategoryValidate = id => {
    return new Promise(async resolve => {
        await Product_CategoryModel.findOne({ _id: id }, function (err, doc) {
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

// Function check list Product_Category is exist by list Product_Category Id
const checkListProduct_CategoryValidate = list => {
    return new Promise(async resolve => {
        await Product_CategoryModel.find({ _id: { $in: list } }, function (err, doc) {
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
