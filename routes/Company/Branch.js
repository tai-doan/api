module.exports = function (app) {
    const BranchHandler = require('../../controllers/Company/Branch/Branch.Controller');

    app.route('/Branch/searchData')
        .post(BranchHandler.searchData);
    app.route('/Branch/createModel')
        .post(BranchHandler.createModel);
    app.route('/Branch/updateModel')
        .post(BranchHandler.updateModel);
    app.route('/Branch/deleteModel')
        .post(BranchHandler.deleteModel);
    app.route('/Branch/getByID/:id')
        .get(BranchHandler.getByID);
    app.route('/Branch/getDataFilter')
        .post(BranchHandler.getDataFilter);
};
