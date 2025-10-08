// Integración con main.js usando el sistema de eventos
document.addEventListener('DOMContentLoaded', () => {

  let tiempo = async () => {
    return await new Promise((next) => { setTimeout(next, 1000)  })
  }

  document.getElementById('btnArrancar').addEventListener('click', async () => { 
     for (let idx = 0; idx < 10; idx++) {
      document.getElementById('txtOutput').innerHTML = idx
      await tiempo()
     }
  })
})

