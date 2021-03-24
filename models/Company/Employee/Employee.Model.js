const mongoose = require('mongoose'),
    slug = require('mongoose-slug-generator'),
    autoIncrement = require('mongoose-auto-increment'),
    mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    Employee_Code: {
        type: String,
        trim: true,
        required: true
    },
    Employee_Name: {
        type: String,
        trim: true,
        required: true
    },
    Employee_Branch: {
        type: String,
        trim: true
    },
    Employee_Email: {
        type: String,
        trim: true
    },
    Employee_NumberPhone: {
        type: String,
        trim: true
    },
    Employee_Passport: {
        type: String,
        trim: true
    },
    Employee_BirthDay: {
        type: String,
        trim: true
    },
    Employee_Address: {
        type: String,
        trim: true
    },
    Employee_Slug: {
        type: String,
        slug: 'Employee_Name'
    },
    Employee_Description: {
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

EmployeeSchema.virtual('CreatedByObject', {
    ref: 'User',
    localField: 'CreatedBy',
    foreignField: 'User_Code',
    justOne: true
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

EmployeeSchema.virtual('UpdatedByObject', {
    ref: 'User',
    localField: 'UpdatedBy',
    foreignField: 'User_Code',
    justOne: true
});

EmployeeSchema.virtual('StatusObject', {
    ref: 'Parameter',
    localField: 'Status',
    foreignField: 'Parameter_Code',
    justOne: true
});

EmployeeSchema.virtual('BranchObject', {
    ref: 'Branch',
    localField: 'Employee_Branch',
    foreignField: 'Branch_Code',
    justOne: true
});

EmployeeSchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
EmployeeSchema.plugin(autoIncrement.plugin, 'Employee');
EmployeeSchema.plugin(slug);
module.exports = mongoose.model('Employee', EmployeeSchema, 'Employee');
