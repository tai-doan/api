module.exports = function (app) {
    const UserHandler = require('../../controllers/System/User/User.Controller');

    app.route('/User/searchData')
        .post(UserHandler.searchData);
    app.route('/User/createModel')
        .post(UserHandler.createModel);
    app.route('/User/updateModel')
        .post(UserHandler.updateModel);
    app.route('/User/deleteModel')
        .post(UserHandler.deleteModel);
    app.route('/User/getByID/:id')
        .get(UserHandler.getByID);
    app.route('/User/getDataFilter')
        .post(UserHandler.getDataFilter);
};
