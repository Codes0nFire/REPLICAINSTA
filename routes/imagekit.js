// SDK initialization

var ImageKit = require("imagekit");
require("dotenv").config();

var imagekit = new ImageKit({
    publicKey : `${process.env.PUBLICKEY}`,
    privateKey : `${process.env.PRIVATEKEY}`,
    urlEndpoint : `${process.env.URLENDPOINT}`
});



module.exports=imagekit;
