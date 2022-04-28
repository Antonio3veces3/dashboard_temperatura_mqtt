/*let canva = document.getElementById('myChart').getContext("2d");
const obtenerTramas = async()=>{
   const res = await fetch(`http://localhost:3000/tramas`);
   return await res.json();
}
obtenerTramas().then((datos)=>{
let xValues = [
  "27/05/2022",
  "28/05/2022",
  "28/05/2022"
];
let yValues = [datos[0].value, datos[1].value, datos[2].value];
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
}).catch(console.log);*/




