"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function CitaAction() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  // Obtener parámetros de URL
  const cita_id = searchParams.get("cita_id") || ""
  const accion = (searchParams.get("accion") || "").toUpperCase()
  const email = searchParams.get("email") || ""
  const nombreProveedor = searchParams.get("nombreProveedor") || ""

  // Estados para el contenido dinámico
  const [titulo, setTitulo] = useState("Cargando...")
  const [detalle, setDetalle] = useState("")
  const [tituloClass, setTituloClass] = useState("")
  const [pageTitle, setPageTitle] = useState("Acción de Cita")

  useEffect(() => {
    // Configurar contenido según la acción
    if (accion === "CONFIRMAR") {
      setTitulo("✅ Gracias por confirmar")
      setTituloClass("confirmado")
      setDetalle("Tu cita ha sido confirmada exitosamente.")
      setPageTitle("Cita Confirmada - DINET")
    } else if (accion === "CANCELAR") {
      setTitulo("❌ Cita Cancelada")
      setTituloClass("cancelado")
      setDetalle("Tu cita ha sido cancelada.")
      setPageTitle("Cita Cancelada - DINET")
    } else if (accion === "REPROGRAMAR") {
      setTitulo("🔄 Solicitud de Reprogramación")
      setTituloClass("reprogramado")
      setDetalle("Hemos recibido tu solicitud de reprogramación.")
      setPageTitle("Reprogramar Cita - DINET")
    } else {
      setTitulo("⚠️ Acción no reconocida")
      setTituloClass("")
      setDetalle("No se pudo identificar la acción realizada.")
      setPageTitle("Acción no válida - DINET")
    }

    // Actualizar el título de la página
    document.title = pageTitle

    setIsLoading(false)

    // Disparar webhook si hay datos válidos
    if (cita_id && ["CONFIRMAR", "CANCELAR", "REPROGRAMAR"].includes(accion)) {
      const webhookUrl =
        "https://prod-54.westus.logic.azure.com/workflows/e6ca8021d694492998bd18f5e45dbbb5/triggers/manual/paths/invoke/confirmacioncita?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=A8h4p5aTqsH7Irxmm0vGk8gSTmgqp5FbcCv-H5wy3tE" +
        "&cita_id=" +
        encodeURIComponent(cita_id) +
        "&accion=" +
        encodeURIComponent(accion) +
        "&email=" +
        encodeURIComponent(email) +
        "&nombreProveedor=" +
        encodeURIComponent(nombreProveedor)

      // Crear imagen invisible para disparar webhook
      const img = new Image()
      img.src = webhookUrl

      // Redirigir después de un delay
      setTimeout(() => {
        window.location.href = window.location.pathname
      }, 1000)
    }
  }, [accion, cita_id, email, nombreProveedor, pageTitle])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Cargando...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2
          className={`text-3xl font-bold mb-4 ${
            tituloClass === "confirmado"
              ? "text-green-600"
              : tituloClass === "cancelado"
                ? "text-red-600"
                : tituloClass === "reprogramado"
                  ? "text-orange-600"
                  : "text-gray-800"
          }`}
        >
          {titulo}
        </h2>
        <p className="text-lg text-gray-700 max-w-md">{detalle}</p>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-4 text-center border-t">
        <img
          src="https://www.dinet.com.pe/img/logo-dinet.png"
          alt="Dinet Logo"
          className="max-w-[150px] h-auto mx-auto"
        />
      </footer>
    </div>
  )
}
