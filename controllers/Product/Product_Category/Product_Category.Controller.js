const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Method_Common = require('../../../commons/Method_Common'),
    Product_CategorySchema = require('../../../models/Product/Product_Category/Product_Category.Model'),
    Product_CategoryValidate = require('./Product_Category.Validate');

mongoose.Promise = global.Promise;

// Function search Product_Category by search form
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
                path: 'ParentObject',
                select: '_id Product_Category_Name'
            }
        ]),
        lean: true
    };
    const searchModel = req.body.searchModel;
    if (!!searchModel.Product_Category_Code && searchModel.Product_Category_Code.length > 0 && Array.isArray(searchModel.Product_Category_Code)) {
        query.Product_Category_Code = { $in: searchModel.Product_Category_Code };
    }
    if (!!searchModel.Product_Category_Code && !Array.isArray(searchModel.Product_Category_Code)) {
        query.Product_Category_Code = { $regex: new RegExp(searchModel.Product_Category_Code, 'i') };
    }
    if (!!searchModel.Product_Category_Name) {
        querySlug.Product_Category_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(searchModel.Product_Category_Name), 'i') };
    }
    if (!!searchModel.Product_Category_Parent && searchModel.Product_Category_Parent.length > 0 && Array.isArray(searchModel.Product_Category_Parent)) {
        query.Product_Category_Parent = { $in: searchModel.Product_Category_Parent }; // multi field
    }
    if (!!searchModel.Product_Category_Parent && !Array.isArray(searchModel.Product_Category_Parent)) {
        query.Product_Category_Parent = { $regex: new RegExp(searchModel.Product_Category_Parent, 'i') };
    }
    if (!!searchModel.Product_Category_Description && searchModel.Product_Category_Description.length > 0) {
        query.Product_Category_Description = { $regex: new RegExp(searchModel.Product_Category_Description, 'i') };
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

    return Product_CategorySchema.paginate({ $and: [query, querySlug] }, options, function (error, result) {
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

// Function create new or clone a Product_Category by create modal (call in submit Add/Clone components)
exports.createModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await Product_CategoryValidate.checkBeforeCreate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_CODE.DATA_EXIST
        });
    } else {
        const model = new Product_CategorySchema(req.body);
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

// Function update Product_Category by Edit modal (call in submit Edit components)
exports.updateModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await Product_CategoryValidate.checkBeforeUpdate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.ERROR
        });
    } else {
        const query = { _id: req.body._id };
        const queryUpdate = {
            Product_Category_Code: req.body.Product_Category_Code,
            Product_Category_Name: req.body.Product_Category_Name,
            Product_Category_Parent: req.body.Product_Category_Parent,
            Product_Category_Slug: await Method_Common.stringToSlug(req.body.Product_Category_Name),
            Product_Category_Description: req.body.Product_Category_Description,
            Status: req.body.Status,
            UpdatedBy: user.User_Code,
            UpdatedDate: Date.now()
        };
        const newValue = { $set: queryUpdate };
        return Product_CategorySchema.findOneAndUpdate(query, newValue, function (error, result) {
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

// Function delete Product_Category by Product_Category Id
exports.deleteModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    if (!!req.body.listID) {
        const validateResult = await Product_CategoryValidate.checkBeforeDelete(req.body.listID);
        if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: Constant_Common.RESULT_MESSAGE.ERROR
            });
        } else {
            const listDelete = validateResult.data.map(x => x._id);
            return Product_CategorySchema.deleteMany({ _id: { $in: listDelete } }, function (error) {
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

// Function get infomation of Product_Category by Product_Category Id (call in View/Edit/Clone Product_Category)
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

    return Product_CategorySchema.find(query, null, options, function (error, result) {
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

// Function get all Product_Category by Product_Category Code, Product_Category Name (call in autocomplete components)
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
        queryOr1.Product_Category_Code = { $regex: new RegExp(value, 'i') };
        queryOr2.Product_Category_Name = { $regex: new RegExp(value, 'i') };
        queryOr3.Product_Category_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(value), 'i') };
    }
    const { page, limit } = req.body;
    const options = {
        select: '_id Status Product_Category_Code Product_Category_Name Product_Category_SalePrice Product_Category_StockPrice',
        lean: true,
        page,
        limit
    };

    return Product_CategorySchema.paginate({ $and: [queryAnd, { $or: [queryOr1, queryOr2, queryOr3] }] }, options, function (error, result) {
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
