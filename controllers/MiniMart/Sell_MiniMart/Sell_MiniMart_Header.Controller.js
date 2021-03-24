const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Method_Common = require('../../../commons/Method_Common'),
    Sell_MiniMart_HeaderSchema = require('../../../models/MiniMart/Sell_MiniMart/Sell_MiniMart_Header.Model'),
    Sell_MiniMart_HeaderValidate = require('./Sell_MiniMart_Header.Validate');

mongoose.Promise = global.Promise;

// Function search Sell_MiniMart_Header by search form
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
                path: 'EmployeeObject',
                select: '_id Employee_Name'
            },
            {
                path: 'CustomerObject',
                select: '_id Customer_Name'
            },
            {
                path: 'DeliveryObject',
                select: '_id Parameter_Name'
            },
            {
                path: 'PaymentObject',
                select: '_id Parameter_Name'
            }
        ]),
        lean: true
    };
    const searchModel = req.body.searchModel;
    if (!!searchModel.Sell_MiniMart_Header_Code && searchModel.Sell_MiniMart_Header_Code.length > 0 && Array.isArray(searchModel.Sell_MiniMart_Header_Code)) {
        query.Sell_MiniMart_Header_Code = { $in: searchModel.Sell_MiniMart_Header_Code };
    }
    if (!!searchModel.Sell_MiniMart_Header_Code && !Array.isArray(searchModel.Sell_MiniMart_Header_Code)) {
        query.Sell_MiniMart_Header_Code = { $regex: new RegExp(searchModel.Sell_MiniMart_Header_Code, 'i') };
    }
    if (!!searchModel.Sell_MiniMart_Header_Date && searchModel.Sell_MiniMart_Header_Date.length === 2) {
        const dateFrom = new Date(searchModel.Sell_MiniMart_Header_Date[0]);
        const startDate = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0);
        const dateTo = new Date(searchModel.Sell_MiniMart_Header_Date[1]);
        const endDate = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59);
        query.Sell_MiniMart_Header_Date = { $gte: startDate, $lte: endDate };
    }
    if (!!searchModel.Sell_MiniMart_Header_Employee && searchModel.Sell_MiniMart_Header_Employee.length > 0 && Array.isArray(searchModel.Sell_MiniMart_Header_Employee)) {
        query.Sell_MiniMart_Header_Employee = { $in: searchModel.Sell_MiniMart_Header_Employee }; // multi field
    }
    if (!!searchModel.Sell_MiniMart_Header_Employee && !Array.isArray(searchModel.Sell_MiniMart_Header_Employee)) {
        query.Sell_MiniMart_Header_Employee = { $regex: new RegExp(searchModel.Sell_MiniMart_Header_Employee, 'i') };
    }
    if (!!searchModel.Sell_MiniMart_Header_Customer && searchModel.Sell_MiniMart_Header_Customer.length > 0 && Array.isArray(searchModel.Sell_MiniMart_Header_Customer)) {
        query.Sell_MiniMart_Header_Customer = { $in: searchModel.Sell_MiniMart_Header_Customer }; // multi field
    }
    if (!!searchModel.Sell_MiniMart_Header_Customer && !Array.isArray(searchModel.Sell_MiniMart_Header_Customer)) {
        query.Sell_MiniMart_Header_Customer = { $regex: new RegExp(searchModel.Sell_MiniMart_Header_Customer, 'i') };
    }
    if (!!searchModel.Sell_MiniMart_Header_DeliveryMethod && searchModel.Sell_MiniMart_Header_DeliveryMethod.length > 0 && Array.isArray(searchModel.Sell_MiniMart_Header_DeliveryMethod)) {
        query.Sell_MiniMart_Header_DeliveryMethod = { $in: searchModel.Sell_MiniMart_Header_DeliveryMethod }; // multi field
    }
    if (!!searchModel.Sell_MiniMart_Header_TotalQuantity) {
        query.Sell_MiniMart_Header_TotalQuantity = { $lte: searchModel.Sell_MiniMart_Header_TotalQuantity };
    }
    if (!!searchModel.Sell_MiniMart_Header_TotalStockPrice) {
        query.Sell_MiniMart_Header_TotalStockPrice = { $lte: searchModel.Sell_MiniMart_Header_TotalStockPrice };
    }
    if (!!searchModel.Sell_MiniMart_Header_TotalSellPrice) {
        query.Sell_MiniMart_Header_TotalSellPrice = { $lte: searchModel.Sell_MiniMart_Header_TotalSellPrice };
    }
    if (!!searchModel.Sell_MiniMart_Header_Discount) {
        query.Sell_MiniMart_Header_Discount = { $lte: searchModel.Sell_MiniMart_Header_Discount };
    }
    if (!!searchModel.Sell_MiniMart_Header_Fee) {
        query.Sell_MiniMart_Header_Fee = { $lte: searchModel.Sell_MiniMart_Header_Fee };
    }
    if (!!searchModel.Sell_MiniMart_Header_Vat) {
        query.Sell_MiniMart_Header_Vat = { $regex: new RegExp(searchModel.Sell_MiniMart_Header_Vat, 'i') };
    }
    if (!!searchModel.Sell_MiniMart_Header_PaidAmount) {
        query.Sell_MiniMart_Header_PaidAmount = { $lte: searchModel.Sell_MiniMart_Header_PaidAmount };
    }
    if (!!searchModel.Sell_MiniMart_Header_PaidRemain) {
        query.Sell_MiniMart_Header_PaidRemain = { $lte: searchModel.Sell_MiniMart_Header_PaidRemain };
    }
    if (!!searchModel.Sell_MiniMart_Header_PaymentMethod && searchModel.Sell_MiniMart_Header_PaymentMethod.length > 0 && Array.isArray(searchModel.Sell_MiniMart_Header_PaymentMethod)) {
        query.Sell_MiniMart_Header_PaymentMethod = { $in: searchModel.Sell_MiniMart_Header_PaymentMethod }; // multi field
    }
    if (!!searchModel.Sell_MiniMart_Header_PaymentMethod && searchModel.Sell_MiniMart_Header_PaymentMethod.length > 0 && !Array.isArray(searchModel.Sell_MiniMart_Header_PaymentMethod)) {
        query.Sell_MiniMart_Header_PaymentMethod = { $regex: new RegExp(searchModel.Sell_MiniMart_Header_PaymentMethod, 'i') };
    }
    if (!!searchModel.Sell_MiniMart_Header_Note && searchModel.Sell_MiniMart_Header_Note.length > 0) {
        query.Sell_MiniMart_Header_Note = { $regex: new RegExp(searchModel.Sell_MiniMart_Header_Note, 'i') };
    }
    if (!!searchModel.CreatedBy && searchModel.CreatedBy.length > 0) {
        query.CreateddBy = { $regex: new RegExp(searchModel.CreatedBy, 'i') };
    }
    if (!!searchModel.UpdatedBy && searchModel.UpdatedBy.length > 0) {
        query.UpdatedBy = { $regex: new RegExp(searchModel.UpdatedBy, 'i') };
    }
    if (!!searchModel.Status && searchModel.Status.length > 0 && Array.isArray(searchModel.Status)) {
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

    return Sell_MiniMart_HeaderSchema.paginate({ $and: [query, querySlug] }, options, function (error, result) {
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

// Function create new or clone a Sell_MiniMart_Header by create modal (call in submit Add/Clone components)
exports.createModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await Sell_MiniMart_HeaderValidate.checkBeforeCreate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_CODE.DATA_EXIST
        });
    } else {
        const model = new Sell_MiniMart_HeaderSchema(req.body);
        const id = await Sell_MiniMart_HeaderSchema.countDocuments({}).exec();
        model._id = null;
        model.Sell_MiniMart_Header_Code = await Method_Common.autoGenerationCode('HDSM', id);
        model.Sell_MiniMart_Header_Date = Date.now();
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

// Function update Sell_MiniMart_Header by Edit modal (call in submit Edit components)
exports.updateModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await Sell_MiniMart_HeaderValidate.checkBeforeUpdate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.ERROR
        });
    } else {
        const query = { _id: req.body._id };
        const queryUpdate = {
            Sell_MiniMart_Header_Code: req.body.Sell_MiniMart_Header_Code,
            Sell_MiniMart_Header_Employee: req.body.Sell_MiniMart_Header_Employee,
            Sell_MiniMart_Header_Customer: req.body.Sell_MiniMart_Header_Customer,
            Sell_MiniMart_Header_DeliveryMethod: req.body.Sell_MiniMart_Header_DeliveryMethod,
            Sell_MiniMart_Header_TotalQuantity: req.body.Sell_MiniMart_Header_TotalQuantity,
            Sell_MiniMart_Header_TotalSellPrice: req.body.Sell_MiniMart_Header_TotalSellPrice,
            Sell_MiniMart_Header_TotalStockPrice: req.body.Sell_MiniMart_Header_TotalStockPrice,
            Sell_MiniMart_Header_Discount: req.body.Sell_MiniMart_Header_Discount,
            Sell_MiniMart_Header_Fee: req.body.Sell_MiniMart_Header_Fee,
            Sell_MiniMart_Header_Vat: req.body.Sell_MiniMart_Header_Vat,
            Sell_MiniMart_Header_TotalPrice: req.body.Sell_MiniMart_Header_TotalPrice,
            Sell_MiniMart_Header_PaidAmount: req.body.Sell_MiniMart_Header_PaidAmount,
            Sell_MiniMart_Header_PaidRemain: req.body.Sell_MiniMart_Header_PaidRemain,
            Sell_MiniMart_Header_PaymentMethod: req.body.Sell_MiniMart_Header_PaymentMethod,
            Sell_MiniMart_Header_Note: req.body.Sell_MiniMart_Header_Note,
            Status: req.body.Status,
            UpdatedBy: user.User_Code,
            UpdatedDate: Date.now()
        };
        const newValue = { $set: queryUpdate };
        return Sell_MiniMart_HeaderSchema.findOneAndUpdate(query, newValue, function (error, result) {
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

exports.cancelModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    if (!!req.body.listID) {
        const validateResult = await Sell_MiniMart_HeaderValidate.checkBeforeCancel(req.body.listID);
        if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: Constant_Common.RESULT_MESSAGE.ERROR
            });
        } else {
            const listCancel = validateResult.data.map(x => x._id);
            return Sell_MiniMart_HeaderSchema.updateMany({ _id: { $in: listCancel } }, { Status: 'cancel' }, null, function (error, result) {
                if (error) {
                    return res.json({
                        returnCode: Constant_Common.RESULT_CODE.ERROR,
                        message: error
                    });
                } else {
                    return res.json({
                        returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                        data: listCancel
                    });
                }
            });
        }
    }
}

// Function delete Sell_MiniMart_Header by Sell_MiniMart_Header Id
exports.deleteModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    if (!!req.body.listID) {
        const validateResult = await Sell_MiniMart_HeaderValidate.checkBeforeDelete(req.body.listID);
        if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: Constant_Common.RESULT_MESSAGE.ERROR
            });
        } else {
            const listDelete = validateResult.data.map(x => x._id);
            return Sell_MiniMart_HeaderSchema.deleteMany({ _id: { $in: listDelete } }, function (error) {
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

// Function get infomation of Sell_MiniMart_Header by Sell_MiniMart_Header Id (call in View/Edit/Clone Sell_MiniMart_Header)
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

    return Sell_MiniMart_HeaderSchema.find(query, null, options, function (error, result) {
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

// Function get all Sell_MiniMart_Header by Sell_MiniMart_Header Code, Sell_MiniMart_Header Name (call in autocomplete components)
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
        queryOr1.Sell_MiniMart_Header_Code = { $regex: new RegExp(value, 'i') };
        queryOr2.Sell_MiniMart_Header_Name = { $regex: new RegExp(value, 'i') };
        queryOr3.Sell_MiniMart_Header_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(value), 'i') };
    }
    const { page, limit } = req.body;
    const options = {
        select: '_id Status Sell_MiniMart_Header_Code Sell_MiniMart_Header_Employee Sell_MiniMart_Header_Date',
        lean: true,
        page,
        limit
    };

    return Sell_MiniMart_HeaderSchema.paginate({ $and: [queryAnd, { $or: [queryOr1, queryOr2, queryOr3] }] }, options, function (error, result) {
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
