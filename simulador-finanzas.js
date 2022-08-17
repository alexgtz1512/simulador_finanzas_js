// Variables globales
let gastosArr    = []
let tipoPagoArr  = [
    {
        id:    1,
        medio: 'efectivo'
        
    }
]
let sdoDisp   = 0
let sueldo    = 0
let numGastos = 0

class Gasto {
    constructor (id, monto, tipoPago, fecha) {
        this.id        = id;
        this.monto     = monto;
        this.tipoDePago  = tipoPago;
        this.fecha     = fecha;
    }
}

const formGasto = document.getElementById('formGasto')
console.log(formGasto)

// Evento para crear objeto de gastos en array
formGasto.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const idGasto   = gastosArr.length + 1
    const monto     = document.getElementById('montoGasto').value
    const tipoPago  = document.getElementById('tipoPago').value
    const fechaPago = document.getElementById('fechaPago').value

    gastosArr.push ( new Gasto( idGasto, monto, tipoPago, fechaPago ) ); 
    formGasto.reset()
    console.log(gastosArr)


})

// Evento para mostrar gastos

const botonGastos = document.getElementById('botonGastos')
const divGastos   = document.getElementById('divGastos')

botonGastos.addEventListener('click', () => {
    divGastos.innerHTML = ''
    gastosArr.forEach( (gasto, indice ) => {
        divGastos.innerHTML += `
        
        <div class="card" id="gasto${gasto.id}" style="width: 18rem; margin:3px">
            <div class="card-body">
                <h5 class="card-title"> Gasto #${gasto.id} </h5>
                <p class="card-text"> Monto: ${gasto.monto} </p>
                <p class="card-text"> Tipo pago: ${gasto.tipoDePago} </p>
                <p class="card-text"> Fecha: ${gasto.fecha} </p>
            </div>
        </div>
        `
    })
})

// Evento para calcular el saldo disponible

const formSaldo = document.getElementById('formSaldo')
const divSaldo  = document.getElementById('divSaldo')

formSaldo.addEventListener('submit', (e) => {
    e.preventDefault()
    let sueldo = document.getElementById('sueldo').value
    console.log(sueldo, typeof(sueldo))
    gastosArr.forEach( obj => {
        sueldo -= obj.monto
    })
    console.log(sueldo)
    divSaldo.innerHTML = `
 
        <div class="card" style="width: 18rem; margin:3px">
            <div class="card-body">
                <h5 class="card-title"> Saldo disponible: ${sueldo} </h5>
            </div>
        </div>
    
    `
}) 



