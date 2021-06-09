require('dotenv').config();
const router = require('express').Router();
const multer  = require('multer');
const upload = multer();
const Widget = require('../entities/Widget');
const WidgetManager = require('../dbmanagers/WidgetManager');
const UserManager = require('../dbmanagers/UserManager');

router.post('/createWidget',upload.none(),async(req,res)=>{

    if(req.body.dateOfRelation)
    {
       await UserManager.addDateOfRelation(req.user._id,req.user.partner,req.body.dateOfRelation);
    }
    const widget = new Widget.Builder()
    .setUserId(req.user._id)
    .setPartnerId(req.user.partner)
    .setType(String(req.body.type))
    const result = await WidgetManager.createWidget(widget);
    res.send(result);
})

router.post('/deleteWidget',upload.none(),async (req,res)=>{
    const result = await WidgetManager.deleteWidget(req.user._id,req.body.type);
    if(result)
    {
        res.send(result);
    }
    else
    {
        res.send({status:"Opps theres something wrong with the server"});
    }
})

module.exports = router;