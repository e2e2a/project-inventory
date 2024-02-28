
const userLoginController = require('../controllers/loginController');
const memberController = require('../controllers/member/memberController');
const memberRequestController = require('../controllers/member/requestController');
const memberRequestStatusController = require('../controllers/member/requestStatusController');
const adminIndexController = require('../controllers/admin/indexController');
const adminRequestStatusController = require('../controllers/admin/requestStatusController');
const supplyIndexController = require('../controllers/supply/indexController');
module.exports = function(app) {
    app.get('/login', userLoginController.index);
    app.post('/login', userLoginController.submit);
    app.post('/logout', userLoginController.logout);
    //member
    app.get('/', memberController.index);
    app.post('/deleteRequest', memberController.requestDelete)
    app.get('/requests', memberRequestStatusController.index)
    //create request
    app.get('/request', memberRequestController.index);
    app.post('/request', memberRequestController.submit);
    app.get('/request/:id', memberRequestController.edit);
    app.post('/request/:id/doEdit', memberRequestController.doEdit);
    //admin
    app.get('/admin', adminIndexController.index)
    app.post('/admin/approved', adminIndexController.approved);
    app.post('/admin/declined', adminIndexController.declined);
    app.get('/users/requests', adminRequestStatusController.index);
    app.post('/admin/cancel', adminRequestStatusController.cancel);
    //supply
    app.get('/supply', supplyIndexController.index);
    app.post('/supply/approved', supplyIndexController.approved);
    app.post('/supply/declined', supplyIndexController.declined);
    // app.get('/users/requests', adminRequestStatusController.index);
    // app.post('/supply/cancel', adminRequestStatusController.cancel);
    //ex
    app.get('/table', (req, res) => {
        res.render('ex/table')
    })
    app.get('/data', (req, res) => {
        res.render('ex/data')
    })
    app.get('/button', (req, res) => {
        res.render('ex/buttons')
    })
    app.get('/icon', (req, res) => {
        res.render('ex/mdi')
    })
    app.get('/ex', (req, res) => {
        res.render('ex/example')
    })
    app.get('/form', (req, res) => {
        res.render('ex/form')
    })
    
    
}
