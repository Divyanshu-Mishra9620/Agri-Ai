
import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error(err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-gray-600">Something went wrong.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
