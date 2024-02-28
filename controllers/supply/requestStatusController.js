const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request');

module.exports.index = async (req, res) => {
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
            if (user.role === 'supply') {
                res.render('supply/supplyRequestStatus', {
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

module.exports.cancel = async (req,res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
            const reqFormId = req.body.reqFormId;
            const dataForm = await formRequest.findById(reqFormId)
            const data = {
                remark: dataForm.remarkRG,
                status: 'approved',
                supplyApproved: '',
            }
            formRequest.findByIdAndUpdate(reqFormId, data, { new: true })
                .then((remark) => {
                    req.flash('message', 'Request has been cancelled!');
                    return res.redirect('/users/requests/process');
                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                    req.flash('message', 'Update failed!');
                    return res.status(500).render('500');
                });
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('err:', error);
        return res.status(500).render('500')
    }

}