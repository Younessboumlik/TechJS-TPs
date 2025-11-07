const express = require('express')
const {register, login} = require('./passport')


let authentification = false;
let books=[{
    id:1,
    title:'book1',
    author:'me',
    genre:'comedy'
}]
last_id = 1

const app = express()

 app.set("view engine", "pug");
 app.set("views", "./pages")
 app.use(express.urlencoded({ extended: true }));


app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async(req, res) => {
    username = req.body.username
    password = req.body.password
    
    const result = await register(username, password)
    if (result === null) {
        res.render('register', { error: 'Username already exists' });
    } else {
        res.redirect('login');
    }

})

app.get('/login', (req, res) => {
    res.render('login', {error : false})
})

app.post('/login', async (req, res) => {
    username = req.body.username
    password = req.body.password

    authentification = await login(username, password)

    if(authentification === true){
        res.redirect('book')
    }
    else{
        res.render('login', {error : true})
    }
})

app.get('/book', authentificationAccess, (req, res) => {
    res.render('book', {books:books})
})

app.post('/book/add', (req, res) => {
    const { title, author, genre } = req.body;
    last_id =  last_id + 1
    books.push({ id : last_id,title, author, genre });
    console.log(books)
    res.redirect('/book');
});

app.post('/book/delete/:id', (req, res) => {
    books = books.filter((books) => books.id !== parseInt(req.params.id));
    console.log(books)
    res.redirect('/book');
});



app.get('/logout', authentificationAccess, (req, res) => {
    authentification = false

    res.redirect('login')
})


function authentificationAccess(req, res, next){
    if(authentification === true){
        next()
    }
    else{
        res.redirect('login')
    }
}

app.listen(5000)