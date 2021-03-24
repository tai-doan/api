const mongoose = require('mongoose'),
    slug = require('mongoose-slug-generator'),
    autoIncrement = require('mongoose-auto-increment'),
    mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    Product_Code: {
        type: String,
        trim: true,
        required: true
    },
    Product_Name: {
        type: String,
        trim: true,
        required: true
    },
    Product_Slug: {
        type: String,
        slug: 'Product_Name'
    },
    Product_StockPrice: {
        type: Number,
        default: 0
    },
    Product_SalePrice: {
        type: Number,
        default: 0
    },
    Product_Size: {
        type: String,
        trim: true
    },
    Product_Category: {
        type: String,
        trim: true,
        required: false
    },
    Product_Image: {
        type: Array
    },
    Product_Description: {
        type: String
    },
    Product_InfoAdditional: {
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

ProductSchema.virtual('CreatedByObject', {
    ref: 'User',
    localField: 'CreatedBy',
    foreignField: 'User_Code',
    justOne: true
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

ProductSchema.virtual('UpdatedByObject', {
    ref: 'User',
    localField: 'UpdatedBy',
    foreignField: 'User_Code',
    justOne: true
});

ProductSchema.virtual('StatusObject', {
    ref: 'Parameter',
    localField: 'Status',
    foreignField: 'Parameter_Code',
    justOne: true
});

ProductSchema.virtual('Product_CategoryObject', {
    ref: 'Product_Category',
    localField: 'Product_Category',
    foreignField: 'Product_Category_Code',
    justOne: true
});

ProductSchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
ProductSchema.plugin(autoIncrement.plugin, 'Product');
ProductSchema.plugin(slug);
module.exports = mongoose.model('Product', ProductSchema, 'Product');
