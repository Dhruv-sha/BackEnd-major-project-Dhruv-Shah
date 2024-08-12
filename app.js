const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


mongoose.connect('mongodb+srv://tryshahdhruv244:ucIpjxlFl7IEy1zk@cluster0.yle5v66.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const db =mongoose.connection;
db.on('error' , console.error.bind(console, 'MongoDB connection error'));


const userSchema = new mongoose.Schema({
    name: String,
    topping: String,
    crust: String,
    price : Number
})

const Menu = mongoose.model('Pizza' , userSchema);
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.use(express.static('public'));


app.get('/items/new' , (req,res) =>{
    res.render('new-item' , {errors:null})
});


app.post('/items', async (req, res) => {
    try {
        const item = new Menu(req.body);
        await item.save();
        res.redirect('/items');

    } catch (err) {
        res.status(500).send(err);
    }
})


app.get('/items', async (req, res) => {
    try {
        const items = await Menu.find();
        res.render('items-list', { items });
    } catch (err) {
        res.status(500).send(err);
    }
})


app.get('/items/:id/edit', async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.render('edit-items', { item, errors: null });
    } catch (err) {
        res.status(500).send(err);
    }
});


app.put('/items/:id', async (req, res) => {
    try {
        const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.redirect('/items');
    } catch (err) {
        res.status(500).send(err);
    }
});


app.delete('/items/:id', async (req, res) => {
    try {
        const item = await Menu.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).send('User not found');
        }
        res.redirect('/items');
    } catch (err) {
        res.status(500).send(err);
    }
});



const PORT=5000;
app.listen(PORT , ()=> console.log("Server is running at port " + PORT) );




