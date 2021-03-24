const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    EmployeeModel = require('../../../models/Company/Employee/Employee.Model');

mongoose.Promise = global.Promise;

// Function check validate information of modal before create new Employee
exports.checkBeforeCreate = async function (model) {
    const EmployeeCodeValidateResult = await checkEmployeeCodeValidate(model.Employee_Code);
    if (EmployeeCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: EmployeeCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: EmployeeCodeValidateResult.data
        });
    }
};

// Function check validate infomation of Employee before update Employee
exports.checkBeforeUpdate = async function (model) {
    const EmployeeCodeValidateResult = await checkEmployeeValidate(model._id);
    if (EmployeeCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: EmployeeCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: EmployeeCodeValidateResult.data
        });
    }
};

// Function check validate Employee before delete Employee
exports.checkBeforeDelete = async function (listID) {
    const EmployeeCodeValidateResult = await checkListEmployeeValidate(listID);
    if (EmployeeCodeValidateResult.returnCode === Constant_Common.RESULT_CODE.SUCCESS) {
        return ({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: EmployeeCodeValidateResult.data
        });
    } else {
        return ({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            data: EmployeeCodeValidateResult.data
        });
    }
};

// Function check Employee Code is exist
const checkEmployeeCodeValidate = code => {
    return new Promise(async resolve => {
        await EmployeeModel.findOne({ Employee_Code: code }, function (err, doc) {
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

// Function check Employee is exist
const checkEmployeeValidate = id => {
    return new Promise(async resolve => {
        await EmployeeModel.findOne({ _id: id }, function (err, doc) {
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

// Function check list Employee is exist by list Employee Id
const checkListEmployeeValidate = list => {
    return new Promise(async resolve => {
        await EmployeeModel.find({ _id: { $in: list } }, function (err, doc) {
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
