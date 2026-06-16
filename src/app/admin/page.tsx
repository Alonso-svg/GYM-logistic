'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard')
  const [usuario, setUsuario] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      
      const email = session.user.email || ''
      if (!email.includes('admin')) {
        router.push('/cliente')
        return
      }
      setUsuario(session.user)
      setCargando(false)
    }
    checkSession()
  }, [])

  if (cargando) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Cargando...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">G</div>
          <span className="font-medium text-sm">GYM-logistic</span>
          <span className="text-gray-500 text-xs">Panel Admin</span>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
          className="text-xs text-gray-400 border border-gray-700 px-2 py-1 rounded-lg hover:text-white">
          Salir
        </button>
      </div>

      <div className="bg-gray-900 border-b border-gray-800 flex">
        {[['dashboard','Dashboard'],['clientes','Clientes'],['pagos','Pagos'],['trabajadores','Trabajadores']].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-3 text-sm border-b-2 transition-colors ${tab === id ? 'border-blue-500 text-blue-400 font-medium' : 'border-transparent text-gray-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-5xl mx-auto w-full flex flex-col gap-4">

        {tab === 'dashboard' && <>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Total clientes','24','','white'],
              ['Cobros pendientes','$85.000','5 en mora','red'],
              ['Ingresos este mes','$320.000','de $400.000','green'],
              ['Pago trabajadores','$180.000','Vence 30 jun','yellow'],
            ].map(([label,val,sub,color]) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{label}</p>
                <p className={`text-2xl font-medium ${color === 'red' ? 'text-red-400' : color === 'green' ? 'text-green-400' : color === 'yellow' ? 'text-yellow-400' : 'text-white'}`}>{val}</p>
                {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="font-medium text-sm mb-3">⚠️ Vencen pronto</p>
            {[
              ['Carlos M.','CM','Vencido','red'],
              ['Laura R.','LR','Hoy','yellow'],
              ['Jorge P.','JP','2 días','yellow'],
              ['Ana M.','AM','5 días','blue'],
            ].map(([nombre,ini,estado,color]) => (
              <div key={nombre} className="flex items-center gap-3 py-2.5 border-b border-gray-800 last:border-0">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">{ini}</div>
                <p className="flex-1 text-sm">{nombre}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${color === 'red' ? 'bg-red-900 text-red-400' : color === 'yellow' ? 'bg-yellow-900 text-yellow-400' : 'bg-blue-900 text-blue-400'}`}>{estado}</span>
                <p className="text-sm text-gray-400">$15.000</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="font-medium text-sm mb-3">👷 Pagos a trabajadores</p>
            {[
              ['Miguel P.','MP','Entrenador','30 jun','yellow'],
              ['Sandra D.','SD','Recepción','30 jun','yellow'],
              ['Kevin T.','KT','Limpieza','Pagado','green'],
            ].map(([nombre,ini,cargo,fecha,color]) => (
              <div key={nombre} className="flex items-center gap-3 py-2.5 border-b border-gray-800 last:border-0">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium">{ini}</div>
                <div className="flex-1">
                  <p className="text-sm">{nombre}</p>
                  <p className="text-xs text-gray-400">{cargo}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${color === 'green' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>{fecha}</span>
              </div>
            ))}
          </div>
        </>}

        {tab === 'clientes' && <>
          <div className="flex justify-between items-center">
            <p className="font-medium">Clientes registrados</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1.5 rounded-lg">+ Nuevo cliente</button>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 px-4 py-2 border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wide">
              <span>Cliente</span><span>Plan</span><span>Próximo pago</span><span>Estado</span>
            </div>
            {[
              ['Carlos Molina','CM','Mensual','10 jun 2026','En mora','red'],
              ['Rosa Vega','RV','Mensual','8 jun 2026','En mora','red'],
              ['Laura Ramírez','LR','Mensual','15 jun 2026','Vence hoy','yellow'],
              ['Jorge Pérez','JP','Mensual','17 jun 2026','2 días','yellow'],
              ['Ana Muñoz','AM','Mensual','20 jun 2026','5 días','blue'],
              ['Felipe González','FG','Anual','15 dic 2026','Al día','green'],
              ['Camila Vargas','CV','Mensual','1 jul 2026','Al día','green'],
            ].map(([nombre,ini,plan,fecha,estado,color]) => (
              <div key={nombre} className="grid grid-cols-4 px-4 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-xs">{ini}</div>
                  <span className="text-sm">{nombre}</span>
                </div>
                <span className="text-sm text-gray-400">{plan}</span>
                <span className="text-sm text-gray-400">{fecha}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${color === 'red' ? 'bg-red-900 text-red-400' : color === 'yellow' ? 'bg-yellow-900 text-yellow-400' : color === 'green' ? 'bg-green-900 text-green-400' : 'bg-blue-900 text-blue-400'}`}>{estado}</span>
              </div>
            ))}
          </div>
        </>}

        {tab === 'pagos' && <>
          <p className="font-medium">Pagos pendientes de aprobación</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 px-4 py-2 border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wide">
              <span>Cliente</span><span>Método</span><span>Monto</span><span>Acción</span>
            </div>
            {[
              ['Laura Ramírez','LR','Transferencia'],
              ['Jorge Pérez','JP','Efectivo'],
            ].map(([nombre,ini,metodo]) => (
              <div key={nombre} className="grid grid-cols-4 px-4 py-3 border-b border-gray-800 last:border-0 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-xs">{ini}</div>
                  <span className="text-sm">{nombre}</span>
                </div>
                <span className="text-sm text-gray-400">{metodo}</span>
                <span className="text-sm text-green-400 font-medium">$15.000</span>
                <div className="flex gap-2">
                  <button className="text-xs bg-green-700 hover:bg-green-600 px-2 py-1 rounded-lg">Aprobar</button>
                  <button className="text-xs bg-red-900 hover:bg-red-800 px-2 py-1 rounded-lg">Rechazar</button>
                </div>
              </div>
            ))}
          </div>

          <p className="font-medium">Historial de pagos</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 px-4 py-2 border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wide">
              <span>Fecha</span><span>Cliente</span><span>Monto</span><span>Estado</span>
            </div>
            {[
              ['14 jun 2026','Felipe G.','$15.000','Aprobado'],
              ['13 jun 2026','Kevin T. (nómina)','$350.000','Pagado'],
              ['12 jun 2026','Camila V.','$15.000','Aprobado'],
            ].map(([fecha,nombre,monto,estado]) => (
              <div key={fecha+nombre} className="grid grid-cols-4 px-4 py-3 border-b border-gray-800 last:border-0 items-center">
                <span className="text-xs text-gray-400">{fecha}</span>
                <span className="text-sm">{nombre}</span>
                <span className="text-sm text-green-400 font-medium">{monto}</span>
                <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full w-fit">{estado}</span>
              </div>
            ))}
          </div>
        </>}

        {tab === 'trabajadores' && <>
          <div className="flex justify-between items-center">
            <p className="font-medium">Nómina de trabajadores</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1.5 rounded-lg">+ Agregar</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['Total nómina','$1.900.000','mensual','white'],['Por pagar','$1.550.000','3 trabajadores','yellow'],['Ya pagado','$350.000','1 trabajador','green']].map(([label,val,sub,color]) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{label}</p>
                <p className={`text-xl font-medium ${color === 'yellow' ? 'text-yellow-400' : color === 'green' ? 'text-green-400' : 'text-white'}`}>{val}</p>
                <p className="text-xs text-gray-500 mt-1">{sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 px-4 py-2 border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wide">
              <span>Trabajador</span><span>Cargo</span><span>Sueldo</span><span>Estado</span>
            </div>
            {[
              ['Miguel Pinto','MP','Entrenador','$600.000','Pendiente','yellow'],
              ['Sandra Díaz','SD','Recepcionista','$450.000','Pendiente','yellow'],
              ['Kevin Torres','KT','Limpieza','$350.000','Pagado','green'],
              ['Isabel Vera','IV','Instructora','$500.000','Pendiente','yellow'],
            ].map(([nombre,ini,cargo,sueldo,estado,color]) => (
              <div key={nombre} className="grid grid-cols-4 px-4 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-xs">{ini}</div>
                  <span className="text-sm">{nombre}</span>
                </div>
                <span className="text-sm text-gray-400">{cargo}</span>
                <span className="text-sm font-medium">{sueldo}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${color === 'green' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>{estado}</span>
              </div>
            ))}
          </div>
        </>}

      </div>
    </main>
  )
}
