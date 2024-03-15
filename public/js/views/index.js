const ctx1 = document.getElementById("chart1");
const ctx2 = document.getElementById("chart2");
const ctx3 = document.getElementById("chart3");

var chart1 = new Chart(ctx1, {
  type: "bar",
  data: {
    labels: ["Utentes", "Bairros", "Licenças", "Pontos"],
    datasets: [
      {
        label: "Nº Total",
        data: [ut, bar, lic, mark],
        borderWidth: 1,
        backgroundColor: ["#38c94c", "#d6b627", "indigo", "#16acde"],
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
  type: "bar",
  data: {
    labels: ["Pendente", "Letígio", "Regularizado"],
    datasets: [
      {
        label: "Nº Total",
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

var chart3 = new Chart(ctx3, {
  type: "pie",
  data: {
    labels: [
      `Pendente ${percpend}%`,
      `Letígio ${percleti}%`,
      `Regularizado ${percreg}%`,
    ],
    datasets: [
      {
        label: "% Total",
        data: [percpend, percleti, percreg],
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
