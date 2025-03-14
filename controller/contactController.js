const {Contact, EmailSub, depoReceipt} = require("../model/contactModel");

async function createContact(req, res){
    try{
        const {email, fullname, message, subject} = req.body;

        const newContactInfo = await Contact.create({
            email, fullname, message, subject
        })

        res.json({
            message: "successful",
            newContactInfo
        })

    }catch(error){
        res.status(500).json({error:`Internal Server Error: ${error}`})
    }
}

async function emailSubscribe(req, res){
    const email = req.body.email
    try{
        await EmailSub.create({email})
        res.json({
            status: 'successfully',
            email
        })
    }catch(err){
        res.status(500).json({
            status: 'fail',
            message: `Internal Server Error: ${err.message}`
        })
    }
}
async function receipt(req, res){
    const {userid, receipt} = req.body;
    try{
        const depres = await depoReceipt.create({userid, receipt})

        res.json({
            status: 'success',
            depres
        })
    }catch(err){
        res.status(500).json({
          status: "fail",
          message: `Internal Server Error: ${err.message}`,
        });
    }
}
module.exports = {createContact, emailSubscribe, receipt};