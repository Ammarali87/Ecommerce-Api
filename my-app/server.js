import morgan from 'morgan'

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  console.log("morgan enable in dev")
}

const PORT = process.env.PORT || '4000'
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
