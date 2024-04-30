const passport = require('passport');
const { Strategy } = require('passport-github2');
const User = require(`${__dirname}/../dao/models/user.model`);
const { clientID, clientSecret, callbackUrl } = require(`${__dirname}/github.private.js`)

const initializeStrategy = () => {
    passport.use('github', new Strategy({
        clientID,
        clientSecret,
        callbackUrl
    },
        async (_accessToken, _refreshToken, profile, done) => {
            const email = profile._json.email;
            const fullName = profile._json.name;
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '));
            const lastName = fullName.substring(fullName.lastIndexOf(' '));

            try {
                // Corroborar existencia del user
                const user = await User.findOne({ email });
                if (user) return done(null, user);

                const newUser = {
                    firstName,
                    lastName,
                    age: 1, // Solicitar edad
                    email,
                    password: '' // Solicirat Pwd
                }

                const result = await User.create(newUser);
                done(null, result);

            } catch (error) {
                console.log('Passport-Github.config ERROR:', error);
                done(error)
            }
        }));

    // Serialize
    passport.serializeUser((user, done) => { done(null, user._id) });

    // Deserialize
    passport.deserializeUser(async (id, done) => {
        const user = await User.findOne({ _id: id });
        done(null, user);
    })
}

module.exports = initializeStrategy;