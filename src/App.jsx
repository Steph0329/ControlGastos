
import { useEffect, useState } from "react"
import Header from "./components/Header"
import ListadoGastos from "./components/ListadoGastos"
import Filtros from "./components/Filtros"
import Modal from "./components/Modal"
import { generarId } from './helpers'
import iconoNuevoGasto from './Materiales App de Gastos/img/nuevo-gasto.svg'

function App() {

  const [gastos, setGastos] = useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  )

  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  )
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)

  const [modal, setModal] = useState(false);
  const [animarModal, setAnimarModal] = useState(false);

  const [gastoEditar, setGastoEditar] = useState({})

  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState([])


  useEffect(() => {
    if(Object.keys(gastoEditar).length > 0){
      setModal(true)

        setTimeout(() => {
          setAnimarModal(true)
        }, 500);
    }
  }, [gastoEditar])

  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto])
  
  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? 0)
  }, [gastos])
  
  useEffect(() => {
    if(filtro){
      //Filtrar gastos por categoria
      const gastosFiltros = gastos.filter( gasto => gasto.categoria === filtro)

      setGastosFiltrados(gastosFiltros)
    }
  }, [filtro])
  

  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0;

    if(presupuestoLS > 0){
      setIsValidPresupuesto(true)
    }
  }, [])
  
  const handleNuevoGasto = () => {
    setModal(true)
    setGastoEditar({})

    setTimeout(() => {
      setAnimarModal(true)
    }, 500);
  }

  const guardarGasto = gasto => {
    if(gasto.id){
      const gastosActualizados = gastos.map( gastoState => gastoState.id == gasto.id ? gasto : gastoState)

      setGastos(gastosActualizados)
    } else {
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto])
      setGastoEditar({})
    }

    setModal(false)
    setAnimarModal(false)

    setTimeout(() => {
        setModal(false)
    }, 500);
  }

  const eliminarGasto = id => {
    const gastosAcualizados = gastos.filter( gasto => gasto.id !== id);
    setGastos(gastosAcualizados)
  }

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />

      {
        isValidPresupuesto && (
          <>
            <main>
              <Filtros
                filtro={filtro}
                setFiltro={setFiltro}
              />
              <ListadoGastos
                gastos={gastos}    
                setGastoEditar={setGastoEditar}     
                eliminarGasto={eliminarGasto} 
                filtro={filtro} 
                gastosFiltrados={gastosFiltrados} 
              />
            </main>
            <div className="nuevo-gasto">
              <img 
              src={iconoNuevoGasto}
              alt="icono nuevo gasto"
              onClick={handleNuevoGasto}
              />
            </div>
          </>
        )
      }   

      {
        modal && <Modal 
                    setModal={setModal}
                    animarModal={animarModal}
                    setAnimarModal={setAnimarModal}
                    guardarGasto={guardarGasto}
                    gastoEditar={gastoEditar}
                    setGastoEditar={setGastoEditar}
                  />
      }  
    </div>
  )
}

export default App
