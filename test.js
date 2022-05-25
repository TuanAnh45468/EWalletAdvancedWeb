var nodemailer = require('nodemailer')

var digits = Math.floor(Math.random() * 9000000000) + 1000000000;
//console.log(digits);

const password = function generateRandom3Characters(size) {
    var generatedOutput= '';
    var storedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var totalCharacterSize = storedCharacters.length;

    for ( var index = 0; index < size; index++ ) {
       generatedOutput+=storedCharacters.charAt(Math.floor(Math.random() *
       totalCharacterSize));
    }
    return generatedOutput;
};
//console.log(generateRandom3Characters(6));

const generateUser = function randomUsername(size){
    var generatedOutput= '';
    var storedCharacters = '0123456789';
    var totalCharacterSize = storedCharacters.length;

    for ( var index = 0; index < size; index++ ) {
       generatedOutput+=storedCharacters.charAt(Math.floor(Math.random() *
       totalCharacterSize));
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

var mailOptions = {
    from: 'anh97059@gmail.com',
    to: 'tuananh45468@gmail.com',
    subject: 'Sending email using Node.js',
    text: `Username: ${generateUser(10)} \n` +  `Password: ${password(6)}`
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});