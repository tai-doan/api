const mongoose = require('mongoose'),
    slug = require('mongoose-slug-generator'),
    autoIncrement = require('mongoose-auto-increment'),
    mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    Customer_Code: {
        type: String,
        trim: true,
        required: true
    },
    Customer_Name: {
        type: String,
        trim: true,
        required: true
    },
    Customer_Email: {
        type: String,
        trim: true
    },
    Customer_Phone: {
        type: String,
        trim: true
    },
    Customer_Address: {
        type: String,
        trim: true
    },
    Customer_Slug: {
        type: String,
        slug: 'Customer_Name'
    },
    Customer_Description: {
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

CustomerSchema.virtual('CreatedByObject', {
    ref: 'User',
    localField: 'CreatedBy',
    foreignField: 'User_Code',
    justOne: true
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

CustomerSchema.virtual('UpdatedByObject', {
    ref: 'User',
    localField: 'UpdatedBy',
    foreignField: 'User_Code',
    justOne: true
});

CustomerSchema.virtual('StatusObject', {
    ref: 'Parameter',
    localField: 'Status',
    foreignField: 'Parameter_Code',
    justOne: true
});

CustomerSchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
CustomerSchema.plugin(autoIncrement.plugin, 'Customer');
CustomerSchema.plugin(slug);
module.exports = mongoose.model('Customer', CustomerSchema, 'Customer');
