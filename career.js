fetch('Oakwood Soccer Project - Individual Statistics.csv')
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split('\n');
    const headers = rows[0].split(',');
    const data = rows.slice(1).map(row => {
      const values = row.split(',');
      const obj = {};
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i]?.trim();
      });
      return obj;
    });

    const totals = {};
    data.forEach(player => {
      const rawName = player["Player Name"];
      const nameKey = rawName.toLowerCase(); // Normalize casing

      if (!totals[nameKey]) {
        totals[nameKey] = {
          displayName: rawName, // Save original casing
          Goals: 0,
          Assists: 0,
          PTS: 0,
          "Goals Allowed": 0,
          Saves: 0,
          Shutout: 0
        };
      }

      ["Goals", "Assists", "PTS", "Goals Allowed", "Saves", "Shutout"].forEach(stat => {
        totals[nameKey][stat] += parseInt(player[stat]) || 0;
      });
    });

    const tbody = document.querySelector('#career-stats-table tbody');
    Object.values(totals).forEach(stats => {
      const row = `
        <tr>
          <td>${stats.displayName}</td>
          <td>${stats.Goals}</td>
          <td>${stats.Assists}</td>
          <td>${stats.PTS}</td>
          <td>${stats["Goals Allowed"]}</td>
          <td>${stats.Saves}</td>
          <td>${stats.Shutout}</td>
        </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', row);
    });
  });

// Sorting function with arrows
function sortCareerTable(column) {
  const table = document.getElementById('career-stats-table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const headers = Array.from(table.querySelectorAll('thead th'));
  const columnIndex = headers.findIndex(th => th.textContent.trim() === column);

  // Determine and toggle sort order
  const current = headers[columnIndex];
  const currentArrow = current.querySelector('span');
  const ascending = !current.classList.contains('sorted-asc');

  // Reset all arrows
  headers.forEach(th => {
    th.classList.remove('sorted-asc', 'sorted-desc');
    const span = th.querySelector('span');
    if (span) span.textContent = span.textContent.replace(/[\u2191\u2193]/g, '');
  });

  // Add arrow to current column
  current.classList.add(ascending ? 'sorted-asc' : 'sorted-desc');
  currentArrow.textContent += ascending ? ' ↑' : ' ↓';

  // Sort rows
  rows.sort((a, b) => {
    const cellA = a.children[columnIndex].textContent.trim();
    const cellB = b.children[columnIndex].textContent.trim();
    const numA = parseFloat(cellA);
    const numB = parseFloat(cellB);

    if (!isNaN(numA) && !isNaN(numB)) {
      return ascending ? numA - numB : numB - numA;
    }
    return ascending
      ? cellA.toLowerCase().localeCompare(cellB.toLowerCase())
      : cellB.toLowerCase().localeCompare(cellA.toLowerCase());
  });

  // Re-attach sorted rows
  rows.forEach(row => tbody.appendChild(row));
}
