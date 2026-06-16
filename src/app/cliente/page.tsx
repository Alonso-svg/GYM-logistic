'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const RUTINAS: any = {
  0: { nombre: 'Piernas y glúteos', ejercicios: [
    { nombre: 'Sentadilla', detalle: '4 series × 12 reps', tip: 'Espalda recta, rodillas alineadas con los pies' },
    { nombre: 'Peso muerto', detalle: '3 series × 10 reps', tip: 'Mantén la barra cerca del cuerpo' },
    { nombre: 'Zancadas', detalle: '3 series × 15 reps c/pierna', tip: 'Rodilla delantera no pasa la punta del pie' },
    { nombre: 'Hip thrust', detalle: '4 series × 15 reps', tip: 'Contrae glúteo en la parte alta' },
    { nombre: 'Plancha isométrica', detalle: '3 series × 45 seg', tip: 'Cuerpo recto, activa el core' },
  ]},
  1: { nombre: 'Espalda y bíceps', ejercicios: [
    { nombre: 'Jalón al pecho', detalle: '4 series × 12 reps', tip: 'Lleva la barra al pecho superior' },
    { nombre: 'Remo con mancuerna', detalle: '3 series × 12 reps', tip: 'Codo pegado, no gires el torso' },
    { nombre: 'Curl de bíceps', detalle: '3 series × 15 reps', tip: 'Movimiento controlado, sin balancear' },
    { nombre: 'Peso muerto rumano', detalle: '3 series × 10 reps', tip: 'Siente el estiramiento en isquiotibiales' },
  ]},
  2: { nombre: 'Cardio y core', ejercicios: [
    { nombre: 'Trote en cinta', detalle: '20 minutos', tip: 'Ritmo constante, zona cardíaca 2–3' },
    { nombre: 'Plancha lateral', detalle: '3 series × 30 seg c/lado', tip: 'Cadera elevada, sin dejar caer la pelvis' },
    { nombre: 'Abdominales crunch', detalle: '3 series × 20 reps', tip: 'Exhala al subir, no jales el cuello' },
    { nombre: 'Mountain climbers', detalle: '3 series × 30 seg', tip: 'Caderas bajas, ritmo controlado' },
  ]},
  3: { nombre: 'Pecho y tríceps', ejercicios: [
    { nombre: 'Press de banca', detalle: '4 series × 10 reps', tip: 'Agarre mayor al ancho de hombros' },
    { nombre: 'Fondos de tríceps', detalle: '3 series × 12 reps', tip: 'Baja hasta 90° en el codo' },
    { nombre: 'Aperturas con mancuernas', detalle: '3 series × 15 reps', tip: 'Arco amplio y controlado' },
    { nombre: 'Press francés', detalle: '3 series × 12 reps', tip: 'Codos fijos apuntando al techo' },
  ]},
  4: { nombre: 'Hombros y funcional', ejercicios: [
    { nombre: 'Press militar', detalle: '4 series × 10 reps', tip: 'Activa core, no arquees la espalda' },
    { nombre: 'Elevaciones laterales', detalle: '3 series × 15 reps', tip: 'Control en la bajada' },
    { nombre: 'Face pull con polea', detalle: '3 series × 15 reps', tip: 'Tira hacia la nariz, codos hacia afuera' },
    { nombre: 'Burpees', detalle: '3 series × 10 reps', tip: 'Explosivo en el salto' },
  ]},
}

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function ClientePage() {
  const [tab, setTab] = useState('inicio')
  const [diaActivo, setDiaActivo] = useState(0)
  const [checks, setChecks] = useState<any>({})
  const [metodo, setMetodo] = useState('transferencia')
  const [archivoCargado, setArchivoCargado] = useState(false)
  const [pagoEnviado, setPagоEnviado] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  const [nota, setNota] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUsuario(session.user)
    }
    checkSession()
  }, [])

  const toggleCheck = (key: string) => {
    setChecks((prev: any) => ({ ...prev, [key]: !prev[key] }))
  }

  const submitPago = () => setPagоEnviado(true)

  if (!usuario) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Cargando...</p>
    </div>
  )

  const rutina = RUTINAS[diaActivo]

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">G</div>
          <span className="font-medium text-sm">GYM-logistic</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">{usuario.email}</span>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            className="text-xs text-gray-400 border border-gray-700 px-2 py-1 rounded-lg hover:text-white">
            Salir
          </button>
        </div>
      </div>

      {/* Nav */}
      <div className="bg-gray-900 border-b border-gray-800 flex">
        {[['inicio','Inicio'],['rutina','Mi rutina'],['pagos','Pagos']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-5 py-3 text-sm flex items-center gap-2 border-b-2 transition-colors ${tab === id ? 'border-blue-500 text-blue-400 font-medium' : 'border-transparent text-gray-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full flex flex-col gap-4">

        {/* INICIO */}
        {tab === 'inicio' && <>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-lg font-medium">Plan Mensual</p>
                <p className="text-gray-400 text-xs mt-1">Vigente: 15 jun → 15 jul 2026</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-medium text-blue-400">$15.000</p>
                <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full">Activo</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-1">Días restantes del plan</p>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{width:'3%'}}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1"><span>15 jun</span><span>30 días restantes</span><span>15 jul</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[['Días entrenados','12','este mes'],['Próximo pago','15 jul','en 30 días'],['Racha actual','4 días','¡sigue así!']].map(([label,val,sub]) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{label}</p>
                <p className="text-lg font-medium">{val}</p>
                <p className="text-gray-500 text-xs">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-sm">Hoy — {DIAS[new Date().getDay() === 0 ? 6 : new Date().getDay()-1]}</p>
              <span className="text-xs bg-blue-900 text-blue-400 px-2 py-0.5 rounded-full">Día {(new Date().getDay() || 7)}</span>
            </div>
            {RUTINAS[0].ejercicios.slice(0,3).map((ex: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{ex.nombre}</p>
                  <p className="text-xs text-gray-400">{ex.detalle}</p>
                </div>
                <button onClick={() => toggleCheck(`h-${i}`)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${checks[`h-${i}`] ? 'bg-green-600 border-green-600' : 'border-gray-600'}`}>
                  {checks[`h-${i}`] ? '✓' : ''}
                </button>
              </div>
            ))}
            <button onClick={() => setTab('rutina')} className="text-xs text-blue-400 mt-3 hover:underline">Ver rutina completa →</button>
          </div>
        </>}

        {/* RUTINA */}
        {tab === 'rutina' && <>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="font-medium text-sm mb-3">Rutina semanal</p>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {DIAS.map((dia, i) => (
                <button key={i} onClick={() => setDiaActivo(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors ${diaActivo === i ? 'bg-blue-600 border-blue-600 text-white font-medium' : i >= 5 ? 'border-gray-700 text-gray-500' : 'border-gray-700 text-gray-300 hover:border-gray-500'}`}>
                  {dia}
                </button>
              ))}
            </div>

            {diaActivo >= 5 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-3xl mb-2">💤</p>
                <p className="font-medium text-gray-400">Día de descanso</p>
                <p className="text-xs mt-1">El descanso es parte del entrenamiento</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 font-medium mb-3">{rutina.nombre}</p>
                <div className="flex flex-col gap-3">
                  {rutina.ejercicios.map((ex: any, i: number) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-3 flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{ex.nombre}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{ex.detalle}</p>
                        <p className="text-xs text-gray-500 mt-1 italic">{ex.tip}</p>
                      </div>
                      <button onClick={() => toggleCheck(`r-${diaActivo}-${i}`)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs flex-shrink-0 mt-0.5 transition-colors ${checks[`r-${diaActivo}-${i}`] ? 'bg-green-600 border-green-600' : 'border-gray-600'}`}>
                        {checks[`r-${diaActivo}-${i}`] ? '✓' : ''}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="font-medium text-sm mb-3">Recomendaciones</p>
            {[
              ['💧','Bebe al menos 2 litros de agua al día'],
              ['🌙','Duerme 7–8 horas para recuperación óptima'],
              ['🥗','Consume proteína 30 min después de entrenar'],
              ['❤️','Respeta los días de descanso'],
            ].map(([icon, texto]) => (
              <div key={texto} className="flex gap-3 items-start py-2 border-b border-gray-800 last:border-0">
                <span className="text-base">{icon}</span>
                <p className="text-xs text-gray-400 leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </>}

        {/* PAGOS */}
        {tab === 'pagos' && <>
          {!pagoEnviado ? <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="font-medium text-sm mb-4">Renovar plan</p>
              <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">Plan Mensual</p>
                  <p className="text-xs text-gray-400">Acceso completo · 30 días</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-medium text-blue-400">$15.000</p>
                  <p className="text-xs text-gray-400">CLP</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-2">Método de pago</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[['transferencia','💳','Transferencia','Banco / Mercado Pago'],['efectivo','💵','Efectivo','Pago en recepción']].map(([id,icon,label,sub]) => (
                  <button key={id} onClick={() => setMetodo(id)}
                    className={`p-4 rounded-xl border text-center transition-colors ${metodo === id ? 'border-blue-500 bg-blue-950' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                    <span className="text-2xl block mb-1">{icon}</span>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </button>
                ))}
              </div>

              {metodo === 'transferencia' && <>
                <div className="bg-gray-800 rounded-lg p-4 mb-4 text-sm">
                  <p className="font-medium mb-3">Datos de transferencia</p>
                  {[['Banco','Banco Estado'],['Titular','GYM-logistic SpA'],['Cuenta','00123456789'],['Monto exacto','$15.000']].map(([k,v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-gray-700 last:border-0">
                      <span className="text-gray-400 text-xs">{k}</span>
                      <span className="text-xs font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-2">Adjunta tu comprobante</p>
                <div onClick={() => setArchivoCargado(true)}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer mb-4 transition-colors ${archivoCargado ? 'border-blue-500 bg-blue-950' : 'border-gray-700 hover:border-gray-500'}`}>
                  <p className="text-2xl mb-1">{archivoCargado ? '✅' : '📎'}</p>
                  <p className="text-sm text-gray-400">{archivoCargado ? 'comprobante.jpg listo' : 'Toca aquí para subir comprobante'}</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG o PDF · máx 5MB</p>
                </div>
                <button onClick={submitPago} disabled={!archivoCargado}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Enviar comprobante
                </button>
              </>}

              {metodo === 'efectivo' && <>
                <div className="bg-yellow-950 border border-yellow-800 rounded-lg p-3 mb-4 text-xs text-yellow-300">
                  Debes pagar en recepción con el monto exacto. Tu pago quedará <strong>pendiente</strong> hasta que el encargado lo confirme.
                </div>
                <div className="mb-4">
                  <label className="text-xs text-gray-400 mb-1 block">Nota para el encargado (opcional)</label>
                  <input value={nota} onChange={e => setNota(e.target.value)}
                    placeholder="Ej: Lo pago el martes por la mañana"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <button onClick={submitPago}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Notificar pago en efectivo
                </button>
              </>}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="font-medium text-sm mb-3">Historial de pagos</p>
              {[['15 may 2026','Transferencia','Aprobado'],['15 abr 2026','Efectivo','Aprobado'],['15 mar 2026','Transferencia','Aprobado']].map(([fecha,met,estado]) => (
                <div key={fecha} className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-0">
                  <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center text-green-400 text-xs">✓</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Plan Mensual — {met}</p>
                    <p className="text-xs text-gray-400">{fecha} · {estado}</p>
                  </div>
                  <p className="text-sm font-medium text-green-400">$15.000</p>
                </div>
              ))}
            </div>
          </> : <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-4xl mb-3">⏳</p>
              <p className="font-medium text-lg mb-2">Pago en revisión</p>
              <p className="text-gray-400 text-sm leading-relaxed">Tu pago fue recibido y está siendo revisado por el encargado. Una vez aprobado, tu plan se renovará por 30 días más.</p>
              <span className="inline-block mt-4 bg-yellow-900 text-yellow-400 text-xs px-3 py-1.5 rounded-full">Pendiente de aprobación</span>
            </div>
          </>}
        </>}

      </div>
    </main>
  )
}
