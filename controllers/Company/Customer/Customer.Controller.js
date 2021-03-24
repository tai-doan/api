const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Method_Common = require('../../../commons/Method_Common'),
    CustomerSchema = require('../../../models/Company/Customer/Customer.Model'),
    CustomerValidate = require('./Customer.Validate');

mongoose.Promise = global.Promise;

// Function search Customer by search form
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
            }
        ]),
        lean: true
    };
    const searchModel = req.body.searchModel;
    if (!!searchModel.Customer_Code && searchModel.Customer_Code.length > 0 && Array.isArray(searchModel.Customer_Code)) {
        query.Customer_Code = { $in: searchModel.Customer_Code };
    }
    if (!!searchModel.Customer_Code && !Array.isArray(searchModel.Customer_Code)) {
        query.Customer_Code = { $regex: new RegExp(searchModel.Customer_Code, 'i') };
    }
    if (!!searchModel.Customer_Name) {
        querySlug.Customer_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(searchModel.Customer_Name), 'i') };
    }
    if (!!searchModel.Customer_Email && searchModel.Customer_Email.length > 0) {
        query.Customer_Email = { $regex: new RegExp(searchModel.Customer_Email, 'i') };
    }
    if (!!searchModel.Customer_Phone && searchModel.Customer_Phone.length > 0) {
        query.Customer_Phone = { $regex: new RegExp(searchModel.Customer_Phone, 'i') };
    }
    if (!!searchModel.Customer_Address && searchModel.Customer_Address.length > 0) {
        query.Customer_Address = { $regex: new RegExp(searchModel.Customer_Address, 'i') };
    }
    if (!!searchModel.Customer_Description && searchModel.Customer_Description.length > 0) {
        query.Customer_Description = { $regex: new RegExp(searchModel.Customer_Description, 'i') };
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

    return CustomerSchema.paginate({ $and: [query, querySlug] }, options, function (error, result) {
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

// Function create new or clone a Customer by create modal (call in submit Add/Clone components)
exports.createModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await CustomerValidate.checkBeforeCreate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_CODE.DATA_EXIST
        });
    } else {
        const model = new CustomerSchema(req.body);
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

// Function update Customer by Edit modal (call in submit Edit components)
exports.updateModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await CustomerValidate.checkBeforeUpdate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.ERROR
        });
    } else {
        const query = { _id: req.body._id };
        const queryUpdate = {
            Customer_Code: req.body.Customer_Code,
            Customer_Name: req.body.Customer_Name,
            Customer_Email: req.body.Customer_Email,
            Customer_Phone: req.body.Customer_Phone,
            Customer_Address: req.body.Customer_Address,
            Customer_Slug: await Method_Common.stringToSlug(req.body.Customer_Name),
            Customer_Description: req.body.Customer_Description,
            Status: req.body.Status,
            UpdatedBy: user.User_Code,
            UpdatedDate: Date.now()
        };
        const newValue = { $set: queryUpdate };
        return CustomerSchema.findOneAndUpdate(query, newValue, function (error, result) {
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

// Function delete Customer by Customer Id
exports.deleteModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    if (!!req.body.listID) {
        const validateResult = await CustomerValidate.checkBeforeDelete(req.body.listID);
        if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: Constant_Common.RESULT_MESSAGE.ERROR
            });
        } else {
            const listDelete = validateResult.data.map(x => x._id);
            return CustomerSchema.deleteMany({ _id: { $in: listDelete } }, function (error) {
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

// Function get infomation of Customer by Customer Id (call in View/Edit/Clone Customer)
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

    return CustomerSchema.find(query, null, options, function (error, result) {
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

// Function get all Customer by Customer Code, Customer Name (call in autocomplete components)
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
        queryOr1.Customer_Code = { $regex: new RegExp(value, 'i') };
        queryOr2.Customer_Name = { $regex: new RegExp(value, 'i') };
        queryOr3.Customer_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(value), 'i') };
    }
    const { page, limit } = req.body;
    const options = {
        select: '_id Status Customer_Code Customer_Name',
        lean: true,
        page,
        limit
    };

    return CustomerSchema.paginate({ $and: [queryAnd, { $or: [queryOr1, queryOr2, queryOr3] }] }, options, function (error, result) {
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
