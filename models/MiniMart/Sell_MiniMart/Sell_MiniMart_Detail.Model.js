const mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const Sell_MiniMart_DetailSchema = new Schema({
    Sell_MiniMart_Header_Code: {
        type: String,
        trim: true,
        required: true
    },
    Product_Code: {
        type: String,
        trim: true,
        required: true
    },
    Product_Name: {
        type: String,
        trim: true
    },
    Product_Category: {
        type: String,
        trim: true
    },
    Product_StockPrice: {
        type: Number
    },
    Product_SalePrice: {
        type: Number
    },
    Product_Discount: {
        type: Number
    },
    Product_Quantity: {
        type: Number
    }
});

Sell_MiniMart_DetailSchema.virtual('Product_CategoryObject', {
    ref: 'Product_Category',
    localField: 'Product_Category',
    foreignField: 'Product_Category_Code',
    justOne: true
});

Sell_MiniMart_DetailSchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
Sell_MiniMart_DetailSchema.plugin(autoIncrement.plugin, 'Sell_MiniMart_Detail');
module.exports = mongoose.model('Sell_MiniMart_Detail', Sell_MiniMart_DetailSchema, 'Sell_MiniMart_Detail');
