let currentSortedColumn = null;
let currentSortOrder = 'desc'; // default to descending

function sortCareerTable(column, isInitial = false) {
  const table = document.getElementById('career-stats-table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const headers = Array.from(table.querySelectorAll('thead th'));
  const columnIndex = headers.findIndex(th => th.dataset.column === column);

  // Determine sort order
  if (!isInitial) {
    if (currentSortedColumn === column) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortedColumn = column;
      currentSortOrder = 'desc'; // always start descending
    }
  } else {
    currentSortedColumn = column;
    currentSortOrder = 'desc'; // initial load sort order
  }

  // Reset headers
  headers.forEach(th => {
    th.classList.remove('sorted-asc', 'sorted-desc');
    const span = th.querySelector('span');
    if (span) span.textContent = th.dataset.column;
  });

  // Mark sorted header
  const current = headers[columnIndex];
  const span = current.querySelector('span');
  current.classList.add(currentSortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');
  span.textContent = column + (currentSortOrder === 'asc' ? ' ↑' : ' ↓');

  // Sort rows
  rows.sort((a, b) => {
    const cellA = a.children[columnIndex].textContent.trim();
    const cellB = b.children[columnIndex].textContent.trim();
    const numA = parseFloat(cellA);
    const numB = parseFloat(cellB);

    if (!isNaN(numA) && !isNaN(numB)) {
      return currentSortOrder === 'asc' ? numA - numB : numB - numA;
    }
    return currentSortOrder === 'asc'
      ? cellA.toLowerCase().localeCompare(cellB.toLowerCase())
      : cellB.toLowerCase().localeCompare(cellA.toLowerCase());
  });

  rows.forEach(row => tbody.appendChild(row));
}

// Load data and build table
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
      const nameKey = rawName.toLowerCase();

      if (!totals[nameKey]) {
        totals[nameKey] = {
          displayName: rawName,
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

    // Initial sort by Goals descending
    sortCareerTable('Goals', true);
  });
