import mysql2 from 'mysql2/promise'
let uuid = require('uuid') 

type TipoVehiculo = 'Moto' | 'Auto' | 'Pesado';
type Clima = 'SECO' | 'LLUVIOSO' | 'NIEVE';

interface RegistroSensor {
  patente: string;
  velocidad: number;
  tipo: TipoVehiculo;
  tiempo: number; // este no lo guardaria
}

type Notificacion = (clima:Clima, registroSensor:RegistroSensor) => void
type FuncionGeneradoraNumero = () => number

// --- Variable global para el clima actual ---
let climaActual: Clima = 'SECO';
let tiempoUltimoCambioClima = 0; // en segundos

let crearNumeroRandom = (minimo: number, maximo: number, funcionGeneradora:FuncionGeneradoraNumero) => {
    return Math.floor(funcionGeneradora() * (maximo - minimo)) + minimo  // 91 * [0.00001 - 0.9999999]
}

// --- Función para generar una lectura del sensor ---
let generarLectura = (tiempo: number): RegistroSensor => {
  let letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  let patente = 
      letras[Math.floor(Math.random() * letras.length)] +
      letras[Math.floor(Math.random() * letras.length)] +
      Math.floor(100 + Math.random() * 900).toString() +
      letras[Math.floor(Math.random() * letras.length)] +
      letras[Math.floor(Math.random() * letras.length)];
  
  let velocidad = crearNumeroRandom(40, 140, () => Math.random())
  let tipos: TipoVehiculo[] = ['Moto', 'Auto', 'Pesado'];
  let tipo = tipos[crearNumeroRandom(0, tipos.length, () => Math.random())];

  return { patente, velocidad, tipo, tiempo };
};

// --- Función que procesa la lectura ---
let procesarLectura = (sensor: RegistroSensor): void => {
  console.log(`⏱️ Tiempo: ${sensor.tiempo}s`);
  console.log(`🌤️ Clima: ${climaActual}`);
  console.log(`Patente: ${sensor.patente}`);
  console.log(`Tipo: ${sensor.tipo}`);
  console.log(`Velocidad: ${sensor.velocidad} km/h`);

  let valida = true;

  if (sensor.velocidad < 0 || sensor.velocidad > 200) {
    console.log(`⚠️ Velocidad fuera de rango`);
    valida = false;
  }

  if (valida) {
    console.log(`✅ Lectura válida\n`);
  } else {
    console.log(`❌ Lectura no válida\n`);
  }
};

let esperarRandom = () => {
  const CANT_MINIMA_SEGUNDOS = 1
  const CANT_MAXIMA_SEGUNDOS = 5
  const espera = crearNumeroRandom(CANT_MINIMA_SEGUNDOS, CANT_MAXIMA_SEGUNDOS, () => Math.random())
  return new Promise(resolve => setTimeout(resolve, espera * 1000));
};

// --- Actualizar clima si pasó 60 segundos ---
let actualizarClima = (tiempo: number = 60) => {
  if (tiempo - tiempoUltimoCambioClima >= 60) { // cada 1 minuto
    const climas: Clima[] = ['SECO', 'LLUVIOSO', 'NIEVE'];
    climaActual = climas[Math.floor(Math.random() * climas.length)];
    tiempoUltimoCambioClima = tiempo;
  }
};

// --- Simulación continua del sensor con clima dinámico ---
let simularSensor = async (intervaloMin: number, intervaloMax: number, esperaMin: number, esperaMax: number, notificar:Notificacion): Promise<void> => {
  console.log(`🔧 Iniciando simulación continua del sensor de velocidad...\n`);

  let tiempo = 0;
  while (true) {
    actualizarClima(tiempo); // actualizar clima antes de cada lectura
    let registroSensor = generarLectura(tiempo);

    const intervaloAleatorio = Math.floor(Math.random() * (intervaloMax - intervaloMin + 1)) + intervaloMin;
    tiempo += intervaloAleatorio;

    let clima:Clima = 'SECO'

    notificar(clima, registroSensor)

    await esperarRandom();
  }
};


let jump = async () => {
  const connection = await mysql2.createConnection({
    host: '164.92.175.164',
    user: 'andy',
    port: 3306,
    password: '123456789',
    database: 'andy_multas'
  });

  // --- Ejecutar simulación ---
  await simularSensor(2, 6, 1, 5, async (clima, registroSensor) => {
    console.log("***************************************")
    console.log(clima)
    console.log(registroSensor)
    procesarLectura(registroSensor);

    await connection.query("insert into transito (id, patente, tipo_vehiculo, fecha_registro, velocidad_medida) values (?, ?, ?, ?, ?)", 
            [uuid.v4(), registroSensor.patente, registroSensor.tipo, new Date(), registroSensor.velocidad])
  })
  
  // connection.end()
} 

// jump()

let arrCount = [0, 0, 0, 0, 0]
for (;;) {
  let sub = crearNumeroRandom(0, 3, () => Math.random())
  arrCount[sub]++
  console.log(arrCount)
}


