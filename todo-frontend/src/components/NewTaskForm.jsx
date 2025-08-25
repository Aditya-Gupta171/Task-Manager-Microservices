import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { tasks } from '@/lib/api' // Import the tasks API methods

export function NewTaskForm({ onTaskCreated }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      
      const payload = {
        title: formData.title,
        description: formData.description || null,
        dueDate: formData.dueDate || null
      }
      
      await tasks.create(payload) // Using the dedicated method
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        dueDate: ''
      })
      
      // Close form and refresh task list
      setIsFormOpen(false)
      onTaskCreated()
      
    } catch (err) {
      console.error('Failed to create task:', err)
      setError('Failed to create task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Simple toggle button when form is closed
  if (!isFormOpen) {
    return (
      <Button onClick={() => setIsFormOpen(true)} className="w-full">
        + Add New Task
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Add New Task</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px]"
              placeholder="Add details about this task..."
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date (optional)
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2 pt-0">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => setIsFormOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}