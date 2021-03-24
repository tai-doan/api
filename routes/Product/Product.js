module.exports = function (app) {
    const ProductHandler = require('../../controllers/Product/Product/Product.Controller');

    app.route('/Product/searchData')
        .post(ProductHandler.searchData);
    app.route('/Product/createModel')
        .post(ProductHandler.createModel);
    app.route('/Product/updateModel')
        .post(ProductHandler.updateModel);
    app.route('/Product/deleteModel')
        .post(ProductHandler.deleteModel);
    app.route('/Product/getByID/:id')
        .get(ProductHandler.getByID);
    app.route('/Product/getDataFilter')
        .post(ProductHandler.getDataFilter);
};
