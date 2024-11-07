import { DataTypes } from "sequelize"
import db from '../db/conn.js'
import User from './User.js'

const Toughts = db.define('Tought',{
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
})

Toughts.belongsTo(User)
User.hasMany(Toughts)

export default Toughts