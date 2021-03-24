const mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
    mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const Sell_MiniMart_HeaderSchema = new Schema({
    Sell_MiniMart_Header_Code: {
        type: String,
        trim: true,
        required: true
    },
    Sell_MiniMart_Header_Employee: {
        type: String,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_Date: {
        type: Date,
        trim: true,
        default: Date.now()
    },
    Sell_MiniMart_Header_Customer: {
        type: String,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_DeliveryMethod: {
        type: String,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_TotalQuantity: {
        type: Number,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_TotalSellPrice: {
        type: Number,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_TotalStockPrice: {
        type: Number,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_Discount: {
        type: Number,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_Fee: {
        type: Number,
        trim: true
    },
    Sell_MiniMart_Header_Vat: {
        type: Number,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_TotalPrice: {
        type: Number,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_PaidAmount: {
        type: Number,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_PaidRemain: {
        type: Number,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_PaymentMethod: {
        type: String,
        trim: true,
        require: true
    },
    Sell_MiniMart_Header_Note: {
        type: String,
        trim: true
    },
    Sell_MiniMart_Header_Description: {
        type: String
    },
    CreatedDate: {
        type: Date,
        default: Date.now()
    },
    CreatedBy: {
        type: String,
        trim: true
    },
    UpdatedDate: {
        type: Date,
        default: Date.now()
    },
    UpdatedBy: {
        type: String,
        trim: true
    },
    Status: {
        type: String,
        trim: true
    }
});

Sell_MiniMart_HeaderSchema.virtual('CreatedByObject', {
    ref: 'User',
    localField: 'CreatedBy',
    foreignField: 'User_Code',
    justOne: true
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

Sell_MiniMart_HeaderSchema.virtual('UpdatedByObject', {
    ref: 'User',
    localField: 'UpdatedBy',
    foreignField: 'User_Code',
    justOne: true
});

Sell_MiniMart_HeaderSchema.virtual('StatusObject', {
    ref: 'Parameter',
    localField: 'Status',
    foreignField: 'Parameter_Code',
    justOne: true
});

Sell_MiniMart_HeaderSchema.virtual('EmployeeObject', {
    ref: 'Employee',
    localField: 'Sell_MiniMart_Header_Employee',
    foreignField: 'Employee_Code',
    justOne: true
});

Sell_MiniMart_HeaderSchema.virtual('CustomerObject', {
    ref: 'Customer',
    localField: 'Sell_MiniMart_Header_Customer',
    foreignField: 'Customer_Code',
    justOne: true
});

Sell_MiniMart_HeaderSchema.virtual('DeliveryObject', {
    ref: 'Parameter',
    localField: 'Sell_MiniMart_Header_DeliveryMethod',
    foreignField: 'Parameter_Code',
    justOne: true
});

Sell_MiniMart_HeaderSchema.virtual('PaymentObject', {
    ref: 'Parameter',
    localField: 'Sell_MiniMart_Header_PaymentMethod',
    foreignField: 'Parameter_Code',
    justOne: true
});

Sell_MiniMart_HeaderSchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
Sell_MiniMart_HeaderSchema.plugin(autoIncrement.plugin, 'Sell_MiniMart_Header');
module.exports = mongoose.model('Sell_MiniMart_Header', Sell_MiniMart_HeaderSchema, 'Sell_MiniMart_Header');
