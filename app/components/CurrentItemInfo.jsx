import React, {PropTypes as T} from 'react'
import Icon from './Icon'
import css from './CurrentItemInfo.styl'


const CurrentItem = ({item}) => (

  <div className={css.currentItemInfo}>
    {item.name
    ?
      <span>
        <h2>{item.name}</h2>
        {item.flags.map(flag => <Icon key={flag} icon={flag} />)}
      </span>
    : <h2>Выберете пункт из списка</h2>
    }
  </div>
)

CurrentItem.propTypes = {
  item: T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    flags: T.array.isRequired,
  }),
}

export default CurrentItem
