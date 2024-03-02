const SITE_TITLE = 'TESDA';
const User = require('../models/user');

module.exports.index = (req,res) => {
    res.render('login', {
        site_title: SITE_TITLE,
        title: 'Login',
        currentUrl: req.originalUrl,
        messages: req.flash(),
    })
}

module.exports.submit = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    try {
        if(user){
            if(user.role === 'admin'){
                if (!user) {
                    req.flash('error', 'Invalid Email.');
                    return res.status(400).redirect('/login');
                }
        
                user.comparePassword(req.body.password, (error, valid) => {
                    if (error) {
                        return res.status(403).send('Forbidden');
                    }
                    if (!valid) {
                        req.flash('error', 'Password does not match.');
                        return res.status(400).redirect('/login');
                    }
                    req.session.login = user.id;
                    res.redirect('/admin');
                });
            }else if (user.role === 'supply'){
                if (!user) {
                    req.flash('error', 'Invalid Email.');
                    return res.status(400).redirect('/login');
                }
        
                user.comparePassword(req.body.password, (error, valid) => {
                    if (error) {
                        return res.status(403).send('Forbidden');
                    }
                    if (!valid) {
                        req.flash('error', 'Password does not match.');
                        return res.status(400).redirect('/login');
                    }
                    req.session.login = user.id;
                    res.redirect('/supply');
                });
            } else if(user.role === 'member'){
                if (!user) {
                    req.flash('error', 'Invalid Email.');
                    return res.status(400).redirect('/login');
                }
        
                user.comparePassword(req.body.password, (error, valid) => {
                    if (error) {
                        return res.status(403).send('Forbidden');
                    }
                    if (!valid) {
                        req.flash('error', 'Password does not match.');
                        return res.redirect('/login');
                    }
                    req.session.login = user.id;
                    res.redirect('/');
                });
            } else if(user.role === 'superAdmin'){
                if (!user) {
                    req.flash('error', 'Invalid Email.');
                    return res.status(400).redirect('/login');
                }
        
                user.comparePassword(req.body.password, (error, valid) => {
                    if (error) {
                        return res.status(403).send('Forbidden');
                    }
                    if (!valid) {
                        req.flash('error', 'Password does not match.');
                        return res.redirect('/login');
                    }
                    req.session.login = user.id;
                    res.redirect('/superadmin');
                });
            }
        } else{
            req.flash('error', 'Forbidden: Please Contact Us For More Info!');
            return res.redirect('/login');
        }
        
    } catch (error) {
        req.flash('error', 'An error occurred.');
        return res.status(500).render('500',{
            user:user,
        });
    }
}

module.exports.logout = (req, res) => {
    const loginId = req.session.login;
    req.session.destroy((err) => {
        if (err) {
            console.error('error destroying session', err);
        } else {
            console.log('user logout', loginId)
            res.redirect('/login');
        }
    })
}