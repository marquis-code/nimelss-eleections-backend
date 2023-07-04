const {Router} = require('express')
const {signup_handler, login_handler} = require('../controllers/admin')

const router = Router()

router.post('/signup', signup_handler)
router.post('/login', login_handler)

module.exports = router