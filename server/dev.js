/* eslint no-console:0 */
import express from 'express'
import morgan from 'morgan'
import noPrerenderTemplate from './noPrerenderTemplate.html'
import nullPrerender from '../app/prerender.null'

import {
  PORT,
  webpackDevMiddleware,
  webpackHotMiddleware,
  publicMiddeware,
  watchPrerenderCompiler,
} from './shared'

const STATICS = {
  js: 'app.js',
}

const app = express()

// better logger for development
app.use(morgan('dev'))

let prerender = null

if (__DEV_PRERENDER__) {
  watchPrerenderCompiler((err, compiledPrerender) => {
    if (err) {
      prerender = null
    } else {
      prerender = compiledPrerender
    }
  })
} else {
  prerender = nullPrerender
}

app.use('/', publicMiddeware)

app.use(webpackDevMiddleware)
app.use(webpackHotMiddleware)

app.use('/', (req, res) => {
  if (prerender) {
    prerender(req, res, STATICS)
  } else {
    res.send(noPrerenderTemplate())
  }
})

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
})
