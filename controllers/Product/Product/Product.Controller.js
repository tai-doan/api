const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Method_Common = require('../../../commons/Method_Common'),
    ProductSchema = require('../../../models/Product/Product/Product.Model'),
    ProductValidate = require('./Product.Validate');

mongoose.Promise = global.Promise;

// Function search Product by search form
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
                path: 'Product_CategoryObject',
                select: '_id Product_Category_Name'
            }
        ]),
        lean: true
    };
    const searchModel = req.body.searchModel;
    if (!!searchModel.Product_Code && searchModel.Product_Code.length > 0 && Array.isArray(searchModel.Product_Code)) {
        query.Product_Code = { $in: searchModel.Product_Code };
    }
    if (!!searchModel.Product_Code && !Array.isArray(searchModel.Product_Code)) {
        query.Product_Code = { $regex: new RegExp(searchModel.Product_Code, 'i') };
    }
    if (!!searchModel.Product_Name) {
        querySlug.Product_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(searchModel.Product_Name), 'i') };
    }
    if (!!searchModel.Product_StockPrice) {
        query.Product_StockPrice = { $lte: searchModel.Product_StockPrice };
    }
    if (!!searchModel.Product_SalePrice) {
        query.Product_SalePrice = { $lte: searchModel.Product_SalePrice };
    }
    if (!!searchModel.Product_Size && searchModel.Product_Size.length > 0 && Array.isArray(searchModel.Product_Size)) {
        query.Product_Size = { $in: searchModel.Product_Size }; // multi field
    }
    if (!!searchModel.Product_Size && !Array.isArray(searchModel.Product_Size)) {
        query.Product_Size = { $regex: new RegExp(searchModel.Product_Size, 'i') };
    }
    if (!!searchModel.Product_Category && searchModel.Product_Category.length > 0 && Array.isArray(searchModel.Product_Category)) {
        query.Product_Category = { $in: searchModel.Product_Category }; // multi field
    }
    if (!!searchModel.Product_Category && !Array.isArray(searchModel.Product_Category)) {
        query.Product_Category = { $regex: new RegExp(searchModel.Product_Category, 'i') };
    }
    if (!!searchModel.Product_Description && searchModel.Product_Description.length > 0) {
        query.Product_Description = { $regex: new RegExp(searchModel.Product_Description, 'i') };
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

    return ProductSchema.paginate({ $and: [query, querySlug] }, options, function (error, result) {
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

// Function create new or clone a Product by create modal (call in submit Add/Clone components)
exports.createModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await ProductValidate.checkBeforeCreate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_CODE.DATA_EXIST
        });
    } else {
        const model = new ProductSchema(req.body);
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

// Function update Product by Edit modal (call in submit Edit components)
exports.updateModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await ProductValidate.checkBeforeUpdate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.ERROR
        });
    } else {
        const query = { _id: req.body._id };
        const queryUpdate = {
            Product_Code: req.body.Product_Code,
            Product_Name: req.body.Product_Name,
            Product_Slug: await Method_Common.stringToSlug(req.body.Product_Name),
            Product_StockPrice: req.body.Product_StockPrice,
            Product_SalePrice: req.body.Product_SalePrice,
            Product_Size: req.body.Product_Size,
            Product_Category: req.body.Product_Category,
            Product_Image: req.body.Product_Image,
            Product_Description: req.body.Product_Description,
            Product_InfoAdditional: req.body.Product_InfoAdditional,
            Status: req.body.Status,
            UpdatedBy: user.User_Code,
            UpdatedDate: Date.now()
        };
        const newValue = { $set: queryUpdate };
        return ProductSchema.findOneAndUpdate(query, newValue, function (error, result) {
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

// Function delete Product by Product Id
exports.deleteModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    if (!!req.body.listID) {
        const validateResult = await ProductValidate.checkBeforeDelete(req.body.listID);
        if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
            return res.json({
                returnCode: Constant_Common.RESULT_CODE.ERROR,
                message: Constant_Common.RESULT_MESSAGE.ERROR
            });
        } else {
            const listDelete = validateResult.data.map(x => x._id);
            return ProductSchema.deleteMany({ _id: { $in: listDelete } }, function (error) {
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

// Function get infomation of Product by Product Id (call in View/Edit/Clone Product)
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
            // { path: 'CreatedByObject', select: '_id User_Name' },
            // { path: 'UpdatedByObject', select: '_id User_Name' },
            { path: 'Product_CategoryObject', select: '_id Product_Category_Name' }
        ]),
        lean: true
    };

    return ProductSchema.find(query, null, options, function (error, result) {
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

// Function get all Product by Product Code, Product Name (call in autocomplete components)
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
        queryOr1.Product_Code = { $regex: new RegExp(value, 'i') };
        queryOr2.Product_Name = { $regex: new RegExp(value, 'i') };
        queryOr3.Product_Slug = { $regex: new RegExp(await Method_Common.stringToSlug(value), 'i') };
    }
    const { page, limit } = req.body;
    const options = {
        select: '_id Status Product_Code Product_Name Product_SalePrice Product_StockPrice',
        lean: true,
        page,
        limit
    };

    return ProductSchema.paginate({ $and: [queryAnd, { $or: [queryOr1, queryOr2, queryOr3] }] }, options, function (error, result) {
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
