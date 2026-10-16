
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API = 'http://localhost:5000/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState('')
  const [error, setError] = useState('')
  const [activeView, setActiveView] = useState('all')

  useEffect(() => {
    axios.get(API)
      .then((res) => setTasks(res.data))
      .catch(() => setError('Backend connect nahi hua.'))
  }, [])

  const filteredTasks = tasks.filter((item) => {
    if (activeView === 'completed') return item.completed
    if (activeView === 'upcoming') return !item.completed
    return true
  })

  async function addTask(e) {
    e.preventDefault()
    if (task.trim() === '') return

    try {
      const res = await axios.post(API, {
        title: task.trim()
      })
      setTasks([...tasks, res.data])
      setTask('')
      setError('')
    } catch {
      setError('Task add nahi hua.')
    }
  }

  async function toggleTask(id) {
    const item = tasks.find((t) => t.id === id)
    if (!item) return

    try {
      const res = await axios.put(`${API}/${id}`, {
        completed: !item.completed
      })

      setTasks(tasks.map((t) =>
        t.id === id ? res.data : t
      ))
    } catch {
      setError('Task update nahi hua.')
    }
  }

  async function deleteTask(id) {
    try {
      await axios.delete(`${API}/${id}`)
      setTasks(tasks.filter((t) => t.id !== id))
      setError('')
    } catch {
      setError('Task delete nahi hua.')
    }
  }

  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">TaskFlow<span>.</span></h2>
        <p className="menu-title">WORKSPACE</p>

        <button
          type="button"
          className={`menu ${activeView === 'all' ? 'active' : ''}`}
          onClick={() => setActiveView('all')}
        >
          ▦ &nbsp; My Tasks
        </button>

        <button
          type="button"
          className={`menu ${activeView === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveView('upcoming')}
        >
          ◷ &nbsp; Upcoming
        </button>

        <button
          type="button"
          className={`menu ${activeView === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveView('completed')}
        >
          ✓ &nbsp; Completed
        </button>

        <div className="sidebar-bottom">
          <div className="avatar">C</div>
          <div>
            <strong>My Workspace</strong>
            <p>Personal account</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span>Workspace / My Tasks</span>
          <div className="profile">CK</div>
        </header>

        <section className="content">
          <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>Stay focused. Get things done.</h1>
          <p className="subtitle">
            Organize your day, one task at a time.
          </p>

          <div className="stats">
            <div className="stat-card">
              <p>Total Tasks</p>
              <h2>{tasks.length}</h2>
            </div>
            <div className="stat-card">
              <p>Completed</p>
              <h2>{completedTasks}</h2>
            </div>
            <div className="stat-card">
              <p>Remaining</p>
              <h2>{tasks.length - completedTasks}</h2>
            </div>
          </div>

          <div className="task-section">
            <div className="section-heading">
              <div>
                <h2>
                  {activeView === 'all' && 'My Tasks'}
                  {activeView === 'upcoming' && 'Upcoming Tasks'}
                  {activeView === 'completed' && 'Completed Tasks'}
                </h2>
                <p>
                  {activeView === 'all' && 'Manage your daily priorities'}
                  {activeView === 'upcoming' && 'Tasks still waiting to be done'}
                  {activeView === 'completed' && 'Tasks you have already finished'}
                </p>
              </div>
              <span className="task-count">
                {filteredTasks.length} tasks
              </span>
            </div>

            <form className="task-form" onSubmit={addTask}>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button type="submit">+ Add Task</button>
            </form>

            {error && <p>{error}</p>}

            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✓</div>
                  <h3>
                    {activeView === 'all' && 'No tasks yet'}
                    {activeView === 'upcoming' && 'No upcoming tasks'}
                    {activeView === 'completed' && 'No completed tasks'}
                  </h3>
                  <p>
                    {activeView === 'all' && 'Add your first task and start making progress.'}
                    {activeView === 'upcoming' && 'Everything is done. Great job!'}
                    {activeView === 'completed' && 'Finish a task to see it here.'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((item) => (
                  <div className="task-item" key={item.id}>
                    <label className="task-label">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleTask(item.id)}
                      />
                      <span className={item.completed ? 'done' : ''}>
                        {item.title}
                      </span>
                    </label>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(item.id)}
                      aria-label="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
