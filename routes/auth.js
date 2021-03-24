module.exports = function(app) {
    const Auth_Handler = require('../controllers/Auth/auth.Controller');
    app.route('/Authentication/signIn')
        .post(Auth_Handler.signIn);
    app.route('/Authentication/signUp')
        .post(Auth_Handler.signUp);
    app.route('/Authentication/getUserAuthorization')
        .post(Auth_Handler.getUserAuthorization);
};
