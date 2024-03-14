const ctx1 = document.getElementById("chart1");
const ctx2 = document.getElementById("chart2");

var chart1 = new Chart(ctx1, {
  type: "bar",
  data: {
    labels: ["Licenças", "Utentes", "Bairros", "Pontos"],
    datasets: [
      {
        label: "# total",
        data: [ut, bar, lic, mark],
        borderWidth: 1,
        backgroundColor: ["#38c94c", "#d6b627", "#de342a", "#16acde"],
        labelColor: "red",
      },
    ],
  },
  options: {
    scales: {
      x: {
        grid: {
          color: "#de342a",
        },
      },
      y: {
        grid: {
          color: "#de342a",
        },
      },
    },
  },
});

var chart2 = new Chart(ctx2, {
  type: "pie",
  data: {
    labels: ["Pendente", "Letígio", "Regularizado"],
    datasets: [
      {
        label: "% Total",
        data: [pend, leti, reg],
        borderWidth: 1,
        backgroundColor: ["#d6b627", "#de342a", "#38c94c"],
        labelColor: "red",
      },
    ],
  },
  options: {
    scales: {
      x: {
        grid: {
          color: "#de342a",
        },
      },
      y: {
        grid: {
          color: "#de342a",
        },
      },
    },
  },
});
