// null prerender
// may be used to speed up development builds/rebuilds
// just renders template without any server-side prerender
// handles everything on the client

import template from './template.html'

function renderPage(token, statics) {
  return template({
    html: '',
    initialState: JSON.stringify({me: {token}}),
    statics,
  })
}

export default function prerenderNull(req, res, statics) {
  const {cookies: {JwtToken: token} = {}} = req

  res.send(renderPage(token, statics))
}
