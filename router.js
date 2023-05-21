
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


router.post('/api/v1/signin', Authentication.signin);
router.post('/api/v1/signup', Authentication.signup);
router.get('/api/v1/resetPassword', Authentication.resetPassword)

// SMTP
router.post('/api/v1/sendEmail', Smtp.sendEmail)
router.post('/api/v1/sendEmail0', Smtp.sendEmail0)
router.post('/api/v1/receiveEmail', Smtp2.receiveEmail)
router.post('/api/v1/detailEmail', Smtp2.detailEmail)
router.post('/api/v1/sendemailById', Smtp2.sendemailById)
router.post('/api/v1/updateImportant', Smtp2.updateImportant)
router.post('/api/v1/updateStarred', Smtp2.updateStarred)
router.post('/api/v1/deleteEmailByID', Smtp2.deleteEmailByID)
router.post('/api/v1/acceptEmailById', Smtp2.acceptEmailById)
router.post('/api/v1/rejectEmailById', Smtp2.rejectEmailById)
router.post('/api/v1/getRepliedEmailById', Smtp2.getRepliedEmailById)
router.post('/api/v1/getEmailById', Smtp2.getEmailById)
router.post('/api/v1/getLabels', Smtp2.getLabels)
router.post('/api/v1/addemail', Smtp2.addemail)
router.post('/api/v1/getemail', Smtp2.getemail)
router.post('/api/v1/deletemail', Smtp2.deletemail)
router.post('/api/v1/getemailsByid', Smtp2.getemailsByid)
router.post('/api/v1/updatemailById', Smtp2.updatemailById)
router.post('/api/v1/mailAnalyse', Smtp2.mailAnalyse)
router.post('/api/v1/getservice', Smtp2.getservice)
router.post('/api/v1/changeEsettingById', Smtp2.changeEsettingById)
router.post('/api/v1/changeRoleById', Authentication.changeRoleById)
router.post('/api/v1/getHostings', Smtp2.getHostings)
router.post('/api/v1/addemailTeam', Smtp2.addemailTeam)
router.post('/api/v1/getemailTeam', Smtp2.getemailTeam)
router.post('/api/v1/getemailTeamByid', Smtp2.getemailTeamByid)
router.post('/api/v1/updatemailTeamById', Smtp2.updatemailTeamById)
router.post('/api/v1/deletemailTeam', Smtp2.deletemailTeam)
router.post('/api/v1/getEmailTeams', Smtp2.getEmailTeams)

// User
router.post('/api/v1/getusers', User.getusers)
router.post('/api/v1/addaccount', Authentication.addaccount)
router.post('/api/v1/deleteAccount', Authentication.deleteAccount)
router.post('/api/v1/getAccountById', Authentication.getAccountById)
router.post('/api/v1/updateAccountById', Authentication.updateAccountById)

// Contact
router.post('/api/v1/getContact', Contact.get)
router.post('/api/v1/addContact', Contact.add)
router.post('/api/v1/editContact', Contact.edit)
router.post('/api/v1/deleteContact', Contact.delete)
router.post('/api/v1/getContactByid', Contact.getByid)

// setting
router.post('/api/v1/uploadimage', upload.single('photo'), Setting.uploadPorfileImg)
router.post('/api/v1/setting/getAccount', Setting.getAccount);
router.post('/api/v1/setting/saveAccount', Setting.saveAccount);
router.post('/api/v1/setting/changeAccount', Setting.changeAccount);
router.post('/api/v1/setting/changePassword', Authentication.changePassword);
router.post('/api/v1/setting/updateAccount', Authentication.updateAccount);


module.exports = router;