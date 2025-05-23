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
      const name = player["Player Name"];
      if (!totals[name]) {
        totals[name] = {
          Goals: 0,
          Assists: 0,
          PTS: 0,
          "Goals Allowed": 0,
          Saves: 0,
          Shutout: 0
        };
      }
      ["Goals", "Assists", "PTS", "Goals Allowed", "Saves", "Shutout"].forEach(stat => {
        totals[name][stat] += parseInt(player[stat]) || 0;
      });
    });

    const tbody = document.querySelector('#career-stats-table tbody');
    Object.entries(totals).forEach(([name, stats]) => {
      const row = `
        <tr>
          <td>${name}</td>
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
function sortCareerTable(column) {
  const table = document.getElementById('career-stats-table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const columnIndex = Array.from(table.querySelectorAll('thead th')).findIndex(th =>
    th.textContent.trim() === column
  );

  const ascending = !table.dataset.sortOrder || table.dataset.sortOrder === 'desc';
  table.dataset.sortOrder = ascending ? 'asc' : 'desc';

  rows.sort((a, b) => {
    const cellA = a.children[columnIndex].textContent.trim();
    const cellB = b.children[columnIndex].textContent.trim();
    const numA = parseFloat(cellA);
    const numB = parseFloat(cellB);

    if (!isNaN(numA) && !isNaN(numB)) {
      return ascending ? numA - numB : numB - numA;
    }
    return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
  });

  rows.forEach(row => tbody.appendChild(row));
}
