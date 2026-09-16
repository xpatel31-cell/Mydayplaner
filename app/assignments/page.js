'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AssignmentsPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(2);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) console.error(error);
    else setTasks(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.from('tasks').insert({
      title,
      description,
      due_date: dueDate || null,
      priority: Number(priority),
      duration_minutes: Number(duration),
    });

    if (error) {
      alert('Error adding task: ' + error.message);
      return;
    }

    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority(2);
    setDuration(30);
    loadTasks();
  }

  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id);
    loadTasks();
  }

  return (
    <div>
      <h1>Assignments</h1>

      <div className="card">
        <h3>Add a new task</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>
            Due date
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
          <label>
            Priority
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value={1}>High</option>
              <option value={2}>Medium</option>
              <option value={3}>Low</option>
            </select>
          </label>
          <label>
            Duration (minutes)
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min={5}
              step={5}
            />
          </label>
          <button type="submit">Add task</button>
        </form>
      </div>

      <div className="card">
        <h3>All tasks</h3>
        {loading && <p>Loading...</p>}
        {!loading && tasks.length === 0 && <p>No tasks yet — add one above.</p>}
        {tasks.map((task) => (
          <div key={task.id} className={`task-row priority-${task.priority}`}>
            <div>
              <strong>{task.title}</strong>
              {task.due_date && <span> — due {task.due_date}</span>}
              {task.completed && <span> ✅</span>}
            </div>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
