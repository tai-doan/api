const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new Schema({
    User_Code: {
        type: String,
        trim: true,
        required: true
    },
    User_Name: {
        type: String,
        trim: true,
        required: true
    },
    User_Email: {
        type: String,
        required: true,
        trim: true
    },
    User_Password: {
        type: String,
        required: true,
        trim: true
    },
    User_Employee: {
        type: String,
        required: true,
        trim: true
    },
    User_NumberPhone: {
        type: String,
        trim: true
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
        type: Date
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

UserSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('User_Password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.User_Password, salt, null, function (err1, hash) {
                if (err1) {
                    return next(err1);
                }
                user.User_Password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.User_Password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.pre('findOneAndUpdate', function (next) {
    const password = this.getUpdate().$set.User_Password;
    if (!password) {
        return next();
    }
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        this.getUpdate().$set.User_Password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.virtual('CreatedByObject', {
    ref: 'User',
    localField: 'CreatedBy',
    foreignField: 'User_Code',
    justOne: true
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

UserSchema.virtual('UpdatedByObject', {
    ref: 'User',
    localField: 'UpdatedBy',
    foreignField: 'User_Code',
    justOne: true
});

UserSchema.virtual('StatusObject', {
    ref: 'Parameter',
    localField: 'Status',
    foreignField: 'Parameter_Code',
    justOne: true
});

UserSchema.virtual('EmployeeObject', {
    ref: 'Employee',
    localField: 'User_Employee',
    foreignField: 'Employee_Code',
    justOne: true
});

UserSchema.plugin(mongoosePaginate);
autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, 'User');
module.exports = mongoose.model('User', UserSchema, 'User');
