function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Obtener todos los parámetros
var cita_id = getUrlParameter('cita_id');
var accion = getUrlParameter('accion').toUpperCase();
var email = getUrlParameter('email');
var nombreProveedor = getUrlParameter('nombreProveedor');

var titulo = document.getElementById("mensaje-titulo");
var detalle = document.getElementById("mensaje-detalle");
var pageTitle = document.querySelector("title");

if (accion === 'CONFIRMAR') {
    titulo.textContent = "✅ Gracias por confirmar";
    titulo.className = "confirmado";
    detalle.textContent = "Tu cita ha sido confirmada exitosamente.";
    pageTitle.textContent = "Cita Confirmada - DINET";
} else if (accion === 'CANCELAR') {
    titulo.textContent = "❌ Cita Cancelada";
    titulo.className = "cancelado";
    detalle.textContent = "Tu cita ha sido cancelada.";
    pageTitle.textContent = "Cita Cancelada - DINET";
} else if (accion === 'REPROGRAMAR') {
    titulo.textContent = "🔄 Solicitud de Reprogramación";
    titulo.className = "reprogramado";
    detalle.textContent = "Hemos recibido tu solicitud de reprogramación.";
    pageTitle.textContent = "Reprogramar Cita - DINET";
} else {
    titulo.textContent = "⚠️ Acción no reconocida";
    titulo.className = "";
    detalle.textContent = "No se pudo identificar la acción realizada.";
    pageTitle.textContent = "Acción no válida - DINET";
}

// Disparar webhook solo si hay cita_id y accion válida
if (cita_id && ['CONFIRMAR', 'CANCELAR', 'REPROGRAMAR'].includes(accion)) {
    var webhookUrl = 'https://prod-54.westus.logic.azure.com/workflows/e6ca8021d694492998bd18f5e45dbbb5/triggers/manual/paths/invoke/confirmacioncita?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=A8h4p5aTqsH7Irxmm0vGk8gSTmgqp5FbcCv-H5wy3tE' +
        '&cita_id=' + encodeURIComponent(cita_id) +
        '&accion=' + encodeURIComponent(accion) +
        '&email=' + encodeURIComponent(email) +
        '&nombreProveedor=' + encodeURIComponent(nombreProveedor);

    document.getElementById('webhook-trigger').src = webhookUrl;
// Hacer refresh de la página después de un breve delay para asegurar que el webhook se ejecute
    setTimeout(function() {
        // Redirigir a la misma página pero sin parámetros
        window.location.href = window.location.pathname;
    }, 1000); // 2 segundos de delay
}