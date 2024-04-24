import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db.mjs'

class EnrolledCourse extends Model {}

EnrolledCourse.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  modality: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'presencial',
    validate: {
      isIn: [['presencial', 'virtual', 'híbrido']]
    }
  },
  academicYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: new Date().getFullYear(),
    validate: {
      min: 2000
    }
  },
  academicSemester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validator: {
      isIn: [[1, 2]]
    }
  },
  startOfClasses: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      validateStartYear (value) {
        if (value.getFullYear() !== this.academicYear) {
          throw new Error('The year of startOfClasses must match the academicYear')
        }
      }
    }
  },
  enOfClasses: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      validateEndAfterStart (value) {
        if (value <= this.startOfClasses) {
          throw new Error('endOfClasses must be after startOfClasses')
        }
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'enrolledCourse'
})

export default EnrolledCourse
