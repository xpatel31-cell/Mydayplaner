'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { sortTasks } from '../../lib/scheduler';

export default function ChecklistPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) console.error(error);
    else setTasks(sortTasks(data));
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function toggleComplete(task) {
    await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id);
    loadTasks();
  }

  return (
    <div>
      <h1>Checklist</h1>
      <p>Check things off as you finish them. Unchecked tasks stay in your queue and move forward automatically on the Calendar page.</p>
      <div className="card">
        {loading && <p>Loading...</p>}
        {!loading && tasks.length === 0 && <p>Nothing here yet.</p>}
        {tasks.map((task) => (
          <div key={task.id} className={`task-row priority-${task.priority}`}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title} {task.due_date && `— due ${task.due_date}`}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
