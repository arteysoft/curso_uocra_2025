// Integración con main.js usando el sistema de eventos
document.addEventListener('DOMContentLoaded', () => {

  let tiempo = async () => {
    return await new Promise((next) => { setTimeout(next, 1000)  })
  }

  let traerLosDatosDeVentas = async () => {
        let paso1 = await fetch('/datos')
        let paso2 = await paso1.json()
        console.log(paso2)
        return paso2.arrDatos
    }

  document.getElementById('btnArrancar').addEventListener('click', async () => { 
     await tiempo()
     dibujarConApiGoogleChart(await traerLosDatosDeVentas())
  })

  let dibujarConApiGoogleChart = (dataArray) => {
    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable(dataArray);

        var options = {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
  }
})

