import {renderToString} from 'react-dom/server'
import React from 'react'
import {match, createMemoryHistory} from 'react-router'
import {ReduxAsyncConnect, loadOnServer} from 'redux-async-connect'
import {Provider} from 'react-redux'
import routes from './routes'
import createStore from './stores'
import client from './utils/client'

import template from './template.html'

function renderPage(html, store, statics) {
  const preloadData = JSON.stringify(store.getState())

  return template({
    html,
    preloadData,
    statics,
  })
}

export default function prerender(req, res, statics) {
  const history = createMemoryHistory(req.url)
  const {store} = createStore(history)

  let result

  match({routes, location: req.url}, (err, redirect, renderProps) => {
    if (err) {
      res.status(500).send(`500! ${err.stack}`)
    }

    if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    }

    if (renderProps) {
      // 1. load data
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        // 2. use `ReduxAsyncConnect` instead of `RoutingContext` and pass it `renderProps`
        const appHTML = renderToString(
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        )

        // 3. render the Redux initial data into the server markup
        const html = renderPage(appHTML, store, statics)

        res.send(html)
      })
      .catch((loadErr) => {
        res.status(500).send(`500! ${loadErr.stack}`)
      })

    } else {
      res.status(404).send('404!')
    }
  })

  return result
}
