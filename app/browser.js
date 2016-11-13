import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'
import {ReduxAsyncConnect} from 'redux-async-connect'
import createStore from './stores'
import routes from './routes'

import './styles/entry.styl'

const {store, history} = createStore(browserHistory, window._PRELOAD_DATA_)

const app = (
  <Provider store={store} key="provider">
    <Router history={history} render={(props) => <ReduxAsyncConnect {...props} />} >
      {routes}
    </Router>
  </Provider>
)

ReactDOM.render(app, document.getElementById('app'))
