const express = require('express');
const router = express.Router();

const { Addcandidate, Updatecandidate, Deletcandidate } = require('../controllers/candidatecontrollers');

const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/addcandidate', authMiddleware, Addcandidate)
router.put('/update-candidate/:candidateId', authMiddleware, Updatecandidate);
router.delete('/delet-candidate/:candidateId', authMiddleware, Deletcandidate)


module.exports = router;