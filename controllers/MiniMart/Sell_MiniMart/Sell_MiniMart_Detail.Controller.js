const mongoose = require('mongoose'),
    Constant_Common = require('../../../commons/Constant_Common'),
    Method_Common = require('../../../commons/Method_Common'),
    Sell_MiniMart_DetailSchema = require('../../../models/MiniMart/Sell_MiniMart/Sell_MiniMart_Detail.Model'),
    Sell_MiniMart_DetailValidate = require('./Sell_MiniMart_Detail.Validate');

mongoose.Promise = global.Promise;

// Function create new or clone a Sell_MiniMart_Detail by create modal (call in submit Add/Clone components)
exports.createModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const validateResult = await Sell_MiniMart_DetailValidate.checkBeforeCreate(req.body);
    if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_CODE.DATA_EXIST
        });
    } else {
        for await (const models of req.body.list) {
            const model = new Sell_MiniMart_DetailSchema(models);
            model._id = null;
            model.save();
        }
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.SUCCESS,
            data: []
        });
    }
};

// Function delete Sell_MiniMart_Detail by Sell_MiniMart_Detail Id
exports.deleteModel = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    if (!!req.body.code) {
        // const validateResult = await Sell_MiniMart_DetailValidate.checkBeforeDelete(req.body.listID);
        // if (validateResult.returnCode !== Constant_Common.RESULT_CODE.SUCCESS) {
        //     return res.json({
        //         returnCode: Constant_Common.RESULT_CODE.ERROR,
        //         message: Constant_Common.RESULT_MESSAGE.ERROR
        //     });
        // } else {
        // const listDelete = validateResult.data.map(x => x._id);
        return Sell_MiniMart_DetailSchema.deleteMany({ Sell_MiniMart_Header_Code: req.body.code }, function (error) {
            if (error) {
                return res.json({
                    returnCode: Constant_Common.RESULT_CODE.ERROR,
                    message: error
                });
            } else {
                return res.json({
                    returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                    data: []// listDelete
                });
            }
        });
        // }
    }
};

// Function get infomation of Sell_MiniMart_Detail by Sell_MiniMart_Detail Id (call in View/Edit/Clone Sell_MiniMart_Detail)
exports.getProductByInvoice = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            message: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    }

    const query = { Sell_MiniMart_Header_Code: req.body.invoice };
    const options = {
        populate: ([
            {
                path: 'Product_CategoryObject',
                select: '_id Product_Category_Name'
            }
        ]),
        lean: true
    };

    return Sell_MiniMart_DetailSchema.find(query, null, options, function (error, result) {
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
