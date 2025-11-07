const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/myappdb')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));



const userSchema = new mongoose.Schema({
  username: String,
  password: String});

const User = mongoose.model('User', userSchema);


async function register(username, password){

    const user = await User.findOne({ username: username});

    if(user === null){
    const newUser = new User({ username, password });
    await newUser.save();
    console.log('user bien enregistré')
    }
    else{
        return null
    }
}


async function login(username, password){

    const user = await User.findOne({ username: username, password: password });

    if(user === null) return false
    return true
    
}
module.exports = {register, login}