
const router = require('express').Router();
const Authentication = require('./controllers/authentication');
const Setting = require('./controllers/setting');
const User = require('./controllers/user')
const Contact = require('./controllers/contact')
const Smtp = require('./controllers/SMTP')
const Smtp2 = require('./controllers/SMTP2')


const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({ storage: storage })


router.post('/signin', Authentication.signin);
router.post('/signup', Authentication.signup);
router.get('/resetPassword', Authentication.resetPassword)

// SMTP
router.post('/sendEmail', Smtp.sendEmail)
router.post('/sendEmail0', Smtp.sendEmail0)
router.post('/receiveEmail', Smtp2.receiveEmail)
router.post('/detailEmail', Smtp2.detailEmail)
router.post('/sendemailById', Smtp2.sendemailById)
router.post('/updateImportant', Smtp2.updateImportant)
router.post('/updateStarred', Smtp2.updateStarred)
router.post('/deleteEmailByID', Smtp2.deleteEmailByID)
router.post('/acceptEmailById', Smtp2.acceptEmailById)
router.post('/rejectEmailById', Smtp2.rejectEmailById)
router.post('/getRepliedEmailById', Smtp2.getRepliedEmailById)
router.post('/getEmailById', Smtp2.getEmailById)
router.post('/getLabels', Smtp2.getLabels)
router.post('/addemail', Smtp2.addemail)
router.post('/getemail', Smtp2.getemail)
router.post('/deletemail', Smtp2.deletemail)
router.post('/getemailsByid', Smtp2.getemailsByid)
router.post('/updatemailById', Smtp2.updatemailById)
router.post('/mailAnalyse', Smtp2.mailAnalyse)
router.post('/getservice', Smtp2.getservice)
router.post('/changeEsettingById', Smtp2.changeEsettingById)
router.post('/changeRoleById', Authentication.changeRoleById)
router.post('/getHostings', Smtp2.getHostings)
router.post('/addemailTeam', Smtp2.addemailTeam)
router.post('/getemailTeam', Smtp2.getemailTeam)
router.post('/getemailTeamByid', Smtp2.getemailTeamByid)
router.post('/updatemailTeamById', Smtp2.updatemailTeamById)
router.post('/deletemailTeam', Smtp2.deletemailTeam)
router.post('/getEmailTeams', Smtp2.getEmailTeams)

// User
router.post('/getusers', User.getusers)
router.post('/addaccount', Authentication.addaccount)
router.post('/deleteAccount', Authentication.deleteAccount)
router.post('/getAccountById', Authentication.getAccountById)
router.post('/updateAccountById', Authentication.updateAccountById)

// Contact
router.post('/getContact', Contact.get)
router.post('/addContact', Contact.add)
router.post('/editContact', Contact.edit)
router.post('/deleteContact', Contact.delete)
router.post('/getContactByid', Contact.getByid)

// setting
router.post('/uploadimage', upload.single('photo'), Setting.uploadPorfileImg)
router.post('/setting/getAccount', Setting.getAccount);
router.post('/setting/saveAccount', Setting.saveAccount);
router.post('/setting/changeAccount', Setting.changeAccount);
router.post('/setting/changePassword', Authentication.changePassword);
router.post('/setting/updateAccount', Authentication.updateAccount);


module.exports = router;