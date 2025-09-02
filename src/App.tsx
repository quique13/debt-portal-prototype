
import { useMemo, useState } from 'react'

type Client = {
  dpi: string
  nit: string
  nombre: string
  saldoActual: number
}

const sampleClients: Client[] = [
  { dpi: '1234567890123', nit: '10020030K', nombre: 'Juan Pérez', saldoActual: 3500.00 },
  { dpi: '1111222233334', nit: '9876543-1', nombre: 'María García', saldoActual: 12500.50 },
]

const currency = new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 2 })

// Descuentos por cuota
// 1 => 40% (máximo), 2 => 45%, 3 => 40%, 4 => 35%, 5 => 30%, 6 => 25%, 7-12 => 0%
const DEFAULT_MAX = 0.40
function getDiscountForInstallments(n: number): number {
  if (n === 1) return DEFAULT_MAX
  if (n === 2) return 0.45
  if (n === 3) return 0.40
  if (n === 4) return 0.35
  if (n === 5) return 0.30
  if (n === 6) return 0.25
  return 0.0
}

function isValidDPI(v: string) {
  return /^\d{13}$/.test(v.trim())
}
function isValidNIT(v: string) {
  return /^[0-9\-]*[0-9Kk]$/.test(v.trim()) && v.trim().length >= 4
}

export default function App() {
  const [useNIT, setUseNIT] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [client, setClient] = useState<Client | null>(null)
  const [slider, setSlider] = useState(6) // default 6
  const [showLetter, setShowLetter] = useState(false)

  const valid = useMemo(() => useNIT ? isValidNIT(identifier) : isValidDPI(identifier), [useNIT, identifier])

  const discountPct = useMemo(() => getDiscountForInstallments(slider), [slider])
  const results = useMemo(() => {
    if (!client) return null
    const saldo = client.saldoActual
    const descuentoQ = saldo * discountPct
    const total = saldo - descuentoQ
    const cuota = total / slider
    return {
      saldo, descuentoPct: discountPct, descuentoQ, total, cuota
    }
  }, [client, discountPct, slider])

  function findClient() {
    setLoading(true)
    setClient(null)
    setTimeout(() => {
      const found = sampleClients.find(c => (useNIT ? c.nit.toLowerCase() === identifier.trim().toLowerCase() : c.dpi === identifier.trim()))
      setClient(found ?? null)
      setLoading(false)
    }, 700)
  }

  const canSearch = valid && identifier.trim().length > 0

  return (
    <div className="container">
      <div className="card" style={{marginBottom: 16}}>
        <h1 className="title">Gestión de tu deuda</h1>
        <p className="subtitle">Consulta con tu DPI o NIT y genera tu <b>Carta de Convenio</b> en minutos.</p>

        <div className="row" style={{alignItems:'center'}}>
          <input
            className="input"
            placeholder={useNIT ? 'Ingresa tu NIT' : 'Ingresa tu DPI (13 dígitos)'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <label className="toggle">
            <input
              type="checkbox"
              checked={useNIT}
              onChange={(e) => setUseNIT(e.target.checked)}
            />
            Usar NIT
          </label>
          <button className="btn" disabled={!canSearch || loading} onClick={findClient}>
            {loading ? 'Consultando…' : 'Consultar'}
          </button>
        </div>
      </div>

      {!loading && !client && (
        <div className="card">
          <div className="skeleton" />
          <div className="note">Ingresa tus datos para consultar. Prueba con DPI <code>1234567890123</code> o NIT <code>10020030K</code> en esta demo.</div>
        </div>
      )}

      {loading && (
        <div className="card">
          <div className="skeleton" />
        </div>
      )}

      {!loading && client && (
        <div className="card">
          <div className="grid">
            <div className="col-12">
              <div className="row" style={{justifyContent:'space-between', alignItems:'baseline'}}>
                <div>
                  <div className="row" style={{alignItems:'center', gap:8}}>
                    <div className="section-title" style={{marginTop:0}}>{client.nombre}</div>
                    <span className="control-id">Control 1.15.12.2.145</span>
                  </div>
                  <div className="label">Saldo actual</div>
                  <div className="price">{currency.format(client.saldoActual)}</div>
                </div>
                <div className="chip">Puedes renegociar tu plan más adelante</div>
              </div>
            </div>

            <div className="col-12">
              <div className="block">
                <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                    <div className="section-title" style={{marginTop:0}}>Pagar en cuotas</div>
                    <div className="label">Selecciona de 1 a 12 cuotas</div>
                  </div>
                  <div className="chip">Cuotas: <b>{slider}</b></div>
                </div>
                <input
                  className="slider"
                  type="range"
                  min={1}
                  max={12}
                  value={slider}
                  onChange={(e) => setSlider(parseInt(e.target.value, 10))}
                />
                {/* Marcas (círculos) */}
                <div className="ticks" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, i) => {
                    const val = i + 1
                    return (
                      <span
                        key={val}
                        className={`tick ${slider === val ? 'active' : ''}`}
                        title={`${val} cuota${val > 1 ? 's' : ''}`}
                      />
                    )
                  })}
                </div>

                {/* Números bajo las marcas (el activo en amarillo) */}
                <div className="tick-legend" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, i) => {
                    const val = i + 1
                    return (
                      <span key={val} className={slider === val ? 'active' : ''}>{val}</span>
                    )
                  })}
                </div>
                <div className="row" style={{gap:8, marginTop:8, flexWrap:'wrap'}}>
                  <span className="chip"><span className="chip-num">1</span>. máx.</span>
                  <span className="chip"><span className="chip-num">2</span>. 45%</span>
                  <span className="chip"><span className="chip-num">3</span>. 40%</span>
                  <span className="chip"><span className="chip-num">4</span>. 35%</span>
                  <span className="chip"><span className="chip-num">5</span>. 30%</span>
                  <span className="chip"><span className="chip-num">6</span>. 25%</span>
                  <span className="chip"><span className="chip-num">7–12</span>. 0%</span>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="block">
                <div className="section-title" style={{marginTop:0}}>Resumen</div>
                <div className="label">Descuento aplicado</div>
                <div className="price">{(discountPct*100).toFixed(0)}%</div>
                {results && (
                  <>
                    <div className="label" style={{marginTop:8}}>Ahorro</div>
                    <div style={{fontSize:18,fontWeight:700}}>{currency.format(results.descuentoQ)}</div>

                    <div className="label" style={{marginTop:8}}>Total a pagar</div>
                    <div style={{fontSize:22,fontWeight:800}}>{currency.format(results.total)}</div>

                    <div className="label" style={{marginTop:8}}>Monto por cuota</div>
                    <div style={{fontSize:22,fontWeight:800}}>{currency.format(results.cuota)}</div>
                  </>
                )}
              </div>
            </div>

            <div className="col-6">
              <div className="block">
                <div className="section-title" style={{marginTop:0}}>Contado</div>
                <div className="label">Paga hoy y ahorra (equivalente a 1 cuota)</div>
                <div className="price">
                  {currency.format(client.saldoActual * (1 - 0.40))}
                </div>
                <div className="actions">
                  <button className="btn btn-success">Pagar ahora</button>
                  <button className="btn btn-outline" onClick={() => setShowLetter(true)}>Generar Carta de Convenio</button>
                </div>
                <div className="note">* Demo: acciones simuladas</div>
              </div>
            </div>

            <div className="col-12">
              <div className="actions">
                <button className="btn btn-outline" onClick={() => setShowLetter(true)}>Generar Carta de Convenio</button>
                <button className="btn">Generar plan</button>
              </div>
              <div className="note">El descuento depende del número de cuotas. 7–12 no tienen descuento.</div>
            </div>
          </div>
        </div>
      )}

      {showLetter && client && results && (
        <div className="modal-backdrop" onClick={() => setShowLetter(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Carta de Convenio (preview)</h3>
            <p className="muted">Documento no vinculante para efectos legales en este prototipo.</p>
            <div className="block" style={{marginTop:12}}>
              <p><b>Cliente:</b> {client.nombre}</p>
              <p><b>Identificación:</b> {useNIT ? `NIT ${client.nit}` : `DPI ${client.dpi}`}</p>
              <p><b>Saldo actual:</b> {currency.format(results.saldo)}</p>
              <p><b>Plan seleccionado:</b> {slider} cuota(s)</p>
              <p><b>Descuento aplicado:</b> {(results.descuentoPct*100).toFixed(0)}% ({currency.format(results.descuentoQ)})</p>
              <p><b>Total a pagar:</b> {currency.format(results.total)}</p>
              <p><b>Monto por cuota:</b> {currency.format(results.cuota)}</p>
              <p className="note">Fecha de inicio y calendario de pagos se definirán al formalizar.</p>
            </div>
            <div className="actions" style={{marginTop:12}}>
              <button className="btn btn-outline" onClick={() => alert('Descarga simulada en este prototipo')}>Descargar PDF</button>
              <button className="btn" onClick={() => alert('Envío simulado en este prototipo')}>Enviar por correo</button>
              <button className="btn" onClick={() => setShowLetter(false)}>Cerrar</button>
            </div>
            <div className="footer">Puedes renegociar tu plan más adelante.</div>
          </div>
        </div>
      )}
    </div>
  )
}
