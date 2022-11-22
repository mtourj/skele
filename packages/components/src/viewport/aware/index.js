'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import * as Utils from '../utils'

export default WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        componentOffsetX: null,
        componentOffsetY: null,
        componentWidth: null,
        componentHeight: null,
        inViewport: false,
      }
    }

    componentDidMount() {
      this.context.addViewportListener &&
        this.context.addViewportListener(this._onViewportChange)
      this._isMounted = true
      this._lastInfo &&
        setTimeout(() => this._onViewportChange(this._lastInfo), 50)
    }

    componentWillUnmount() {
      this.context.removeViewportListener &&
        this.context.removeViewportListener(this._onViewportChange)
      this._isMounted = false
    }

    _onViewportChange = info => {
      this._lastInfo = info
      if (!this.wrappedComponentRef) return
      if (
        info.shouldMeasureLayout ||
        this.state.componentOffsetX == null ||
        this.state.componentOffsetY == null ||
        this.state.componentWidth == null ||
        this.state.componentHeight == null
      ) {
        if (!this._isMounted) return
        this.wrappedComponentRef.measureLayout(
          this.nodeHandle,
          info.parentHandle,
          (offsetX, offsetY, width, height) => {
            if (!this._isMounted) return
            const inVerticalViewport = Utils.isInViewport(
              info.viewportOffsetY,
              info.viewportHeight,
              offsetY,
              height,
              this.props.preTriggerRatio
            )
            const inHorizontalViewport = Utils.isInViewport(
              info.viewportOffsetX,
              info.viewportWidth,
              offsetX,
              width,
              this.props.preTriggerRatio
            )
            const inViewport = inVerticalViewport && inHorizontalViewport
            this._checkViewportEnterOrLeave(inViewport)
            this.setState({
              componentOffsetY: offsetY,
              componentOffsetX: offsetX,
              componentHeight: height,
              componentWidth: width,
              inViewport,
            })
          }
        )
      } else {
        const inVerticalViewport = Utils.isInViewport(
          info.viewportOffsetY,
          info.viewportHeight,
          this.state.componentOffsetY,
          this.state.componentHeight,
          this.props.preTriggerRatio
        )
        const inHorizontalViewport = Utils.isInViewport(
          info.viewportOffsetX,
          info.viewportWidth,
          this.state.componentOffsetX,
          this.state.componentWidth,
          this.props.preTriggerRatio
        )
        const inViewport = inVerticalViewport && inHorizontalViewport
        if (this._checkViewportEnterOrLeave(inViewport)) {
          this.setState({ inViewport })
        }
      }
    }

    _checkViewportEnterOrLeave = inViewport => {
      if (!this.state.inViewport && inViewport) {
        this.props.onViewportEnter && this.props.onViewportEnter()
        return true
      } else if (this.state.inViewport && !inViewport) {
        this.props.onViewportLeave && this.props.onViewportLeave()
        return true
      }
      return false
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          inViewport={this.state.inViewport}
          ref={ref => {
            this.wrappedComponentRef = ref
            this.props.innerRef && this.props.innerRef(ref)
          }}
        />
      )
    }

    static propTypes = {
      preTriggerRatio: PropTypes.number,
      onViewportEnter: PropTypes.func,
      onViewportLeave: PropTypes.func,
      innerRef: PropTypes.func,
    }

    static contextTypes = {
      addViewportListener: PropTypes.func,
      removeViewportListener: PropTypes.func,
    }

    static displayName = `ViewportAware(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`
  }
}
