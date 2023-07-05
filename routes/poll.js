const {Router} = require('express')
const {checkAdmin, checkSuperAdmin} = require('../middleware/auth')
const router = Router();
const {
    update_poll, 
    fetch_poll, 
    delete_poll, 
    load_single_poll, 
    add_vote,
    create_poll,
    find_poll
} = require('../controllers/poll')

// router.post('/new-poll', create_poll)
router.put('/update-poll/:id', update_poll)
router.get('/get-poll', fetch_poll)
router.get('/user/:name', find_poll)
router.delete('/delete-poll/:id', delete_poll)
router.get('/get-poll/:id', load_single_poll)
router.post('/add-vote/:id/:option', add_vote)
router.post('/create-poll', checkSuperAdmin, create_poll)

module.exports = router