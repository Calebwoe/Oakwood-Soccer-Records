const csvPath = 'Oakwood Soccer Project - Individual Statistics.csv';

async function fetchData() {
  const response = await fetch(csvPath);
  const text = await response.text();
  const rows = text.trim().split('\n');
  const headers = rows[0].split(',');

  const data = rows.slice(1).map(row => {
    const values = row.split(',');
    return {
      player: values[0],
      grade: values[1],
      year: values[2],
      goals: values[3],
      assists: values[4],
      points: values[5],
      GA: values[6],
      saves: values[7],
      shutouts: values[8],
    };
  });

  return data;
}

function populateTable(data) {
  const tbody = document.querySelector('#stats-table tbody');
  tbody.innerHTML = '';
  data.forEach(({ player, grade, year, goals, assists, points, GA, saves, shutouts }) => {
    const row = `
      <tr>
        <td>${player}</td>
        <td>${grade}</td>
        <td>${year}</td>
        <td>${goals}</td>
        <td>${assists}</td>
        <td>${points}</td>
        <td>${GA}</td>
        <td>${saves}</td>
        <td>${shutouts}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

function populateYearFilter(data) {
  const years = [...new Set(data.map(d => d.year))].sort();
  const filter = document.getElementById('filter-year');
  filter.innerHTML = '<option value="all">All Years</option>' +
    years.map(y => `<option value="${y}">${y}</option>`).join('');

  filter.addEventListener('change', () => {
    const selected = filter.value;
    const filtered = selected === 'all' ? data : data.filter(d => d.year === selected);
    populateTable(filtered);
  });
}

fetchData().then(data => {
  populateTable(data);
  populateYearFilter(data);
});

    
