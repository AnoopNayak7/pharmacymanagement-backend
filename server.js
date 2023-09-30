const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log('Database Connection:: Successful');
}).catch(err => {
    console.error('Database Connection:: Failed', err);
    process.exit(1);
});

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const ordersRoutes = require('./routes/ordersRoutes')
const cartRoutes = require('./routes/cartRoutes')

app.use('/auth', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/cart', cartRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'Server is healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})
