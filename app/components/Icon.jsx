import React, {PropTypes as T} from 'react'
import InlineSVG from 'svg-inline-react'

import css from './Icon.styl'

const Icon = ({icon}) => (
  <InlineSVG
    className={css.icon}
    src={require(`svg-inline!./assets/${icon}.svg`)}
  />
)

Icon.propTypes = {
  icon: T.string.isRequired
}

export default Icon
