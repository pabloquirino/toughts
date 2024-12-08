import Toughts from '../model/Toughts.js'
import User from '../model/User.js'

export default class ToughtController {

    static async showToughts(req, res) {
        res.render('toughts/home')
    }

    static async dashboard(req, res) {
        res.render('toughts/dashboard')
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }

}