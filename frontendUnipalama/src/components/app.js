// === Variabili e setup iniziale ===
var wacom = new wacomstu430();
var canvas = document.getElementById("signatureCanvas");
var context = canvas.getContext("2d");

// NOTA: Non disegniamo uno sfondo bianco nel canvas tramite JavaScript,
// così il contenuto effettivamente salvato (toDataURL) avrà sfondo trasparente.

// Variabili per il disegno
var isDrawing = false, lastX = 0, lastY = 0;

/* 
  I dati grezzi ora sono nel range:
    X: 0 – 9600
    Y: 0 – 6000
  Quindi, per mappare su un canvas di 320×200:
      scaleX = 320 / 9600 ≈ 0.03333
      scaleY = 200 / 6000 ≈ 0.03333
*/
const rawMaxX = 9600;
const rawMaxY = 6000;
const scaleX = canvas.width / rawMaxX;
const scaleY = canvas.height / rawMaxY;

// Imposta una soglia di pressione per considerare la penna in contatto (35 funziona bene)
const sensitivityThreshold = 35;

// === Gestione dei pulsanti ===
document.getElementById("connectBtn").addEventListener("click", async function(){
  if (await wacom.connect()) {
    console.log("Connesso alla STU‑430");
    // Esegui un clear sulla tavoletta per eliminare eventuali firme precedenti
    await wacom.clearScreen();
    await wacom.setWritingMode(1);
    await wacom.setWritingArea({ x1: 0, y1: 0, x2: 320, y2: 200 });
    await wacom.setInking(true);
    await wacom.setPenColorAndWidth("#000000", 2);
  }z
});

document.getElementById("clearBtn").addEventListener("click", async function(){
  if (wacom.checkConnected()){
    await wacom.clearScreen();
  }
  // Pulisce il canvas senza disegnare uno sfondo, lasciando la trasparenza
  context.clearRect(0, 0, canvas.width, canvas.height);
});

// document.getElementById("saveBtn").addEventListener("click", function(){
//   // Ottieni l'immagine PNG; lo sfondo non sarà bianco perché non è stato disegnato sul canvas
//   var dataURL = canvas.toDataURL("image/png");
//   var a = document.createElement("a");
//   a.href = dataURL;
//   a.download = "signature.png"; //linea codigo de descarga de la imagen a carpetas descargas del equipo con nombre signature
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// });

document.getElementById('saveButton').addEventListener('click', () => {
const dataURL = canvas.toDataURL('image/png');
fetch('/save-signature', {// se guarda en la carpeta signature del proyecto
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: dataURL }),
})
.then(response => response.json())
.then(data => {
    alert('Firma guardada correctamente');
})
.catch(error => {
    console.error('Error:', error);
});
});


// === Gestione dei dati penna ===
// Usa la pressione per decidere se disegnare; disegna solo se pen.press supera la soglia.
wacom.onPenData(function(pen) {
  //console.log("Pen event:", pen);
  if (pen.press > sensitivityThreshold) {
    // Scala le coordinate dai valori grezzi al range del canvas
    var drawX = pen.cx * scaleX;
    var drawY = pen.cy * scaleY;
    
    if (!isDrawing) {
      isDrawing = true;
      lastX = drawX;
      lastY = drawY;
    } else {
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(drawX, drawY);
      var dynamicLineWidth = 2 + (pen.press - sensitivityThreshold) / 20;
      context.strokeStyle = "#000000";
      context.lineWidth = dynamicLineWidth;
      context.stroke();
      lastX = drawX;
      lastY = drawY;
    }
  } else {
    isDrawing = false;
  }
});