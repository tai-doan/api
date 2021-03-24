module.exports = function (app) {
    const ParameterHandler = require('../../controllers/System/Parameter/Parameter.Controller');

    app.route('/Parameter/searchData')
        .post(ParameterHandler.searchData);
    app.route('/Parameter/createModel')
        .post(ParameterHandler.createModel);
    app.route('/Parameter/updateModel')
        .post(ParameterHandler.updateModel);
    app.route('/Parameter/deleteModel')
        .post(ParameterHandler.deleteModel);
    app.route('/Parameter/getByID/:id')
        .get(ParameterHandler.getByID);
    app.route('/Parameter/getDataFilter')
        .post(ParameterHandler.getDataFilter);
};
