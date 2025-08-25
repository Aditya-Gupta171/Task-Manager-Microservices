import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-16">
          <Outlet />
        </div>
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TodoApp
      </footer>
    </div>
  )
}