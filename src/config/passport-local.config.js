const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require(`${__dirname}/../dao/models/user.model`);
const { hashPassword, isValidPassword } = require(`${__dirname}/../utils/hashing.js`);

const initializeStrategy = () => {
    // REGISTER
    passport.use('register', new Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { firstName, lastName, age } = req.body;

        try {
            // Verificamos si el user ya existe.
            const user = await User.findOne({ email: username });
            if (user) {
                return done(null, user)
            }

            // Objeto new User
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                age: +age,
                email: username,
                password: hashPassword(password)
            }

            // Creamos el usuario en cuestion.
            const result = await User.create(newUser);
            return done(null, result);

        } catch (err) {
            return done(err);
        }
    }));

    // LOGIN
    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        if (!username || !password) {
            return done(null, false);
        }

        try {
            // Verificar que exista el user.
            const user = await User.findOne({ email: username });
            if (!user) {
                return done(null, false);
            }

            // Validar password
            if (!isValidPassword(password, user.password)) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }

    }));

    // ---- [ Serialize & Deserialize ] ----
    // Guarda el id para generar una session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    // req.user
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user)
    })
}

module.exports = initializeStrategy;