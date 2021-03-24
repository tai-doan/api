module.exports = function (app) {
    const CustomerHandler = require('../../controllers/Company/Customer/Customer.Controller');

    app.route('/Customer/searchData')
        .post(CustomerHandler.searchData);
    app.route('/Customer/createModel')
        .post(CustomerHandler.createModel);
    app.route('/Customer/updateModel')
        .post(CustomerHandler.updateModel);
    app.route('/Customer/deleteModel')
        .post(CustomerHandler.deleteModel);
    app.route('/Customer/getByID/:id')
        .get(CustomerHandler.getByID);
    app.route('/Customer/getDataFilter')
        .post(CustomerHandler.getDataFilter);
};
