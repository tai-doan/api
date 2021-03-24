const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Method_Common = require('../../../commons/Method_Common'),
    EmployeeSchema = require('../../../models/Company/Employee/Employee.Model'),
    EmployeeValidate = require('./Employee.Validate');

mongoose.Promise = global.Promise;

// Function search Employee by search form
exports.searchData = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const query = {};
    const querySlug = {};
    const { page, limit, sortAsc, sortFields } = req.body.searchOption;

    // Create sort
    const sorts = await Method_Common.createSorting(sortFields, sortAsc ? 1 : -1);
    const options = {
        page,
        limit,
        sort: sorts,
        populate: ([
            {
                path: 'CreatedByObject',
                select: '_id User_Name'
            },
            {
                path: 'UpdatedByObject',
                select: '_id User_Name'
            },
            {
                path: 'StatusObject',
                select: '_id Parameter_Name'
            },
            {
                path: 'BranchObject',
                select: '_id Branch_Name'
            }
        ]),
        lean: true
    };
    const searchModel = req.body.searchModel;
    if (!!searchModel.Employee_Code && searchModel.Employee_Code.length > 0 && Array.isArray(searchModel.Employee_Code)) {
        query.Employee_Code = { $in: searchModel.Employee_Code };
    }
    if (!!searchModel.Employee_Code && !Array.isArray(searchModel.Employee_Code)) {
        query.Employee_Code = { $regex: new RegExp(searchModel.Employee_Code, 'i') };
    }
    if (!!searchModel.Employee_Name) {
        querySlug.Employee_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(searchModel.Employee_Name), 'i') };
    }
    if (!!searchModel.Employee_Branch && searchModel.Employee_Branch.length > 0 && Array.isArray(searchModel.Employee_Branch)) {
        query.Employee_Branch = { $in: searchModel.Employee_Branch }; // multi field
    }
    if (!!searchModel.Employee_Branch && !Array.isArray(searchModel.Employee_Branch)) {
        query.Employee_Branch = { $regex: new RegExp(searchModel.Employee_Branch, 'i') };
    }
    if (!!searchModel.Employee_Email && searchModel.Employee_Email.length > 0) {
        query.Employee_Email = { $regex: new RegExp(searchModel.Employee_Email, 'i') };
    }
    if (!!searchModel.Employee_NumberPhone && searchModel.Employee_NumberPhone.length > 0) {
        query.Employee_NumberPhone = { $regex: new RegExp(searchModel.Employee_NumberPhone, 'i') };
    }
    if (!!searchModel.Employee_Passport && searchModel.Employee_Passport.length > 0) {
        query.Employee_Passport = { $regex: new RegExp(searchModel.Employee_Passport, 'i') };
    }
    if (!!searchModel.Employee_BirthDay && searchModel.Employee_BirthDay.length === 2) {
        const dateFrom = new Date(searchModel.Employee_BirthDay[0]);
        const startDate = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0);
        const dateTo = new Date(searchModel.Employee_BirthDay[1]);
        const endDate = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59);
        query.Employee_BirthDay = { $gte: startDate, $lte: endDate };
    }
    if (!!searchModel.Employee_Address && searchModel.Employee_Address.length > 0) {
        query.Employee_Address = { $regex: new RegExp(searchModel.Employee_Address, 'i') };
    }
    if (!!searchModel.Employee_Description && searchModel.Employee_Description.length > 0) {
        query.Employee_Description = { $regex: new RegExp(searchModel.Employee_Description, 'i') };
    }
    if (!!searchModel.CreatedBy && searchModel.CreatedBy.length > 0) {
        query.CreateddBy = { $regex: new RegExp(searchModel.CreatedBy, 'i') };
    }
    if (!!searchModel.UpdatedBy && searchModel.UpdatedBy.length > 0) {
        query.UpdatedBy = { $regex: new RegExp(searchModel.UpdatedBy, 'i') };
    }
    if (!!searchModel.Status && searchModel.Status.length > 0) {
        query.Status = { $in: searchModel.Status }; // multi field
    }
    if (!!searchModel.CreatedDate && searchModel.CreatedDate.length === 2) {
        const dateFrom = new Date(searchModel.CreatedDate[0]);
        const startDate = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0);
        const dateTo = new Date(searchModel.CreatedDate[1]);
        const endDate = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59);
        query.CreatedDate = { $gte: startDate, $lte: endDate };
    }
    if (!!searchModel.UpdatedDate && searchModel.UpdatedDate.length === 2) {
        const dateFrom = new Date(searchModel.UpdatedDate[0]);
        const startDate = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0);
        const dateTo = new Date(searchModel.UpdatedDate[1]);
        const endDate = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59);
        query.UpdatedDate = { $gte: startDate, $lte: endDate };
    }

    return EmployeeSchema.paginate({ $and: [query, querySlug] }, options, function (error, result) {
        if (!error) {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                data: result
            });
        } else {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: Constant_Common.RESULT_MESSAGE.ERROR
            });
        }
    });
};

// Function create new or clone a Employee by create modal (call in submit Add/Clone components)
exports.createModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await EmployeeValidate.checkBeforeCreate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_CODE.DATA_EXIST
        });
    } else {
        const model = new EmployeeSchema(req.body);
        model._id = null;
        model.CreatedBy = user.User_Code;
        model.CreatedDate = Date.now();
        return model.save(function (error, result) {
            if (error) {
                return res.status(400).send({
                    returnCode: Constant_Common.RESULT_CODE.ERROR,
                    message: error
                });
            } else {
                return res.json({
                    returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                    data: result
                });
            }
        });
    }
};

// Function update Employee by Edit modal (call in submit Edit components)
exports.updateModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await EmployeeValidate.checkBeforeUpdate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.ERROR
        });
    } else {
        const query = { _id: req.body._id };
        const queryUpdate = {
            Employee_Code: req.body.Employee_Code,
            Employee_Name: req.body.Employee_Name,
            Employee_Branch: req.body.Employee_Branch,
            Employee_Email: req.body.Employee_Email,
            Employee_NumberPhone: req.body.Employee_NumberPhone,
            Employee_Passport: req.body.Employee_Passport,
            Employee_BirthDay: req.body.Employee_BirthDay,
            Employee_Address: req.body.Employee_Address,
            Employee_Slug: await Method_Common.stringToSlug(req.body.Employee_Name),
            Employee_Description: req.body.Employee_Description,
            Status: req.body.Status,
            UpdatedBy: user.User_Code,
            UpdatedDate: Date.now()
        };
        const newValue = { $set: queryUpdate };
        return EmployeeSchema.findOneAndUpdate(query, newValue, function (error, result) {
            if (error) {
                return res.status(400).send({
                    returnCode: Constant_Common.RESULT_CODE.ERROR,
                    message: error
                });
            } else {
                return res.json({
                    returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                    data: result
                });
            }
        });
    }
};

// Function delete Employee by Employee Id
exports.deleteModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    if (!!req.body.listID) {
        const validateResult = await EmployeeValidate.checkBeforeDelete(req.body.listID);
        if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: Constant_Common.RESULT_MESSAGE.ERROR
            });
        } else {
            const listDelete = validateResult.data.map(x => x._id);
            return EmployeeSchema.deleteMany({ _id: { $in: listDelete } }, function (error) {
                if (error) {
                    return res.json({
                        returnCode: Constant_Common.RESULT_CODE.ERROR,
                        message: error
                    });
                } else {
                    return res.json({
                        returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                        data: listDelete
                    });
                }
            });
        }
    }
};

// Function get infomation of Employee by Employee Id (call in View/Edit/Clone Employee)
exports.getByID = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const query = { _id: !!req.params.id ? req.params.id : 0 };
    const options = {
        populate: ([
            { path: 'CreatedByObject', select: '_id User_Name' },
            { path: 'UpdatedByObject', select: '_id User_Name' }
        ]),
        lean: true
    };

    return EmployeeSchema.find(query, null, options, function (error, result) {
        if (error) {
            return res.status(400).send({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: error
            });
        } else {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                data: result
            });
        }
    });
};

// Function get all Employee by Employee Code, Employee Name (call in autocomplete components)
exports.getDataFilter = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const queryOr1 = {};
    const queryOr2 = {};
    const queryOr3 = {};
    const queryAnd = {};
    const searchModel = req.body.searchModel;
    if (!!searchModel.Status) {
        queryAnd.Status = searchModel.Status;
    }
    if (!!searchModel.value) {
        const value = searchModel.value;
        queryOr1.Employee_Code = { $regex: new RegExp(value, 'i') };
        queryOr2.Employee_Name = { $regex: new RegExp(value, 'i') };
        queryOr3.Employee_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(value), 'i') };
    }
    const { page, limit } = req.body;
    const options = {
        select: '_id Status Employee_Code Employee_Name Employee_SalePrice Employee_StockPrice',
        lean: true,
        page,
        limit
    };

    return EmployeeSchema.paginate({ $and: [queryAnd, { $or: [queryOr1, queryOr2, queryOr3] }] }, options, function (error, result) {
        if (error) {
            return res.status(400).send({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: error
            });
        }
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: result
        });
    });
};
