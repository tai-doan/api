const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Method_Common = require('../../../commons/Method_Common'),
    ParameterSchema = require('../../../models/System/Parameter/Parameter.Model'),
    ParameterValidate = require('./Parameter.Validate');

mongoose.Promise = global.Promise;

// Function search Parameter by search form
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
    if (!!searchModel.Parameter_Code && searchModel.Parameter_Code.length > 0 && Array.isArray(searchModel.Parameter_Code)) {
        query.Parameter_Code = { $in: searchModel.Parameter_Code };
    }
    if (!!searchModel.Parameter_Code && !Array.isArray(searchModel.Parameter_Code)) {
        query.Parameter_Code = { $regex: new RegExp(searchModel.Parameter_Code, 'i') };
    }
    if (!!searchModel.Parameter_Name) {
        querySlug.Parameter_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(searchModel.Parameter_Name), 'i') };
    }
    if (!!searchModel.Parameter_Type) {
        querySlug.Parameter_Type = { $regex: new RegExp(searchModel.Parameter_Type, 'i') };
    }
    if (!!searchModel.Parameter_Description && searchModel.Parameter_Description.length > 0) {
        query.Parameter_Description = { $regex: new RegExp(searchModel.Parameter_Description, 'i') };
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

    return ParameterSchema.paginate({ $and: [query, querySlug] }, options, function (error, result) {
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

// Function create new or clone a Parameter by create modal (call in submit Add/Clone components)
exports.createModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await ParameterValidate.checkBeforeCreate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_CODE.DATA_EXIST
        });
    } else {
        const model = new ParameterSchema(req.body);
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

// Function update Parameter by Edit modal (call in submit Edit components)
exports.updateModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await ParameterValidate.checkBeforeUpdate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.ERROR
        });
    } else {
        const query = { _id: req.body._id };
        const queryUpdate = {
            Parameter_Code: req.body.Parameter_Code,
            Parameter_Name: req.body.Parameter_Name,
            Parameter_Type: req.body.Parameter_Type,
            Parameter_Slug: await Method_Common.stringToSlug(req.body.Parameter_Name),
            Parameter_Description: req.body.Parameter_Description,
            Status: req.body.Status,
            UpdatedBy: user.User_Code,
            UpdatedDate: Date.now()
        };
        const newValue = { $set: queryUpdate };
        return ParameterSchema.findOneAndUpdate(query, newValue, function (error, result) {
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

// Function delete Parameter by Parameter Id
exports.deleteModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    if (!!req.body.listID) {
        const validateResult = await ParameterValidate.checkBeforeDelete(req.body.listID);
        if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: Constant_Common.RESULT_MESSAGE.ERROR
            });
        } else {
            const listDelete = validateResult.data.map(x => x._id);
            return ParameterSchema.deleteMany({ _id: { $in: listDelete } }, function (error) {
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

// Function get infomation of Parameter by Parameter Id (call in View/Edit/Clone Parameter)
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

    return ParameterSchema.find(query, null, options, function (error, result) {
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

// Function get all Parameter by Parameter Code, Parameter Name (call in autocomplete components)
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
    if (!!searchModel.type) {
        queryAnd.Parameter_Type = searchModel.type;
    }
    if (!!searchModel.value) {
        const value = searchModel.value;
        queryOr1.Parameter_Code = { $regex: new RegExp(value, 'i') };
        queryOr2.Parameter_Name = { $regex: new RegExp(value, 'i') };
        queryOr3.Parameter_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(value), 'i') };
    }
    const { page, limit } = req.body;
    const options = {
        select: '_id Status Parameter_Code Parameter_Name',
        lean: true,
        page,
        limit
    };

    return ParameterSchema.paginate({ $and: [queryAnd, { $or: [queryOr1, queryOr2, queryOr3] }] }, options, function (error, result) {
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
