import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { tasks } from '@/lib/api' // Import the tasks API methods

export function TaskCard({ task, onRefresh }) {
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Format date for display (if due date exists)
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString() 
    : null
  
  async function toggleComplete() {
    try {
      setUpdating(true)
      await tasks.toggleComplete(task.id, !task.completed) // Using the dedicated method
      onRefresh() // Refresh task list
    } catch (err) {
      console.error('Failed to update task:', err)
    } finally {
      setUpdating(false)
    }
  }
  
  async function deleteTask() {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      setDeleting(true)
      await tasks.delete(task.id) // Using the dedicated method
      onRefresh() // Refresh task list
    } catch (err) {
      console.error('Failed to delete task:', err)
    } finally {
      setDeleting(false)
    }
  }
  
  return (
    <Card className={`border ${task.completed ? 'bg-muted/50' : 'bg-card'}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div 
            className={`mt-1 h-5 w-5 rounded-sm border flex-shrink-0 cursor-pointer ${
              task.completed 
                ? 'bg-primary border-primary flex items-center justify-center text-white'
                : 'border-muted-foreground/30'
            }`}
            onClick={toggleComplete}
          >
            {task.completed && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" height="16" 
                fill="currentColor" 
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
              </svg>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`mt-1 text-sm ${task.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                {task.description}
              </p>
            )}
            
            {formattedDate && (
              <div className="mt-3 text-xs text-muted-foreground flex items-center">
                <svg 
                  className="mr-1"
                  xmlns="http://www.w3.org/2000/svg" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                Due: {formattedDate}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-2 pb-4">
        <Button 
          onClick={toggleComplete}
          variant="outline" 
          size="sm"
          disabled={updating}
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
        
        <Button 
          onClick={deleteTask}
          variant="destructive" 
          size="sm"
          disabled={deleting}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}