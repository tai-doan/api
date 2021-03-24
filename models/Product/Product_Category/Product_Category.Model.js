const mongoose = require('mongoose'),
    slug = require('mongoose-slug-generator'),
    autoIncrement = require('mongoose-auto-increment'),
    mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const Product_CategorySchema = new Schema({
    Product_Category_Code: {
        type: String,
        trim: true,
        required: true
    },
    Product_Category_Name: {
        type: String,
        trim: true,
        required: true
    },
    Product_Category_Parent: {
        type: String,
        trim: true
    },
    Product_Category_Slug: {
        type: String,
        slug: 'Product_Category_Name'
    },
    Product_Category_Description: {
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

Product_CategorySchema.virtual('CreatedByObject', {
    ref: 'User',
    localField: 'CreatedBy',
    foreignField: 'User_Code',
    justOne: true
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

Product_CategorySchema.virtual('UpdatedByObject', {
    ref: 'User',
    localField: 'UpdatedBy',
    foreignField: 'User_Code',
    justOne: true
});

Product_CategorySchema.virtual('StatusObject', {
    ref: 'Parameter',
    localField: 'Status',
    foreignField: 'Parameter_Code',
    justOne: true
});

Product_CategorySchema.virtual('ParentObject', {
    ref: 'Product_Category',
    localField: 'Product_Category_Parent',
    foreignField: 'Product_Category_Code',
    justOne: true
});

Product_CategorySchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
Product_CategorySchema.plugin(autoIncrement.plugin, 'Product_Category');
Product_CategorySchema.plugin(slug);
module.exports = mongoose.model('Product_Category', Product_CategorySchema, 'Product_Category');
