import Student from './student.mjs'
import Course from './course.mjs'
import EnrolledCourse from './enrolledCourse.mjs'

Student.hasMany(EnrolledCourse)
EnrolledCourse.belongsTo(Student)

Course.hasMany(EnrolledCourse)
EnrolledCourse.belongsTo(Course)

await Student.sync({ alter: true })
await Course.sync({ alter: true })
await EnrolledCourse.sync({ alter: true })

export {
  Student,
  Course,
  EnrolledCourse
}
