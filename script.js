const csvPath = 'Oakwood Soccer Project - Individual Statistics.csv';

async function fetchData() {
  const response = await fetch(csvPath);
  const text = await response.text();
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

  return data;
}

function populateTable(data) {
  const tbody = document.querySelector('#stats-table tbody');
  tbody.innerHTML = '';

  data.forEach(player => {
    const row = `
      <tr>
        <td>${player["Player Name"]}</td>
        <td>${player.Grade}</td>
        <td>${player.Year}</td>
        <td>${player.Goals}</td>
        <td>${player.Assists}</td>
        <td>${player["PTS"]}</td>
        <td>${player["Goals Allowed"]}</td>
        <td>${player.Saves}</td>
        <td>${player.Shutout}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function populateYearFilter(data, originalData) {
  const years = [...new Set(data.map(d => d.Year))].sort();
  const filter = document.getElementById('filter-year');
  if (!filter) return;

  filter.innerHTML = '<option value="all">All Years</option>' +
    years.map(y => `<option value="${y}">${y}</option>`).join('');

  filter.addEventListener('change', () => {
    const selected = filter.value;
    const filtered = selected === 'all' ? data : originalData.filter(d => d.Year === selected);
    populateTable(filtered);
  });
}

let fullData = [];
let currentSort = { key: 'Goals', asc: false };

function sortTable(key) {
  if (currentSort.key === key) {
    currentSort.asc = !currentSort.asc;
  } else {
    currentSort = { key, asc: false }; // Default to descending
  }

  const sorted = fullData.sort((a, b) => {
    const valA = isNaN(a[key]) ? a[key] : +a[key];
    const valB = isNaN(b[key]) ? b[key] : +b[key];

    if (!isNaN(valA) && !isNaN(valB)) {
      if (key === 'Goals' && valA === valB) {
        const ptsA = +a["PTS"] || 0;
        const ptsB = +b["PTS"] || 0;
        return currentSort.asc ? ptsA - ptsB : ptsB - ptsA;
      }
      return currentSort.asc ? valA - valB : valB - valA;
    }

    return currentSort.asc
      ? String(valA).localeCompare(valB)
      : String(valB).localeCompare(valA);
  });

  populateTable(sorted);
  updateSortIndicators(key);
}

function updateSortIndicators(sortedKey) {
  const headers = document.querySelectorAll('#stats-table thead th');
  headers.forEach(header => {
    const span = header.querySelector('span');
    const headerKey = span.textContent.trim().replace(/ ▲| ▼/, '');
    span.textContent = headerKey;
    header.classList.remove('sorted');

    if (headerKey === sortedKey) {
      span.textContent += currentSort.asc ? ' ▲' : ' ▼';
      header.classList.add('sorted');
    }
  });
}

// Initial load
fetchData().then(data => {
  fullData = data;

  // Initial sort by Goals descending with PTS as tiebreaker
  fullData.sort((a, b) => {
    const goalsA = +a.Goals || 0;
    const goalsB = +b.Goals || 0;
    if (goalsA === goalsB) {
      const ptsA = +a.PTS || 0;
      const ptsB = +b.PTS || 0;
      return ptsB - ptsA;
    }
    return goalsB - goalsA;
  });

  populateTable(fullData);
  populateYearFilter(fullData, data);
  updateSortIndicators('Goals');
}).catch(err => {
  console.error('Error loading or parsing data:', err);
});

