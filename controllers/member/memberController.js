const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request')

module.exports.index = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
            const userFormRequests = await formRequest.find({ userId: userId });
            const userDataPromises = userFormRequests
                .map(async (reqForm) => {
                    return {
                        reqForm: reqForm,
                        user: await User.findById(reqForm.userId)
                    };
                });

            // Resolve all promises
            const userData = await Promise.all(userDataPromises);
            if (user.role === 'member') {
                res.render('member/index', {
                    site_title: SITE_TITLE,
                    title: 'Home',
                    userFormRequests: userData,
                    messages: req.flash(),
                    currentUrl: req.originalUrl,
                    user: user,
                });
            } else {
                return res.render('404')
            }
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500')
    }
}

module.exports.requestDelete = async (req, res) => {
    try {
        const reqId = req.body.reqId;
        const user = await User.findById(req.session.login);
        if (user) {
            await formRequest.findByIdAndDelete(reqId)
            req.flash('message', 'Request Form has been deleted!');
            if (user.role === 'admin') {
                return res.redirect('/admin');
            } else if (user.role === 'member') {
                return res.redirect('/');
            } else if (user.role === 'supply') {
                return res.redirect('/supply');
            } else if (user.role === 'superAdmin') {
                return res.redirect('/requests/pending');
            }
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500');
    }
}