import PDFDocument from 'pdfkit';
import fs from 'fs'
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
    return Math.floor(funcionGeneradora() * (maximo - minimo )) + minimo  // 91 * [0.00001 - 0.9999999]
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
  let tipos: TipoVehiculo[] = ['Moto', 'Auto',   'Pesado'];
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

// --- Límites de velocidad por clima y tipo de vehículo ---
const limites: Record<Clima, Record<TipoVehiculo, number>> = {
  SECO:     { Auto: 130, Moto: 130, Pesado: 90 },
  LLUVIOSO: { Auto: 110, Moto: 110, Pesado: 80 },
  NIEVE:    { Auto: 80,  Moto: 60,  Pesado: 60 }
};

// --- Función para evaluar multa ---
function evaluarMulta(clima: Clima, registro: RegistroSensor) {
  const limite = limites[clima][registro.tipo];
  if (registro.velocidad <= limite) {
    return null; // No hay multa
  }

  // Calcular el exceso de velocidad
  const exceso = ((registro.velocidad - limite) / limite) * 100;

  let monto = 0;
  if (exceso <= 5) {
    monto = 1000;  // 1000 pesos si el exceso es menor o igual al 5%
  } else if (exceso > 5 && exceso <= 15) {
    monto = 40000; // 40,000 pesos si el exceso está entre el 5% y el 15%
  } else {
    monto = 80000; // 80,000 pesos si el exceso es mayor al 15%
  }

  return { limite, exceso, monto };
}

// --- Simulación continua del sensor con clima dinámico ---
let simularSensor = async (intervaloMin: number, intervaloMax: number, esperaMin: number, esperaMax: number, notificar:Notificacion,connection:mysql2.Connection): Promise<void> => {
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

  // --- Verificar multa y registrar --- 
 const resultadoMulta = evaluarMulta(climaActual, registroSensor);
    if (resultadoMulta) {
      // Si hay una multa, generar una nueva ID para la multa
      const transitoId = uuid.v4(); // Generamos el ID del transito

      // Insertamos el registro en la tabla 'transito'
      await connection.query(
        "INSERT INTO transito (id, patente, tipo_vehiculo, fecha_registro, velocidad_medida) VALUES (?, ?, ?, ?, ?)",
        [transitoId, registroSensor.patente, registroSensor.tipo, new Date(), registroSensor.velocidad]
      );

      // Generamos una nueva ID para la multa
      const idActas = uuid.v4();

      console.log(`🚨 Infracción detectada! Exceso: ${resultadoMulta.exceso.toFixed(2)}% — Monto: $${resultadoMulta.monto}`);

      // Insertamos la multa en la tabla 'actas'
     await connection.query(
  `INSERT INTO actas (id, transito_id, monto, fecha_emision)
   VALUES (?, ?, ?, ?)`,
  [
    idActas,
    transitoId,  // Usamos el ID de transito insertado  
    resultadoMulta.monto,  // Asegúrate de que es el monto y no limite o exceso
    new Date()  // Fecha de la multa
  ]);



  /////////////////  Aquí comienza la nueva función para generar PDF ///////////////////////////////////////


// Función para generar un PDF
let generarPDF = (acta: any) => {
  const doc = new PDFDocument();
  const filePath = `./actas/${acta.id_acta}.pdf`;

  // Crear carpeta si no existe
  if (!fs.existsSync('./actas')) {
    fs.mkdirSync('./actas');
  }

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(16).text(`Acta de Tránsito - ID: ${acta.id_acta}`, { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(`Patente: ${acta.patente}`);
  doc.text(`Tipo de Vehículo: ${acta.tipo_vehiculo}`);
  doc.text(`Fecha de Registro: ${acta.fecha_registro}`);
  doc.text(`Velocidad Medida: ${acta.velocidad_medida} km/h`);
  doc.text(`Monto de Multa: $${acta.monto}`);
  doc.text(`Fecha de Emisión: ${acta.fecha_emision}`);

  doc.end();
  
};

const acta = {
  id_acta: idActas,
  patente: registroSensor.patente,
  tipo_vehiculo: registroSensor.tipo,
  fecha_registro: new Date().toLocaleTimeString(),
  velocidad_medida: registroSensor.velocidad,
  monto: resultadoMulta.monto,
  fecha_emision: new Date().toLocaleTimeString(),
};

// Llamada para generar PDF

generarPDF(acta);

      console.log('✅ Acta registrada en la tabla actas y PDF generado.');
    } else {
      console.log('✅ No corresponde multa.');
    }
  }
};

/////////////////// ACA TERMINA EL CREAR PDF /////////////////////////////////////////

let jump = async () => {
  const connection = await mysql2.createConnection({
    host: '164.92.175.164',
    user: 'nahuel',
    port: 3306,
    password: '123456789',
    database: 'Nicolas-Multas'
  });

  // --- Ejecutar simulación ---
  await simularSensor(2, 6, 1, 5, async (clima, registroSensor) => {
    console.log("***************************************")
    console.log(clima)
    console.log(registroSensor)
    procesarLectura(registroSensor);

    await connection.query("insert into transito (id, patente, tipo_vehiculo, fecha_registro, velocidad_medida) values (?, ?, ?, ?, ?)", 
            [uuid.v4(), registroSensor.patente, registroSensor.tipo, new Date(), registroSensor.velocidad])
  }, connection)
  
  
  // connection.end()
  

} 

jump()


