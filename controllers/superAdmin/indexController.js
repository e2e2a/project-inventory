const SITE_TITLE = 'TESDA';
const User = require('../../models/user');
const formRequest = require('../../models/request');
const bcrypt = require('bcrypt')

module.exports.home = async (req, res) => {
    const userId = req.session.login;
    const user = await User.findById(userId);
    const allUserFormRequests = await formRequest.find();
    const userDataPromises = allUserFormRequests
        .map(async (reqForm) => {
            return {
                reqForm: reqForm,
                user: await User.findById(reqForm.userId)
            };
        });
    const allUserData = await Promise.all(userDataPromises);

    
    if (user) {
        res.render('superAdmin/index', {
            site_title: SITE_TITLE,
            title: 'Home',
            messages: req.flash(),
            currentUrl: req.originalUrl,
            userFormRequests: allUserData,
            user: user,
        });
    } else {
        return res.redirect('/login');
    }
}

module.exports.index = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
            const usersData = await User.find()
            if (user.role === 'superAdmin') {
                res.render('superAdmin/users', {
                    site_title: SITE_TITLE,
                    title: 'Users',
                    usersData: usersData,
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

module.exports.create = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
            if (user.role === 'superAdmin') {
                res.render('superAdmin/userCreate', {
                    site_title: SITE_TITLE,
                    title: 'Create',
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

module.exports.doCreate = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
            if (user.role === 'superAdmin') {
                const email = req.body.email;
                const password = req.body.password;
                const confirmPassword = req.body.confirmPassword;
                const existingUser = await User.findOne({ email: email });
                if (existingUser) {
                    req.flash('error', 'Email Already Used!');
                    return res.redirect('/user/create');
                } else {
                    if (password !== confirmPassword) {
                        req.flash('error', 'Password does not match.');
                        return res.redirect('/user/create');
                    }
                    const user = new User({
                        fullname: req.body.fullname,
                        email: req.body.email,
                        contact: req.body.contact,
                        password: req.body.password,
                        role: req.body.role,
                    });
                    await user.save();
                    req.flash('message', 'New user has been created!');
                    return res.redirect(`/users`);
                }
            } else {
                return res.redirect('/404')
            }
        } else {
            return res.redirect('/login')
        }
    } catch (error) {
        console.error('Registration failed:', error);
        return res.status(500).render('500');
    }
}

module.exports.userDelete = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user.role === 'superAdmin') {
            const userIdToDelete = req.body.userId;
            await User.findByIdAndDelete(userIdToDelete);
            req.flash('message', 'User has been deleted.');
            return res.redirect('/users');
        } else {
            return res.status(404).render('400')
        }
    } catch (error) {
        console.error('error:', error);
        return res.status(500).render('500');
    }
}

module.exports.edit = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
            if (user.role === 'superAdmin') {
                const userIdToDisplay = req.params.id;
                const userToDisplay = await User.findById(userIdToDisplay);
                res.render('superAdmin/userEdit', {
                    site_title: SITE_TITLE,
                    title: 'Edit',
                    currentUrl: req.originalUrl,
                    user: user,
                    userToDisplay: userToDisplay,
                });
            } else {
                return res.status(400).render('400');
            }
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('error:', error)
    }
}


module.exports.doEdit = async (req, res) => {
    try {
        const userId = req.session.login;
        const user = await User.findById(userId);
        if (user) {
            const userIdToEdit = req.params.id;
            const userIdToEditEmail = await User.findById(userIdToEdit);
            if (user.role === 'superAdmin') {
                const email = req.body.email
                if (userIdToEditEmail.email === email) {
                    const password = req.body.password;
                    const confirmPassword = req.body.confirmPassword;
                    if (password) {
                        if (password !== confirmPassword) {
                            req.flash('error', 'Password does not match.');
                            return res.redirect(`/user/edit/${userIdToEdit}`);
                        }
                        bcrypt.hash(password, 10, async (error, hash) => {
                            if (error) {
                                console.error("Error hashing password:", error);
                                req.flash('message', 'An error occurred. Please try again.');
                                return res.redirect(`/user/edit/${userIdToEdit}`);
                            }
                            const data = {
                                fullname: req.body.fullname,
                                email: req.body.email,
                                contact: req.body.contact,
                                role: req.body.role,
                                password: hash
                            }
                            User.findByIdAndUpdate(userIdToEdit, data, { new: true })
                                .then((user) => {
                                    req.flash('message', 'User has been updated.');
                                    return res.redirect('/users');
                                })
                                .catch((error) => {
                                    console.error('Error updating data:', error);
                                    req.flash('message', 'Update failed!');
                                    return res.status(500).render('500');
                                });
                        });
                    } else {
                        const data = {
                            fullname: req.body.fullname,
                            email: req.body.email,
                            contact: req.body.contact,
                            role: req.body.role,
                        }
                        User.findByIdAndUpdate(userIdToEdit, data, { new: true })
                            .then((user) => {
                                req.flash('message', 'User has been updated.');
                                return res.redirect('/users');
                            })
                            .catch((error) => {
                                console.error('Error updating data:', error);
                                req.flash('message', 'Update failed!');
                                return res.status(500).render('500');
                            });
                    }
                } else {
                    const existingEmail = await User.findOne({ email: email });
                    if (existingEmail) {
                        req.flash('error', 'Email Already Used!');
                        return res.redirect(`/user/edit/${userIdToEdit}`);
                    } else {
                        const password = req.body.password;
                        const confirmPassword = req.body.confirmPassword;
                        if (password) {
                            if (password !== confirmPassword) {
                                req.flash('error', 'Password does not match.');
                                return res.redirect(`/user/edit/${userIdToEdit}`);
                            }
                            bcrypt.hash(password, 10, async (error, hash) => {
                                if (error) {
                                    console.error("Error hashing password:", error);
                                    req.flash('message', 'An error occurred. Please try again.');
                                    return res.redirect(`/user/edit/${userIdToEdit}`);
                                }
                                const data = {
                                    fullname: req.body.fullname,
                                    email: req.body.email,
                                    contact: req.body.contact,
                                    role: req.body.role,
                                    password: req.body.password
                                }
                                User.findByIdAndUpdate(userIdToEdit, data, { new: true })
                                    .then((user) => {
                                        req.flash('message', 'User has been updated.');
                                        return res.redirect('/users');
                                    })
                                    .catch((error) => {
                                        console.error('Error updating data:', error);
                                        req.flash('message', 'Update failed!');
                                        return res.status(500).render('500');
                                    });
                            });
                        } else {
                            const data = {
                                fullname: req.body.fullname,
                                email: req.body.email,
                                contact: req.body.contact,
                                role: req.body.role,
                            }
                            User.findByIdAndUpdate(userIdToEdit, data, { new: true })
                                .then((user) => {
                                    req.flash('message', 'User has been updated.');
                                    return res.redirect('/users');
                                })
                                .catch((error) => {
                                    console.error('Error updating data:', error);
                                    req.flash('message', 'Update failed!');
                                    return res.status(500).render('500');
                                });
                        }
                    }
                }

            } else {
                return res.status(400).render('400');
            }
        } else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).render('500')
    }

}