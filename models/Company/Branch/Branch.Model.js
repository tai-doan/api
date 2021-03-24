const mongoose = require('mongoose'),
    slug = require('mongoose-slug-generator'),
    autoIncrement = require('mongoose-auto-increment'),
    mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const BranchSchema = new Schema({
    Branch_Code: {
        type: String,
        trim: true,
        required: true
    },
    Branch_Name: {
        type: String,
        trim: true,
        required: true
    },
    Branch_Email: {
        type: String,
        trim: true
    },
    Branch_NumberPhone: {
        type: String,
        trim: true
    },
    Branch_Tax: {
        type: String,
        trim: true
    },
    Branch_Fax: {
        type: String,
        trim: true
    },
    Branch_Address: {
        type: String,
        trim: true
    },
    Branch_Slug: {
        type: String,
        slug: 'Branch_Name'
    },
    Branch_Description: {
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

BranchSchema.virtual('CreatedByObject', {
    ref: 'User',
    localField: 'CreatedBy',
    foreignField: 'User_Code',
    justOne: true
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

BranchSchema.virtual('UpdatedByObject', {
    ref: 'User',
    localField: 'UpdatedBy',
    foreignField: 'User_Code',
    justOne: true
});

BranchSchema.virtual('StatusObject', {
    ref: 'Parameter',
    localField: 'Status',
    foreignField: 'Parameter_Code',
    justOne: true
});

BranchSchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
BranchSchema.plugin(autoIncrement.plugin, 'Branch');
BranchSchema.plugin(slug);
module.exports = mongoose.model('Branch', BranchSchema, 'Branch');
