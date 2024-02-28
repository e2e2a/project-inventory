const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request')

module.exports.index = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
                res.render('member/createReq', {
                    site_tile: SITE_TITLE,
                    title: 'Request',
                    currentUrl: req.originalUrl,
                    user:user,
                })
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500')
    }
}

module.exports.submit = async (req, res) => {
    try {
        const currentDate = new Date();
        const dateCreated = currentDate.toISOString().split('T')[0];
        const userId = req.session.login
        const user = await User.findById(userId)
        if (user) {
            const formData = new formRequest({
                userId: user._id,
                purpose: req.body.purpose,
                dateCreated: dateCreated,
                status: 'pending',
            });
            const savedRequest = await formData.save();
            if (savedRequest) {
                return res.status(200).render('member/createReqSuccess', {
                    currentUrl: req.originalUrl,
                    title: 'Success',
                    site_title:SITE_TITLE,
                    user:user,
                });
            } else {
                req.flash('error', 'Something went wrong!');
                return res.status(500).render('500');
            }

        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500')
    }
}