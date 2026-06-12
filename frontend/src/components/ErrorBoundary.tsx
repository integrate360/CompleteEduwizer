import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Catches render-time errors anywhere in the tree so a single component
 * failure shows a friendly fallback instead of a blank white page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface for debugging; swap for a real logger/Sentry in production.
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.hash = '#/home'
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="errboundary">
          <div className="errboundary__card">
            <h1>Something went wrong</h1>
            <p>
              We hit an unexpected error. Please try reloading the page — your data is safe.
            </p>
            <button type="button" className="btn btn--navy" onClick={this.handleReload}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
