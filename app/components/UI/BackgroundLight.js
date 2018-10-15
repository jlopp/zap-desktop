import React from 'react'
import { Box } from 'rebass'

/**
 * @render react
 * @name BackgroundLight
 * @example
 * <BackgroundLight />
 */
class BackgroundLight extends React.Component {
  render() {
    return <Box bg="lightBackground" color="white" {...this.props} />
  }
}

export default BackgroundLight
