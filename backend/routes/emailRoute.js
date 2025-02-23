const express = require('express');
const multer = require('multer');
const { sendEmails, getEmails, getEmailById, deleteEmailById } = require('../controllers/emailController');
const { requireSignIn } = require('../middlewares/userMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/send-emails', requireSignIn, upload.single('file'), sendEmails);
router.get('/emails', requireSignIn, getEmails);
router.get('/email/:id', requireSignIn, getEmailById);
router.delete("/email/:id",requireSignIn, deleteEmailById);

const emailRoutes = router;
module.exports = emailRoutes;
