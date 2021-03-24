module.exports = function(app) {
    require('./auth')(app),
    require('./System/Parameter')(app),
    require('./System/User')(app),
    require('./Company/Branch')(app),
    require('./Company/Customer')(app),
    require('./Company/Employee')(app),
    require('./Product/Product')(app),
    require('./Product/Product_Category')(app),
    require('./MiniMart/Sell_MiniMart')(app)
};
