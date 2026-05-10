import { Component } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Command from './pages/Command'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <h2 className="text-text text-xl mb-2">出了点问题</h2>
            <p className="text-text-muted mb-4">页面加载时发生错误</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-terminal/10 text-terminal hover:bg-terminal/20 transition-colors"
            >
              重新加载
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/command/:name" element={<Command />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ErrorBoundary>
  )
}
