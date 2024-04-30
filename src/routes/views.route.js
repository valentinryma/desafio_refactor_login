const { Router } = require('express');
const router = Router();
const User = require(`${__dirname}/../dao/models/user.model`);
const { userIsLoggedIn, userIsNotLoggedIn } = require(`${__dirname}/../middlewares/auth.middleware.js`);

// Index
router.get('/', (req, res) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user);
    res.render('index', {
        title: 'Home',
        isLoggedIn,
        isNotLoggedIn: !isLoggedIn
    });
})

// Login
router.get('/login', userIsNotLoggedIn, (_, res) => {
    res.render('login', {
        title: 'Login'
    })
})

// Register
router.get('/register', userIsNotLoggedIn, (_, res) => {
    res.render('register', {
        title: 'Register'
    })
})

// Profile
router.get('/profile', userIsLoggedIn, async (req, res) => {
    const idFromSession = req.session.user._id;
    const user = await User.findOne({ _id: idFromSession });

    res.render('profile', {
        title: 'Profile',
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            rol: req.session.user.rol
        }
    })
})

// Products
router.get('/products', userIsLoggedIn, async (req, res) => {
    const productManager = req.app.get('productManager');
    const results = await productManager.getProducts(req.query);

    const idFromSession = req.session.user._id;
    const user = await User.findOne({ _id: idFromSession });

    res.render('products', {
        title: 'Pagina Principal',
        scripts: ['products.js'],
        styles: ['products.css'],
        results,
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            rol: req.session.user.rol
        }
    })
})

// Carts
router.get('/carts/:id', async (req, res) => {
    const cartManager = req.app.get('cartManager');
    const cart = await cartManager.getCartById(req.params.id);
    const calcTotal = (cart) => {
        let total = 0;
        for (const product of cart) {
            total += product._id.price * product.quantity;
        }
        return total.toLocaleString()
    }

    const total = calcTotal(cart.products);
    res.render('cartId', {
        title: 'Cart Buy',
        scripts: ['carts.js'],
        styles: ['carts.css'],
        products: cart.products,
        total,
        cartId: req.params.id
    })
})

module.exports = router;