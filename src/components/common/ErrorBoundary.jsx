
import React from 'react'
import ErrorMessage from './ErrorMessage'
import Button from './Button'
import './ErrorBoundary.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.MODE === 'development'
      
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p className="error-message">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            {isDev && this.state.errorInfo && (
              <details className="error-details">
                <summary>Technical Details</summary>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            
            <div className="error-actions">
              <Button 
                variant="primary" 
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary