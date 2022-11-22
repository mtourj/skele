type ViewportAwareViewProps<T> = {
  /**
   * Determines pre-triggering of inViewport. Useful for rendering components
   * beforehand to improve user experience. A ratio of 0.5 means that the
   * effective viewport will be twice the size of the real viewport.
   */
  preTriggerRatio?: number
  /**
   * Invoked when the component enters the viewport.
   */
  onViewportEnter?: () => void
  /**
   * Invoked when the component leaves the viewport.
   */
  onViewportLeave?: () => void
  innerRef?: RefObject<T>
  children?: any
}

declare module '@skele/components' {
  const ViewportAwareView: (
    props: ViewportAwareViewProps<View> & ViewProps
  ) => JSX.Element

  const Viewport: {
    Tracker: (props: React.PropsWithChildren<{}>) => JSX.Element
  }

  export { ViewportAwareView, Viewport }
}
