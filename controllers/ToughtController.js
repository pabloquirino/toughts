import Toughts from '../model/Toughts.js'
import User from '../model/User.js'

export default class ToughtController {

    static async showToughts(req, res) {
        res.render('toughts/home')
    }

}