const express = require('express');
const router = express.Router();

const { Addcandidate, Updatecandidate, Deletcandidate,getallcandidate ,doingvote } = require('../controllers/candidatecontrollers');

const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/addcandidate', authMiddleware, Addcandidate)
router.put('/update-candidate/:candidateId', authMiddleware, Updatecandidate);
router.delete('/delet-candidate/:candidateId', authMiddleware, Deletcandidate);

// Vote routes and get all candidates
router.post('/vote/:candidateId',authMiddleware,doingvote)
router.get('/getallcandidate',authMiddleware,getallcandidate)



module.exports = router;