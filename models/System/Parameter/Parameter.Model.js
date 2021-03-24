const mongoose = require('mongoose'),
    slug = require('mongoose-slug-generator'),
    autoIncrement = require('mongoose-auto-increment'),
    mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const ParameterSchema = new Schema({
    Parameter_Code: {
        type: String,
        trim: true,
        required: true
    },
    Parameter_Name: {
        type: String,
        trim: true,
        required: true
    },
    Parameter_Type: {
        type: String,
        trim: true,
        required: true
    },
    Parameter_Slug: {
        type: String,
        slug: 'Parameter_Name'
    },
    Parameter_Description: {
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

ParameterSchema.virtual('CreatedByObject', {
    ref: 'User',
    localField: 'CreatedBy',
    foreignField: 'User_Code',
    justOne: true
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

ParameterSchema.virtual('UpdatedByObject', {
    ref: 'User',
    localField: 'UpdatedBy',
    foreignField: 'User_Code',
    justOne: true
});

ParameterSchema.virtual('StatusObject', {
    ref: 'Parameter',
    localField: 'Status',
    foreignField: 'Parameter_Code',
    justOne: true
});

ParameterSchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
ParameterSchema.plugin(autoIncrement.plugin, 'Parameter');
ParameterSchema.plugin(slug);
module.exports = mongoose.model('Parameter', ParameterSchema, 'Parameter');
