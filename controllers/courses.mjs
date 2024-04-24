import { Router } from 'express'
import { Course } from '../models/index.mjs'

const coursesRouter = Router()

coursesRouter.get('/', async (req, res) => {
  const courses = await Course.findAll()
  res.status(200).json(courses)
})

coursesRouter.get('/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id)

  if (!course) return res.status(404).json({ error: 'Course not found' })

  res.status(200).json(course)
})

coursesRouter.post('/', async (req, res) => {
  const course = await Course.create(req.body)
  res.status(201).json(course)
})

coursesRouter.put('/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id)

  if (!course) return res.status(404).json({ error: 'Course not found' })

  await course.update(req.body)
  res.json(course)
})

coursesRouter.delete('/:id', async (req, res) => {
  const course = await Course.findByPk(req.params.id)

  if (!course) return res.status(404).json({ error: 'Course not found' })

  await course.destroy()
  res.json({ message: 'Course deleted successfully' })
})

export default coursesRouter
