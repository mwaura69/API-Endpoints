import express from 'express'
import bcrypt from 'bcrypt'
import { Users } from '../DataModel/userModel.js'
import { Orders } from '../DataModel/orderModel.js'
import { Products } from '../DataModel/productModel.js'
import { Carts } from '../DataModel/cartModel.js'


const router = express.Router();

//signup user
router.post('/users/signup', async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).send('Input required fields!')
        }
            const { name, email, password,  } = req.body;
            const existingUser = await Users.findOne({"email":email });
            if (existingUser) {
            return res.status(409).json({ message: 'Email is already in use.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const accountDetails = {
                name,
                email,
                password: hashedPassword
            };
        const newUser = await Users.create(accountDetails);
        return res.status(200).send('Account successfully created')
        //return res.status(200).json(details)
    } catch (err) {
        return res.status(501).send('Account creation failed')
    }
});


//login user
router.get('/users/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await Users.findOne({email})
        if(!user) {
            return res.status(400).send({ message: 'User not found!'})
        }
        const isPassValid = bcrypt.compare(password, user.password);
        if(!isPassValid) {
            return res.status(401).send({ message: 'password invalid'})
        }
        const token = jwt.sign({
            id: Users.id
        }, config.secret, {
        expiresIn: '24h'
        });
        req.session.user = Users;
    // After successful authentication
        return res.status(200).json({
        message: 'Logged in successfully',
        user: Users,
        token
        });
    } catch (err) { 
        return res.status(501).send('Error getting account details')
    }
    
});

//buyer's account creation
router.post('/user/buyer/signup', async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).send('Input required fields!')
        }
            const { name, email, password,  } = req.body;
            const existingUser = await Users.findOne({"email":email });
            if (existingUser) {
            return res.status(409).json({ message: 'Email is already in use.' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const accountDetails = {
                name,
                email,
                password: hashedPassword,
                phone,
                country,
            };
        const newUser = await Users.create(accountDetails);
        return res.status(200).send('Account successfully created')
        //return res.status(200).json(details)
    } catch (err) {
        return res.status(501).send('Account creation failed')
    }
});


//getting buyers details
router.get('/user/buyer/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await Users.findOne({email})
        if(!user) {
            return res.status(400).send({ message: 'User not found!'})
        }
        const isPassValid = bcrypt.compare(password, user.password);
        if(!isPassValid) {
            return res.status(401).send({ message: 'password invalid'})
        }
        const token = jwt.sign({
            id: Users.id
        }, config.secret, {
        expiresIn: '24h'
        });
        req.session.user = Users;
    // After successful authentication
        return res.status(200).json({
        message: 'Logged in successfully',
        user: Users,
        token
        });
    } catch (err) { 
        return res.status(501).send('Error getting account details')
    }
    
});


//after approval from main account he becomes admin
router.post('/users/buyer/priviledges/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { isAdmin } = req.body
        const gettingPriviledges = {
            isAdmin
        }
        const user = await Users.findByIdAndUpdate(id, gettingPriviledges, {new: true})
        if(!user) {
            return res.status(501).send('No users found!!')
        }
        return res.status(200).send('Shipment details created')
    } catch(err) {
        return res.status(501).send(err, 'error creating shipping address')
    }
});

//user details for easier logistics
router.post('/users/shippingdetails/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { street, apartment, city, zip, country, phone } = req.body
        const shipDetails = {
            street,
            apartment,
            city,
            zip,
            country,
            phone
        }
        const user = await Users.findByIdAndUpdate(id, shipDetails, {new: true})
        if(!user) {
            return res.status(501).send('No users found!!')
        }
        return res.status(200).send('Shipment details created')
    } catch(err) {
        return res.status(501).send(err, 'error creating shipping address')
    }
});


//adding the cart items, shipping address, city, zip, country phone, totalPrice for delivery address
router.post('/orders/create', async (req, res) => {
    try {
        const {orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone, status, totalPrice, user } = req.body
        const OrderInput = {
            orderItems, 
            shippingAddress1, 
            shippingAddress2, 
            city, 
            zip, 
            country, 
            phone, 
            status, 
            totalPrice,
            user
        }
        const OrderDeets = await Orders.create(OrderInput)
        console.log(OrderDeets)
    } catch (err) {
        return res.status(501).send('error creating order lists')
    }
});


//update orders
router.post('/orders/update/:orderId', async (req, res) => {
    const {orderId} = req.params.orderId
    try {
        const updatedOrderDetails = await Orders.findByIdAndUpdate(orderId)
        return res.status(200).send('order details updated successfully')
    } catch (err) {
        return res.status(501).send('Error updating products', err)
    }
});


//getting and matching user cart from ID
router.get('/orders/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Orders.find({ user: userId }).populate('user');
        console.log(orders)
        return res.status(200).json(orders);
    } catch(err) {
        return res.status(201).send('Error finding orderDetails')
    }
});



//deleting order details
router.delete('/orders/user/:id', async (req, res) => {
    const { id } = req.params.id
    try {
        const deleteOrderDetails = await Orders.findByIdAndDelete(id)
        return res.status(200).send('order details deleted successfully')
    } catch (err) {
        return res.status(501).send('error deleting Items')
    }
});


//create product details for the Seller account
router.post('/products/create', async (req, res) => {
    const {itemName, itemDescription, longDescription, image, images, brand, price, category, countInStock, rating, isFeatured, dateCreated, user} = req.body
    const productDetails = {
        itemName, 
        itemDescription, 
        longDescription, 
        image, 
        images, 
        brand, 
        price, 
        category, 
        countInStock, 
        rating, 
        isFeatured, 
        dateCreated,
        user
    }
    try {
        const productDeets = await Products.create(productDetails)
        return res.status(200).send('Product catalogue created successfully')
    } catch (err) {
        return res.status(501).send('Error creating catalogue', err)
    }
});

//get products
router.get('/products/list', async (req, res) => {
    try {
        // Use the constructed filter to query the products
        const filteredList = await Products.find();
        return res.status(200).json(filteredList);
    } catch (err) {
        return res.status(500).send(err);
    }
});


//update the products
router.post('/products/update/:productId', async (req, res) => {
    const {productId} = req.params.productId
    try {
        const updatedProduct = await Products.findByIdAndUpdate(productId)
        return res.status(200).send('product updated successfully')
    } catch (err) {
        return res.status(501).send('Error updating products', err)
    }
});



//update inventory countInStock
router.post('/updateInventory/:productId', async (req, res) => {
    const { currentStock, soldStock } = req.body
    const {productId} = req.params.productId
    const newStock = currentStock - soldStock 
    try {
        const updatedStock = await Products.findByIdAndUpdate(productId, {countInStock: newStock}, {new: true})
        return res.status(200).send('count in stock updated successfully')
    } catch (err) {
        return res.status(501).send('error updating stock, err')
    }
});


//delete products
router.delete('/products/delete/:id', async (req, res) => {
    const { id } = req.params.id
    try {
        const deleteProducts = await Products.findByIdAndDelete(id)
        return res.status(200).send('product deleted successfully')
    } catch(err) {
        return res.status(501).send('error deleting products',err)
    }
});



//get inventory of account details
router.get('/products/get/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const products = await Products.find({user: userId}).populate('user')
        console.log(products)
        return res.status(200).json(products)
    } catch (err) {
        return res.status(501).send('Errror retrieving products')
    }
});


//put items in cart
router.post('/carts/put', async(req, res) => {
    const { itemName, itemDescription, image, images, brand, price, category, countInStock, rating, user} = req.body
    const cartItems = {
        itemName,
        itemDescription,
        image,
        images,
        brand,
        price,
        category,
        countInStock,
        rating,
        user
    }
    try {
        const putCarts = await Carts.create(cartItems)
        return res.status(200).json(putCarts)
    } catch (err) {
        return res.status(501).send('Error putting cart in items')
    }
})

//list items in carts
router.get('/carts/list/:userId', async(req, res) => {
    const userId = req.params.userId
    try {
        const getCart = await Carts.find({user: userId}).populate('users')
        return res.status(200).json(getCart)
    } catch(err) {
        return res.status(501).send('error getting cart items')
    }
})


//delete cart after checkout
router.delete('/carts/delete/:id', async(req, res) => {
    const id = req.params.id
    try {
        const delCart = await Carts.findAndDeleteById(id)
        return res.status(200).json(`Deleted ${delCart} successfully`)
    } catch (err) {
        return res.status(501).send(err)
    }
})

// Export the router
export default router
