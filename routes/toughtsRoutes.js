import express from 'express'
import ToughtController from '../controllers/ToughtController.js'
// helpers
import checkAuth from '../helpers/auht.js'

const router = express.Router()

router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtSave)
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.get('/', ToughtController.showToughts)

export default router