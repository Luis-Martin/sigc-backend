import Student from './student.mjs'
import Course from './course.mjs'
import EnrolledCourse from './enrolledCourse.mjs'

Student.hasMany(EnrolledCourse, { foreignKey: 'id' })
EnrolledCourse.belongsTo(Student)

Course.hasMany(EnrolledCourse, { foreignKey: 'id' })
EnrolledCourse.belongsTo(Course)

await Student.sync({ alter: true })
await Course.sync({ alter: true })
await EnrolledCourse.sync({ alter: true })

export {
  Student,
  Course,
  EnrolledCourse
}
