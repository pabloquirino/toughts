import Toughts from '../model/Toughts.js'
import User from '../model/User.js'

export default class ToughtController {

    static async showToughts(req, res) {

        const toughtsData = await Toughts.findAll({
            include: User,
        })

        const toughts = toughtsData.map((result) => result.get({plain: true}))

        res.render('toughts/home', {toughts})
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

        let emptyToughts = false

        if(toughts.length === 0) {
            emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts })
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

    static async removeTought(req, res) {
        const id = req.body.id
        const UserId = req.session.userid

        try {

            await Toughts.destroy( {where: {id: id, UserId: UserId} } )

            req.flash('message','Pensamento removido com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch(err) {
            console.log(err)
        }
    }

    static async updateTought(req, res) {
        const {id} = req.params

        const tought = await Toughts.findOne({ where: {id: id}, raw: true })

        res.render('toughts/edit', {tought})
    }

    static async updateToughtSave(req, res) {
        const {id} = req.body

        const tought = {
            title: req.body.title
        }

        try {
            await Toughts.update(tought, { where: {id: id} })

            req.flash('message','Pensamento atualizado com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }

}