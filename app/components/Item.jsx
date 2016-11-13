import React, {PropTypes as T} from 'react'
import cx from 'classnames'
import InlineSVG from 'svg-inline-react'

import css from './Item.styl'

const Item = ({item, isSelected}) => (
  <div
    className={cx({
      [css.item]: true,
      [css.selected]: isSelected
    })}
  >
    <span>{item.name}</span>
    <span className={css.flags}>
      {item.flags.map(flag => (
        <InlineSVG
          key={flag}
          className={css.icon}
          src={require(`svg-inline!./assets/${flag}.svg`)}
        />
      ))}
    </span>
  </div>
)

Item.propTypes = {
  item: T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    flags: T.array.isRequired,
  }),
  isSelected: T.bool,
}

export default Item
