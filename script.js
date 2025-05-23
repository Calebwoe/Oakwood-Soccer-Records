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

function populateYearFilter(data) {
  const years = [...new Set(data.map(d => d.Year))].sort();
  const filter = document.getElementById('filter-year');
  if (!filter) return; // Don't break if filter isn't present

  filter.innerHTML = '<option value="all">All Years</option>' +
    years.map(y => `<option value="${y}">${y}</option>`).join('');

  filter.addEventListener('change', () => {
    const selected = filter.value;
    const filtered = selected === 'all' ? data : data.filter(d => d.Year === selected);
    populateTable(filtered);
  });
}

// Run the fetch + populate on page load
fetchData().then(data => {
  populateTable(data);
  populateYearFilter(data);
}).catch(err => {
  console.error('Error loading or parsing data:', err);
});

let currentSort = { key: '', asc: true };

function sortTable(key) {
  if (currentSort.key === key) {
    currentSort.asc = !currentSort.asc;
  } else {
    currentSort = { key, asc: true };
  }

  fetchData().then(data => {
    const sorted = data.sort((a, b) => {
      const valA = isNaN(a[key]) ? a[key] : +a[key];
      const valB = isNaN(b[key]) ? b[key] : +b[key];
      return currentSort.asc ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
    });

    populateTable(sorted);
    updateSortIndicators(key);
  });
}

function updateSortIndicators(sortedKey) {
  const headers = document.querySelectorAll('#stats-table thead th');
  headers.forEach(header => {
    const span = header.querySelector('span');
    const headerKey = span.textContent.trim();
    span.textContent = headerKey; // Reset to original
    header.classList.remove('sorted');

    if (headerKey === sortedKey) {
      span.textContent += currentSort.asc ? ' ▲' : ' ▼';
      header.classList.add('sorted');
    }
  });
}


    
