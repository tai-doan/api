module.exports = function (app) {
    const EmployeeHandler = require('../../controllers/Company/Employee/Employee.Controller');

    app.route('/Employee/searchData')
        .post(EmployeeHandler.searchData);
    app.route('/Employee/createModel')
        .post(EmployeeHandler.createModel);
    app.route('/Employee/updateModel')
        .post(EmployeeHandler.updateModel);
    app.route('/Employee/deleteModel')
        .post(EmployeeHandler.deleteModel);
    app.route('/Employee/getByID/:id')
        .get(EmployeeHandler.getByID);
    app.route('/Employee/getDataFilter')
        .post(EmployeeHandler.getDataFilter);
};
