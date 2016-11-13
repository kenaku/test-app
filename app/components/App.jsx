import React from 'react'

import List from './List'
import CurrentItemInfo from './CurrentItemInfo'
import css from './App.styl'


const App = React.createClass({

  getInitialState() {
    return {
      currentItem: {
        id: 0,
        name: '',
        flags: [],
      },
    }
  },

  handleCurrentSelect(item) {
    this.setState({
      currentItem: {
        id: item.id,
        name: item.name,
        flags: item.flags,
      }
    })
  },

  render() {
    const {
      currentItem,
    } = this.state
    return (
      <div className={css.container}>
        <List
          handleCurrentSelect={this.handleCurrentSelect}
          filterSort
          filterText
        />
        <CurrentItemInfo item={currentItem} />
        <List
          handleCurrentSelect={this.handleCurrentSelect}
          filterFlags
        />
      </div>
    )
  }
})

export default App
