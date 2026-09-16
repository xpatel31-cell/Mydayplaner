'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { scheduleTasks } from '../../lib/scheduler';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CalendarPage() {
  const [availability, setAvailability] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(true);

  const [day, setDay] = useState(1);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');

  async function loadEverything() {
    setLoading(true);

    const { data: availRows } = await supabase.from('availability').select('*');
    const { data: taskRows } = await supabase.from('tasks').select('*');

    setAvailability(availRows || []);

    const result = scheduleTasks(taskRows || [], availRows || []);
    setScheduled(result);

    setLoading(false);
  }

  useEffect(() => {
    loadEverything();
  }, []);

  async function addAvailability(e) {
    e.preventDefault();
    await supabase.from('availability').insert({
      day_of_week: Number(day),
      start_time: start,
      end_time: end,
    });
    loadEverything();
  }

  async function removeAvailability(id) {
    await supabase.from('availability').delete().eq('id', id);
    loadEverything();
  }

  return (
    <div>
      <h1>Calendar</h1>

      <div className="card">
        <h3>Your working hours</h3>
        <form onSubmit={addAvailability}>
          <label>
            Day
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              {DAY_NAMES.map((name, i) => (
                <option key={i} value={i}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Start time
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label>
            End time
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>
          <button type="submit">Add hours</button>
        </form>

        <div style={{ marginTop: '16px' }}>
          {availability.map((row) => (
            <div key={row.id} className="task-row">
              <span>{DAY_NAMES[row.day_of_week]}: {row.start_time}–{row.end_time}</span>
              <button onClick={() => removeAvailability(row.id)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Auto-scheduled tasks</h3>
        {loading && <p>Loading...</p>}
        {!loading && scheduled.length === 0 && <p>No incomplete tasks to schedule.</p>}
        {scheduled.map((task) => (
          <div key={task.id} className={`task-row priority-${task.priority}`}>
            <div>
              <strong>{task.title}</strong>
              {task.scheduled_start
                ? <span> — {new Date(task.scheduled_start).toLocaleString()}</span>
                : <span> — no open slot found in the next 2 weeks</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
