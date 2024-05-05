import { Course } from '../models/index.mjs'

const initialCourses = [
  {
    code: 100001,
    studyCycle: 1,
    subject: 'Introducción a la Programación',
    typeOfCourse: 'obligatorio',
    typeOfStudy: 'general',
    weeksLong: 16,
    weeklyTheoreticalHours: 4,
    weeklyPracticalHours: 2,
    credits: 5,
    studyPlan: 2024
  },
  {
    code: 100002,
    studyCycle: 1,
    subject: 'Matemáticas Discretas',
    typeOfCourse: 'obligatorio',
    typeOfStudy: 'general',
    weeksLong: 16,
    weeklyTheoreticalHours: 4,
    weeklyPracticalHours: 2,
    credits: 5,
    studyPlan: 2024
  },
  {
    code: 100003,
    studyCycle: 2,
    subject: 'Estructuras de Datos y Algoritmos',
    typeOfCourse: 'obligatorio',
    typeOfStudy: 'general',
    weeksLong: 16,
    weeklyTheoreticalHours: 4,
    weeklyPracticalHours: 2,
    credits: 5,
    studyPlan: 2024
  },
  {
    code: 100004,
    studyCycle: 2,
    subject: 'Arquitectura de Computadores',
    typeOfCourse: 'electivo',
    typeOfStudy: 'específico',
    weeksLong: 16,
    weeklyTheoreticalHours: 4,
    weeklyPracticalHours: 2,
    credits: 5,
    studyPlan: 2024
  },
  {
    code: 100005,
    studyCycle: 3,
    subject: 'Bases de Datos',
    typeOfCourse: 'obligatorio',
    typeOfStudy: 'específico',
    weeksLong: 16,
    weeklyTheoreticalHours: 4,
    weeklyPracticalHours: 2,
    credits: 5,
    studyPlan: 2024
  }
]

const nonExistingCourseId = async () => {
  const course = await Course.create({
    code: 987654,
    studyCycle: 6,
    subject: 'Redes 1',
    typeOfCourse: 'obligatorio',
    typeOfStudy: 'general',
    weeksLong: 15,
    weeklyTheoreticalHours: 4,
    weeklyPracticalHours: 2,
    credits: 5,
    studyPlan: 2022
  })

  await course.destroy()

  return course.id
}

const coursesInDb = async () => {
  const courses = await Course.findAll()
  return courses
}

export default {
  initialCourses,
  nonExistingCourseId,
  coursesInDb
}
