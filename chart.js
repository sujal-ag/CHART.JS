async function loadCSV() {
  const response = await fetch("data.csv");
  const text = await response.text();

  const sections = text
    .split("#")
    .map((s) => s.trim())
    .filter(Boolean);
  const dataMap = {};

  sections.forEach((section) => {
    const [titleLine, ...lines] = section.split("\n").filter(Boolean);
    const title = titleLine.trim();
    const [header, ...rows] = lines;
    const [xLabel, yLabel] = header.split(",");
    const x = [],
      y = [];

    rows.forEach((row) => {
      const [a, b] = row.split(",");
      x.push(a);
      y.push(Number(b));
    });

    dataMap[title] = { x, y, xLabel, yLabel };
  });

  return dataMap;
}

function createChart(id, label, labels, data, color) {
  new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          borderColor: color,
          backgroundColor: color + "33",
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        duration: 1500,
        easing: "easeOutCubic",
      },
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

loadCSV().then((data) => {
  createChart(
    "salesChart",
    "Sales",
    data["Sales Over Time"].x,
    data["Sales Over Time"].y,
    "blue"
  );
  createChart(
    "expensesChart",
    "Expenses",
    data["Expenses Over Time"].x,
    data["Expenses Over Time"].y,
    "red"
  );
  createChart(
    "profitsChart",
    "Profit",
    data["Profits by Category"].x,
    data["Profits by Category"].y,
    "green"
  );
  createChart(
    "usersChart",
    "Users",
    data["Users per Region"].x,
    data["Users per Region"].y,
    "purple"
  );
});
