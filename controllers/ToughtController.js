import Toughts from '../model/Toughts.js'
import User from '../model/User.js'

export default class ToughtController {

    static async showToughts(req, res) {
        res.render('toughts/home')
    }

    static async dashboard(req, res) {
        const userId = req.session.userid

        const user = await User.findOne({ 
            where: {id: userId},
            include: Toughts, // brings all user related toughts
            plain: true
        })

        // check if user exists
        if (!user) {
            res.redirect('/login')
        }

        // transform 'tought' data into a simpler format for manipulation
        const toughts = user.Toughts.map((result) => result.dataValues) 

        res.render('toughts/dashboard', { toughts })
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }

    static async createToughtSave(req, res) {

        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Toughts.create(tought)

            req.flash('message','Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

}