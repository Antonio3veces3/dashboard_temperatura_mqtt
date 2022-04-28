let canva = document.getElementById('myChart').getContext("2d");
let xValues = [
  "27/05/2022",
  "28/05/2022",
  "29/05/2022",
  "30/05/2022",
  "27/05/2022",
];
let yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];

new Chart(canva, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [
      {
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: yValues,
      },
    ],
  },
  options: {
    legend: { display: false }
  },
});
