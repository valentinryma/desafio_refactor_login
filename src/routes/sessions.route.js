const { Router } = require('express');
const passport = require('passport');
const router = Router();

// LOGIN / REGISTER - GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }, (req, res) => { }));

// GitHub CallBack
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    // Validamos user || adminCod3r123
    req.user.email === 'adminCoder@coder.com' ? req.user.rol = 'admin' : req.user.rol = 'user';

    // Guardamos el user en la session.
    req.session.user = { email: req.user.email, _id: req.user._id.toString(), rol: req.user.rol }

    res.redirect('/')
});

// REGISTER
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }),
    async (req, res) => {
        res.redirect('/');
    })

router.get('/failregister', (_, res) => {
    res.send('Register failed!');
})

// LOGIN
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
    }

    // Validamos user || adminCod3r123
    req.user.email === 'adminCoder@coder.com' ? req.user.rol = 'admin' : req.user.rol = 'user';

    // Guardamos el user en la session.
    req.session.user = { email: req.user.email, _id: req.user._id.toString(), rol: req.user.rol }
    res.redirect('/products')
})

router.get('/faillogin', (_, res) => {
    res.send('Login failed!');
})

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy((_) => {
        res.redirect('/login');
    });
})
module.exports = router