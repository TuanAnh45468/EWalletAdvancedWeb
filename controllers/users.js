const User = require('../models/user')
const Account = require('../models/account')
const {cloudinary} = require('../cloudinary/index')
const nodemailer = require('nodemailer')



module.exports.createUser = async (req, res, next) =>{
    const userAccount = generateUser(10);
    const user = new User(req.body);
    const email = req.body.email;

    req.session.email = email;
    req.session.userAccount = userAccount;
    
    createAccount(email, userAccount);
    user.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    //user.backImages = req.files.map(f => ({url: f.path, filename: f.filename}));
    await user.save();
    //console.log(user);
    res.redirect('/users/firstTime')
}

const createAccount = function(email, userAccount){
    
    const password = generatePassword(6)
    const account = new Account(
        {
            username: userAccount,
            password: password,
            state: 'notValidated',
            failureTime: 0
        }
        
    )
    account.save();

    var mailOptions = {
        from: 'anh97059@gmail.com',
        to: `${email}`,
        subject: 'Your New Account',
        text: `Username: ${userAccount} \n` +  `Password: ${password}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const generatePassword = function generateRandom3Characters(size) {
    var generatedOutput= '';
    var storedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var totalCharacterSize = storedCharacters.length;

    for ( var index = 0; index < size; index++ ) {
       generatedOutput+=storedCharacters.charAt(Math.floor(Math.random() *
       totalCharacterSize));
    }
    return generatedOutput;
};

const generateUser = function randomUsername(size){
    var generatedOutput= '';
    var storedCharacters = '0123456789';
    var totalCharacterSize = storedCharacters.length;
    for ( var index = 0; index < size; index++ ) {
       generatedOutput+=storedCharacters.charAt(Math.floor(Math.random() * totalCharacterSize));
    }
    return generatedOutput;
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anh97059@gmail.com',
        pass: '0978233845'
    }
})