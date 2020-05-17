import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/post-codealong-2"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Task = mongoose.model('Task', {
  text: {
    type: String,
    required: true,
    minlength: 5
  },
  complete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Get tasks, sort by createdAt descending order, limit to show 20
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(tasks)
})

// Retreive the information sent by the client to our API endpoint
app.post('/tasks', async (req, res) => {
  const { text, complete } = req.body
  // Use our mongoose model to create the database entry
  const task = new Task({ text, complete })

  try {
    // Succsess
    const savedTask = await task.save()
    res.status(201).json(savedTask)
  } catch (err) {
    res.status(400).json({ message: 'Could not save task to database', error: err.errors })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
