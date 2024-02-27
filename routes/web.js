
const userLoginController = require('../controllers/loginController');
const memberController = require('../controllers/member/memberController');
const memberRequestController = require('../controllers/member/requestController');
const memberRequestStatusController = require('../controllers/member/requestStatusController');
const adminIndexController = require('../controllers/admin/indexController');
module.exports = function(app) {
    app.get('/login', userLoginController.index);
    app.post('/login', userLoginController.submit);
    app.post('/logout', userLoginController.logout);
    //member
    app.get('/', memberController.index);
    app.post('/deleteRequest', memberController.requestDelete)
    //create template
    app.get('/requests', memberRequestStatusController.index)
    app.get('/request', memberRequestController.index);
    app.post('/request', memberRequestController.submit)
    //admin
    app.get('/admin', adminIndexController.index)


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
