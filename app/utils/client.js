/* global FAIL_NEXT_REST_REQUEST */

import {reject} from 'when'
import rest from 'rest'
import mime from 'rest/interceptor/mime'
import errorCode from 'rest/interceptor/errorCode'
import pathPrefix from 'rest/interceptor/pathPrefix'
import interceptor from 'rest/interceptor'

const meaningfulErrors = interceptor({
  error(resp) {
    if (!resp) {
      return reject({type: 'empty', message: 'Что-то пошло не так (пустой ответ)'})
    }
    if (resp instanceof Error) {
      return resp
    }
    if (resp.error === 'loaderror') {
      return reject({type: 'loaderror', message: 'Сервер не отвечает'})
    }
    if (resp.status) {
      if (resp.status.code === 404) {
        return reject({type: 'notFound', message: 'Объект не найден'})
      }
    }
    // console.log(resp)
    return reject({type: 'unknown', message: 'Что-то пошло не так'})
  },
})


const debugHelper = interceptor({
  success(resp) {
    if (typeof FAIL_NEXT_REST_REQUEST === 'boolean' && FAIL_NEXT_REST_REQUEST === true) {
      return reject({
        entity: {detail: 'debug'},
        status: {code: 500},
        originalResponse: resp,
      })
    }
    return resp
  },
})

// https://github.com/request/request/issues/2091
// against error: { [Error: Parse Error] bytesParsed: 326, code: 'HPE_UNEXPECTED_CONTENT_LENGTH' } }
// does not work now :(
const contentLengthFixer = interceptor({
  request: function handleRequest(request, config) {
    const headers = request.headers || (request.headers = {})

    if (headers['transfer-encoding'] === 'chunked') {
      delete headers['content-length']
    }

    return request
  },
})


const restEnhenced = rest
  .wrap(pathPrefix, {prefix: 'http://stage.vector.education/api'})
  .wrap(mime, {mime: 'application/json'})
  .wrap(errorCode)
  .wrap(debugHelper)
  .wrap(contentLengthFixer)
  .wrap(meaningfulErrors)


export default function sendRequest(req, token) {
  if (token) {
    if (!req.headers) {
      req.headers = {}
    }
    req.headers.Authorization = `JWT ${token}`
  }
  return restEnhenced(req)
}
