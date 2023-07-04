const {Router} = require('express')
const {checkAdmin, checkSuperAdmin} = require('../middleware/auth')
const upload = require("../utils/multer")
const router = Router();
const {create_handler, update_handler, fetch_handler, delete_handler, load_single_candidate} = require('../controllers/candidate')

router.post('/new-candidate',  checkSuperAdmin, upload.single('avatar'), create_handler)
router.put('/update-candidate/:id', [checkAdmin, checkSuperAdmin], upload.single('avatar'),  update_handler)
router.get('/get-candidates', [checkAdmin, checkSuperAdmin], fetch_handler)
router.delete('/delete-candidate/:id', checkSuperAdmin, delete_handler)
router.get('/get-candidate/:id', [checkAdmin, checkSuperAdmin], load_single_candidate)

module.exports = router