const csvPath = 'Oakwood Soccer Project - Individual Statistics.csv'

async function fetchData() {
  const response = await fetch(csvPath);
  const text = await response.text();
  const rows = text.trim().split('\n').slice(1);
  const data = rows.map(row => {
    const [player, grade, year, goals, assists, Points, GA, saves, shutouts] };
});

  return data;
}

function populateTable(data) {
  const tbody = document.querySelector('#stats-table tbody');
  tbody.innerHTML= '';
  data.forEach(({ player, year, goals, assists, goals against, saves, shutouts }) => {
               const row = '<tr>
                 <td>${player}</td>
                 <td>${grade}</td>
                 <td>${year}</td>
                 <td>${goals}</td>
                 <td>${assists}</td>
                 <td>${points}</td>
                 <td>${GA}</td>
                 <td>${saves}</td>
                 <td>${shutouts}</td>
                </tr>';
    tbody.insertAdjacentHTML('beforeend', row);
  });
}
function populateYearFilter(data) {
  const years = [...new Set(data.map(d => d.year))].sort();
  const filter = document.getElementById('filter-year')
  filter.innerHTML = '<option value="all">All Years</option>' +
    years.map(y => '<option value="${y}">${y}</option>').join('');

  filter.addEventListener('change', () => {
    const selected = filter.value;
    const filtered = selected === 'all' ? data: data.filter(d => d.year === selected);
    populateTable(filtered);
  });
}

fetchData().then(data => {
  populateTable(data);
  populateYearFilter(data);
});
    
