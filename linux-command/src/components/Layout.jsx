import Navbar from './Navbar'
import Footer from './Footer'
import { useTheme } from '../hooks/useTheme'

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
