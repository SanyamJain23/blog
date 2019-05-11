const path = require('path');

const expressEdge = require('express-edge');

const express = require('express');

const edge = require("edge.js");
 
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

const fileUpload = require("express-fileupload");

const expressSession = require('express-session');

const connectMongo = require('connect-mongo');

const Post = require('./database/models/Post');

const auth = require("./middleware/auth");

const connectFlash = require("connect-flash");




const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const logoutController = require("./controllers/logout");





const app = new express();



mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

    const mongoStore = connectMongo(expressSession);

    app.use(expressSession({
        secret: 'secret',
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        })
    }));

    app.use(connectFlash());

app.use(fileUpload()); 
app.use(express.static('public'));
app.use(expressEdge);
app.set('views',__dirname + '/views');

app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)

app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.post("/posts/store",auth, storePost, storePostController);
app.post('/users/login', redirectIfAuthenticated, loginUserController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/auth/logout", redirectIfAuthenticated, logoutController);



app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
});
 
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/login', (req, res) => {
    res.render('login');
});
 
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/auth/login', (req, res) => {
    res.render('login');
});

 
app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});
 


app.post('/posts/new', (req, res) => {
    
   
    if(req.body.email=='sjperfection@gmail.com'&& req.body.password=='sanyam123')
    
    {
        res.render('create');
    }
    
    else
    res.send('not authenticated relogin with admin credentials');
    
});


app.get('/posts/new', (req, res) => {
    
   
    res.send('not authenticated relogin with admin credentials');
    
});

app.post("/posts/store", (req, res) => {
    const {
        image
    } = req.files
 
    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
    })
});


 
app.listen(4000, () => {
    console.log('App listening on port 4000')
});