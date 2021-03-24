const jwt = require('jsonwebtoken'),
    config = require('../../config/database'),
    Constant_Common = require('../../commons/Constant_Common'),
    Method_Common = require('../../commons/Method_Common'),
    UserSchema = require('../../models/System/User/User.Model');

exports.signIn = function (req, res) {
    UserSchema.findOne({
        $or: [
            { User_Code: req.body.username }
        ]
    }, function (error, user) {
        if (error) {
            throw error;
        }
        if (!user) {
            res.status(401).send({ success: false, message: 'Can not get User' });
        } else {
            user.comparePassword(req.body.password, function (error1, result) {
                if (result && !error1) {
                    const payload = {
                        _id: user._id,
                        User_Code: user.User_Code,
                        User_Name: user.User_Name
                    };
                    const token = jwt.sign(payload, config.secret);
                    res.json({ success: true, token });
                } else {
                    res.status(401).send({ success: false, message: 'Wrong password' });
                }
            });
        }

    });
};

exports.signUp = function (req, res) {
    if (!req.body.User_Code || !req.body.User_Password) {
        res.json({ success: false, message: 'Please pass username and password' });
    } else {
        const newUser = new UserSchema(req.body);
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, message: err });
            }
            res.json({ success: true, message: 'Created new user successfully' });
        });
    }
};

exports.getUserAuthorization = async function (req, res) {
    const user = await Method_Common.verifyToken(req.headers.authorization);
    if (user === null || user === undefined) {
        return res.json({
            returnCode: Constant_Common.RESULT_CODE.ERROR,
            result: Constant_Common.RESULT_MESSAGE.PERMISSION
        });
    } else {
        UserSchema.findById(user._id, function (err, result) {
            if (err) {
                return res.status(401).send({ returnCode: Constant_Common.RESULT.ERROR, result: 'Can not get user!!!' });
            } else {
                return res.json({
                    returnCode: Constant_Common.RESULT_CODE.SUCCESS,
                    result
                });
            }
        });
    }
};
