const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request')

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
            if (user.role === 'admin') {
                res.render('admin/index', {
                    site_title: SITE_TITLE,
                    title: 'Home',
                    allFormRequests:formData,
                    messages: req.flash(),
                    currentUrl: req.originalUrl,
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
