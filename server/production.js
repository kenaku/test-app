/* eslint no-console:0 */
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import prerender from 'app/prerender'

import {
  PORT,
  getStatics,
  assetsMiddleware,
  publicMiddeware,
} from 'server/shared'

const app = express()

const statics = getStatics()

// security middleware
// https://github.com/helmetjs/helmet - read more
app.use(helmet())

// gzip all the things
app.use(compression())


app.use('/', publicMiddeware)

app.use('/assets', assetsMiddleware)

app.use('/', (req, res) => {
  prerender(req, res, statics)
})

app.listen(PORT, () => {
  console.log(`App development server listening on ${PORT} with NODE_ENV=${process.env.NODE_ENV}`)
})
