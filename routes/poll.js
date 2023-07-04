const {Router} = require('express')
const router = Router();
const {
    update_poll, 
    fetch_poll, 
    delete_poll, 
    load_single_poll, 
    add_vote
} = require('../controllers/poll')

// router.post('/new-poll', create_poll)
router.put('/update-poll/:id', update_poll)
router.get('/get-poll', fetch_poll)
router.delete('/delete-poll/:id', delete_poll)
router.get('/get-poll/:id', load_single_poll)
router.put('/add-vote/:id', add_vote)

module.exports = router