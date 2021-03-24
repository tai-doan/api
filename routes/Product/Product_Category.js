module.exports = function (app) {
    const Product_CategoryHandler = require('../../controllers/Product/Product_Category/Product_Category.Controller');

    app.route('/Product_Category/searchData')
        .post(Product_CategoryHandler.searchData);
    app.route('/Product_Category/createModel')
        .post(Product_CategoryHandler.createModel);
    app.route('/Product_Category/updateModel')
        .post(Product_CategoryHandler.updateModel);
    app.route('/Product_Category/deleteModel')
        .post(Product_CategoryHandler.deleteModel);
    app.route('/Product_Category/getByID/:id')
        .get(Product_CategoryHandler.getByID);
    app.route('/Product_Category/getDataFilter')
        .post(Product_CategoryHandler.getDataFilter);
};
