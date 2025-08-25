import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between gap-6">
        <Link to="/" className="text-xl font-semibold tracking-tight flex items-center">
          Todo<span className="text-primary">App</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          
          {/* Show Tasks link only when user is logged in */}
          {user && (
            <Link to="/tasks" className="hover:text-primary transition-colors">Tasks</Link>
          )}
          
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground hidden sm:inline">{user.email}</span>
              <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild size="sm" variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}