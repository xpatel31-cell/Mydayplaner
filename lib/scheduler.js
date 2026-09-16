export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;

    if (a.due_date !== b.due_date) {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    return a.priority - b.priority;
  });
}

export function buildOpenWindows(availabilityRows, daysAhead = 14) {
  const windows = [];
  const now = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    const dayOfWeek = day.getDay();

    const rowsForDay = availabilityRows.filter((r) => r.day_of_week === dayOfWeek);

    rowsForDay.forEach((row) => {
      const [startH, startM] = row.start_time.split(':').map(Number);
      const [endH, endM] = row.end_time.split(':').map(Number);

      const windowStart = new Date(day);
      windowStart.setHours(startH, startM, 0, 0);

      const windowEnd = new Date(day);
      windowEnd.setHours(endH, endM, 0, 0);

      if (windowEnd > now) {
        windows.push({
          start: windowStart < now ? now : windowStart,
          end: windowEnd,
        });
      }
    });
  }

  return windows.sort((a, b) => a.start - b.start);
}

export function scheduleTasks(tasks, availabilityRows) {
  const incomplete = tasks.filter((t) => !t.completed);
  const ordered = sortTasks(incomplete);

  const windows = buildOpenWindows(availabilityRows).map((w) => ({ ...w }));

  const result = [];

  for (const task of ordered) {
    const durationMs = (task.duration_minutes || 30) * 60 * 1000;
    let placed = false;

    for (const window of windows) {
      const availableMs = window.end - window.start;
      if (availableMs >= durationMs) {
        result.push({ ...task, scheduled_start: new Date(window.start).toISOString() });
        window.start = new Date(window.start.getTime() + durationMs);
        placed = true;
        break;
      }
    }

    if (!placed) {
      result.push({ ...task, scheduled_start: null });
    }
  }

  return result;
}
