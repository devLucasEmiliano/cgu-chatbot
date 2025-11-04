export default function StatusPage() {
  console.log('[MONITORAMENTO] Acesso à rota /monitoramento/status -', new Date().toISOString())
  
  return (
    <div>
      <h1>Status: OK</h1>
      <p>Aplicação funcionando normalmente</p>
    </div>
  )
}