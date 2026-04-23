import { useState } from 'react'
import './App.css'

function App() {
  const [valor, setValor] = useState('')
  const [moedaDestino, setMoedaDestino] = useState('')
  const [resultado, setResultado] = useState('')
  const [erro, setErro] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const converterMoedas = async () => {
    if (!valor || !moedaDestino) {
      setErro(true)
      setResultado('Preencha todos os campos')
      return
    }

    setCarregando(true)
    setErro(false)
    setResultado('')

    try {
      const response = await fetch(`https://economia.awesomeapi.com.br/last/${moedaDestino}-BRL`)
      if (!response.ok) {
        throw new Error('Resposta inválida da API')
      }

      const data = await response.json()
      const taxa = parseFloat(data[`${moedaDestino}BRL`]?.bid)
      if (!taxa || Number.isNaN(taxa)) {
        throw new Error('Taxa de câmbio inválida')
      }

      const convertido = parseFloat(valor) / taxa
      setResultado(`R$ ${valor} = ${convertido.toFixed(2)} ${moedaDestino}`)
      setErro(false)
    } catch (error) {
      setErro(true)
      setResultado('Erro na conversão. Tente novamente.')
      console.error(error)
    }
    setCarregando(false)
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center mb-4">Conversor de Moedas</h1>
              <h3 className="text-center mb-4">Digite o valor em BRL, escolha a moeda de destino e clique em Converter</h3>
              
              <div className="mb-3">
                <label className="form-label">Valor: </label>
                <input
                  type="number"
                  className="form-control"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="Ex: 100"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Moeda de Destino: </label>
                <select
                  className="form-select"
                  value={moedaDestino}
                  onChange={(e) => setMoedaDestino(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="USD">USD-Dollar</option>
                  <option value="EUR">EUR-Euro</option>
                  <option value="GBP">GBP-Pound</option>
                  <option value="JPY">JPY-Yen</option>
                </select>
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={converterMoedas}
                disabled={carregando}
              >
                {carregando ? 'Convertendo...' : 'Converter'}
              </button>

              {resultado && (
                <div className={`alert mt-3 ${erro ? 'alert-danger' : 'alert-info'}`}>
                  {resultado}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App