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
                    user:user,
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

module.exports.approved = async(req,res)=> {
    
    const userId = req.session.login;
    const user = await User.findById(userId);
    const currentDate = new Date();
    const dateCreated = currentDate.toISOString().split('T')[0];
    if(user){
        const reqFormId = req.body.reqFormId;
        const remark = {
            remark: req.body.remark,
            status: 'approved',
            adminApproved:dateCreated,
        }
        formRequest.findByIdAndUpdate(reqFormId, remark, { new: true })
        .then((remark) => {
            req.flash('message', 'Approved Success!');
            return res.redirect('/admin');
            
        })
        .catch((error) => {
            console.error('Error updating data:', error);
            req.flash('message', 'Update failed!');
            return res.status(500).render('500');
        });
    }
}
