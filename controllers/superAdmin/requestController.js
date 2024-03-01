const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request');
const remarkBackUp = require('../../models/remark');
module.exports.index = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        const formrequests = await formRequest.find();
        if (user) {
            const AllDataRequestForms = formrequests
                .map(async (reqForm) => {
                    return {
                        reqForm: reqForm,
                        user: await User.findById(reqForm.userId)
                    };
                });

            // Resolve all promises
            const formData = await Promise.all(AllDataRequestForms);
            // This is for the user.login making a request
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
            if (user.role === 'superAdmin') {
                res.render('superAdmin/requestPending', {
                    site_title: SITE_TITLE,
                    title: 'Requests',
                    allFormRequests: formData,
                    messages: req.flash(),
                    currentUrl: req.originalUrl,
                    user: user,
                    userFormRequests: userData,
                });
            } else {
                return res.status(400).render('404')
            }
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500')
    }
}

module.exports.process = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
            const allUserFormRequests = await formRequest.find();
            const userDataPromises = allUserFormRequests
                .map(async (reqForm) => {
                    return {
                        reqForm: reqForm,
                        user: await User.findById(reqForm.userId)
                    };
                });

            // Resolve all promises
            const allUserData = await Promise.all(userDataPromises);
            if (user.role === 'superAdmin') {
                res.render('superAdmin/requestProcess', {
                    site_title: SITE_TITLE,
                    title: 'Requests',
                    userFormRequests:allUserData,
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