module.exports = {
    userIsLoggedIn: (req, res, next) => {
        // El usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        if (!isLoggedIn) {
            return res.status(401).json({ error: 'User should be logged in' })
        }
        next()
    },
    userIsNotLoggedIn: (req, res, next) => {
        // El usuario no debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user);
        if (isLoggedIn) {
            return res.status(401).json({ error: 'User should not be logged in' })
        }
        next()
    },
}