import React, {PropTypes as T} from 'react'
import cx from 'classnames'
import TextFilter from 'react-text-filter'
import faker from 'faker'
import _ from 'lodash'

import css from './List.styl'
import Item from './Item'
import Icon from './Icon'


const listSize = Array(100).fill(0)
const flagsArray = ['flower', 'heart', 'sun', 'flash']

faker.locale = 'ru'
const generateItem = (number, i) => {
  const flagsQuantity = _.random(1, 3)
  const item = {
    id: i,
    name: faker.name.findName(),
    flags: _.sampleSize(flagsArray, flagsQuantity).sort()
  }
  return item
}

const textFilterFunc = filter => item =>
  item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1

const List = React.createClass({
  propTypes: {
    handleCurrentSelect: T.func.isRequired,
    filterSort: T.bool,
    filterText: T.bool,
    filterFlags: T.bool,
  },

  getInitialState() {
    return {
      sortAsk: true,
      items: [],
      currentItemId: '',
      textFilter: '',
      currentFlags: flagsArray,
    }
  },

  componentWillMount() {
    // Генерируем фэйковые данные
    const items = listSize.map((number, i) => generateItem(number, i)).reverse()
    const sortedItems = _.sortBy(items, 'name')
    this.setState({items: sortedItems})
  },

  handleSort() {
    // Сортировка по алфавиту
    const {sortAsk} = this.state
    this.setState({sortAsk: !sortAsk})
  },

  handleTextFilter({target: {value: textFilter}}) {
    // Фильтр по тексту
    this.setState({textFilter})
  },

  handleFlagFilter(flag) {
    // Фильтр по флагам
    const {currentFlags} = this.state
    const flags = _.includes(currentFlags, flag)
      ? _.without(currentFlags, flag)
      : currentFlags.concat(flag)
    this.setState({currentFlags: flags})
  },

  handleCurrentSelect(item) {
    // Выбираем пункт списка
    this.props.handleCurrentSelect(item)
    this.setState({currentItemId: item.id})
  },

  renderItem(item) {
    // Отрисовка пункта списка
    const {currentItemId} = this.state
    return (
      <li
        key={item.id}
        onClick={() => this.handleCurrentSelect(item)}
      >
        <Item
          item={item}
          isSelected={currentItemId === item.id}
        />
      </li>
    )
  },

  render() {
    const {items, textFilter, sortAsk, currentFlags} = this.state
    const {filterSort, filterText, filterFlags} = this.props

    // Фильтруем по тексту
    const filteredTextItems = textFilter
      ? items.filter(textFilterFunc(textFilter))
      : items.slice(0)

    // Фильтруем по флагам
    const filteredFlagsItems = _.filter(filteredTextItems, (o) => {
      return currentFlags.some(v => o.flags.includes(v))
    })

    // Сортируем по алфавиту
    const finalItems = sortAsk ? filteredFlagsItems : filteredFlagsItems.reverse()

    return (
      <div className={css.listWrap}>
        <div className={css.filters}>
          {filterSort &&
            <button
              className={cx({
                [css.sortButton]: true
              })}
              onClick={() => this.handleSort()}
            >
              Сортировать {sortAsk ? '↓' : '↑'}
            </button>
          }
          {filterText &&
            <TextFilter
              placeholder="Введите имя"
              filter={textFilter}
              onFilter={this.handleTextFilter}
              debounceTimeout={50}
              className={css.textFilter}
            />
          }
          {filterFlags &&
            <div className={css.filterFlags}>
              <span className={css.filterLabel}>Фильтр:</span>
              {flagsArray.map(flag =>
                <button
                  key={flag}
                  onClick={() => this.handleFlagFilter(flag)}
                  className={cx({
                    [css.filterFlagsButton]: true,
                    [css.filterFlagsButtonActive]: currentFlags.includes(flag),
                  })}
                >
                  <Icon icon={flag} />
                </button>
              )}
            </div>
          }
        </div>
        <ul className={css.list}>
          {finalItems.length
            ? finalItems.map(item => this.renderItem(item))
            : <li><h2>Ничего не нашлось</h2></li>
          }
        </ul>
      </div>

    )
  }
})

export default List
