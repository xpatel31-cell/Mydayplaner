export default function Home() {
  return (
    <div>
      <h1>Your Schedule App</h1>
      <p>
        This is your starting dashboard. Use the navigation bar above to add
        assignments, check things off your list, and see your auto-organized
        calendar.
      </p>
      <div className="card">
        <h3>How it works</h3>
        <ul>
          <li>Add tasks on the <strong>Assignments</strong> page (due date, priority, how long it takes).</li>
          <li>The <strong>Calendar</strong> page automatically slots them into your open hours.</li>
          <li>Check tasks off on the <strong>Checklist</strong> page — anything left unchecked past its time gets bumped to the next open slot.</li>
        </ul>
      </div>
    </div>
  );
}
