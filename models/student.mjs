import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db.mjs'

class Student extends Model {}

Student.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  institutionalEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^\d{10,12}@unfv\.edu\.pe$/
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  personalEmail: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  cellphone: {
    type: DataTypes.INTEGER,
    validate: {
      len: [9, 9]
    }
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [8, 8]
    }
  },
  dateOfBirth: {
    type: DataTypes.DATE
  },
  placeOfBirth: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING,
    validate: {
      len: [20, 200]
    }
  },
  dateOfAdmission: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'student'
})

export default Student
