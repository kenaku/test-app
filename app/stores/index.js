import reducers from '../reducers'
import {createStore, combineReducers, compose, applyMiddleware} from 'redux'
import {routerReducer, syncHistoryWithStore, routerMiddleware} from 'react-router-redux'
import {reducer as reduxAsyncConnect} from 'redux-async-connect'
import window from '../utils/window'

// https://github.com/zalmoxisus/redux-devtools-extension#implementation
// external redux devtools via chrome extention
// or just null function
const devToolsExtension = window.devToolsExtension ? window.devToolsExtension() : (f) => f

export default function create(history, initialData = {}) {
  const reducer = combineReducers({
    ...reducers,
    reduxAsyncConnect,
    routing: routerReducer,
  })

  const reduxRouterMiddleware = routerMiddleware(history)

  const finalCreateStore = compose(
    applyMiddleware(reduxRouterMiddleware),
    devToolsExtension
  )(createStore)

  const store = finalCreateStore(reducer, initialData)

  const syncHistory = syncHistoryWithStore(history, store)

  return {
    store,
    history: syncHistory,
  }
}
