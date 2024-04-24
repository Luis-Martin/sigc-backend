import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db.mjs'

class Course extends Model {}

Course.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 100000,
      max: 999999
    }
  },
  studyCycle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  typeOfCourse: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['obligatorio', 'electivo']]
    }
  },
  typeOfStudy: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['general', 'específico', 'especialidad']]
    }
  },
  weeksLong: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 4,
      max: 16
    }
  },
  weeklyTheoreticalHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 6
    }
  },
  weeklyPracticalHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 6
    }
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 6
    }
  },
  studyPanl: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2000
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'course'
})

export default Course
