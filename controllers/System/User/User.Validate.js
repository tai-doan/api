const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    UserModel = require('../../../models/System/User/User.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new User
exports.checkBeforeCreate = async function (model) {
    const UserCodeValidateResult = await checkUserCodeValidate(model.User_Code);
    if (UserCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: UserCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: UserCodeValidateResult.data
        });
    }
};

// Function check validate infomation of User before update User
exports.checkBeforeUpdate = async function (model) {
    const UserCodeValidateResult = await checkUserValidate(model._id);
    if (UserCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: UserCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: UserCodeValidateResult.data
        });
    }
};

// Function check validate User before delete User
exports.checkBeforeDelete = async function (listID) {
    const UserCodeValidateResult = await checkListUserValidate(listID);
    if (UserCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: UserCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: UserCodeValidateResult.data
        });
    }
};

// Function check User Code is exist
const checkUserCodeValidate = code => {
    return new Promise(async resolve => {
        await UserModel.findOne({ User_Code: code }, function (err, doc) {
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

// Function check User is exist
const checkUserValidate = id => {
    return new Promise(async resolve => {
        await UserModel.findOne({ _id: id }, function (err, doc) {
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

// Function check list User is exist by list User Id
const checkListUserValidate = list => {
    return new Promise(async resolve => {
        await UserModel.find({ _id: { $in: list } }, function (err, doc) {
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
