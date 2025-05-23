const csvPath = 'Oakwood Soccer Project- Individual Statistics.csv'

async function fetchData() {
  const response = await fetch(csvPath);
  const text = await response.text();
  const rows = text.trim().split('\n').slice(1);
  const data = rows.map(row => {
    const [player, year, goals, assists, goals against, saves, shutouts };
