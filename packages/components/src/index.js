'use strict'

import { View } from 'react-native'

/**
 * Modified with patch-package
 *
 * Since using UIManager.measureLayout is deprecated and doesn't work on the web, we
 * refactor ViewportAware to call .measureLayout on the wrapping component's ref.
 * This means that the wrapping component can't just be any component, it has to be
 * one of the few native components with a measureLayout function available on it, so
 * for that reason we export a ViewportAwareView instead of the ViewportAware HOC.
 */

import ViewportTracker from './viewport/tracker'
import ViewportAware from './viewport/aware'
import WithPlaceholder from './viewport/withPlaceholder'
import WithEvents from './shared/WithEvents'

const Viewport = {
  Tracker: ViewportTracker,
  Aware: ViewportAware,
  WithPlaceholder: WithPlaceholder,
}

const ViewportAwareView = ViewportAware(View)

const Mixins = {
  WithEvents,
}

export { ViewportAwareView, Viewport, Mixins }

export default {
  Viewport,
  Mixins,
}
