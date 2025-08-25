import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { tasks } from '@/lib/api'  // Changed to the tasks API methods
import { TaskCard } from '@/components/TaskCard'
import { NewTaskForm } from '@/components/NewTaskForm'

export default function TaskList() {
  const { user } = useAuth()
  const [taskList, setTaskList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch tasks when component mounts
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setLoading(true)
      const response = await tasks.getAll() // Using the dedicated method
      setTaskList(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
      setError('Could not load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Simple loading state
  if (loading && taskList.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="mb-3">Loading tasks...</div>
          <div className="w-8 h-8 border-4 border-t-primary rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <Button onClick={fetchTasks} size="sm" variant="outline">
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      {taskList.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No tasks found. Create your first task!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {taskList.map(task => (
            <TaskCard key={task.id} task={task} onRefresh={fetchTasks} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <NewTaskForm onTaskCreated={fetchTasks} />
      </div>
    </div>
  )
}