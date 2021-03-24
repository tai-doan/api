module.exports = function (app) {
    const Sell_MiniMart_HeaderHandler = require('../../controllers/MiniMart/Sell_MiniMart/Sell_MiniMart_Header.Controller');

    app.route('/Sell_MiniMart/searchData')
        .post(Sell_MiniMart_HeaderHandler.searchData);
    app.route('/Sell_MiniMart/createModel')
        .post(Sell_MiniMart_HeaderHandler.createModel);
    app.route('/Sell_MiniMart/updateModel')
        .post(Sell_MiniMart_HeaderHandler.updateModel);
    app.route('/Sell_MiniMart/cancelModel')
        .post(Sell_MiniMart_HeaderHandler.cancelModel);
    app.route('/Sell_MiniMart/deleteModel')
        .post(Sell_MiniMart_HeaderHandler.deleteModel);
    app.route('/Sell_MiniMart/getByID/:id')
        .get(Sell_MiniMart_HeaderHandler.getByID);
    app.route('/Sell_MiniMart/getDataFilter')
        .post(Sell_MiniMart_HeaderHandler.getDataFilter);

    const Sell_MiniMart_DetailHandler = require('../../controllers/MiniMart/Sell_MiniMart/Sell_MiniMart_Detail.Controller');
    app.route('/Sell_MiniMart_Detail/createModel')
        .post(Sell_MiniMart_DetailHandler.createModel);
    app.route('/Sell_MiniMart_Detail/deleteModel')
        .post(Sell_MiniMart_DetailHandler.deleteModel);
    app.route('/Sell_MiniMart_Detail/getProductByInvoice')
        .post(Sell_MiniMart_DetailHandler.getProductByInvoice);
};
