import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.status(200).send('sigb backend')
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
