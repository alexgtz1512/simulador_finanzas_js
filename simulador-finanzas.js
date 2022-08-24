// Variables globales
let gastosArr    = []
let sueldo    

class Gasto {
    constructor (id, monto, tipoPago, fecha) {
        this.id        = id;
        this.monto     = monto;
        this.tipoDePago  = tipoPago;
        this.fecha     = fecha;
    }
}

// Declaraciones del DOM
let sueldoInput   = document.getElementById('sueldoInput')
const formGasto   = document.getElementById('formGasto')
const botonGastos = document.getElementById('botonGastos')
const divGastos   = document.getElementById('divGastos')
const formSaldo   = document.getElementById('formSaldo')
const divSaldo    = document.getElementById('divSaldo')


// Funcion de inicio

const iniciaApp = () => {
    
    // Obetnemos el sueldo de LS 
    let sueldoLS = localStorage.getItem('sueldo')
    
    if ( sueldoLS ) {
        sueldoInput.value = sueldoLS
    } else {
        // Inicializamos en cero por primera vez
        sueldoInput.value = 0
        sueldo = 0
        localStorage.setItem('sueldo', 0)
    }

    // Obtenemos los gastos anteriores
    let gastoLS = localStorage.getItem('gastos')
    if ( gastoLS ) {
        gastosArr = JSON.parse(gastoLS)
    } 
}

// Evento para crear objeto de gastos en array
formGasto.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Obtenemos los valores del formulariode gastos
    const idGasto   = gastosArr.length + 1
    const monto     = document.getElementById('montoGasto').value
    const tipoPago  = document.getElementById('tipoPago').value
    const fechaPago = document.getElementById('fechaPago').value
    
    // Creamos el objeto gasto y lo guardamos en el array
    gastosArr.push ( new Gasto( idGasto, monto, tipoPago, fechaPago ) ); 
    formGasto.reset()
    
    // Guardamos el arreglo modificado en LS
    localStorage.setItem('gastos', JSON.stringify(gastosArr))

})

// Evento para mostrar gastos

botonGastos.addEventListener('click', () => {

    console.log(gastosArr)
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
formSaldo.addEventListener('submit', (e) => {
    e.preventDefault()

    // Tomamos el sueldo del input
    sueldo =  sueldoInput.value

    // Recorre el array de gastos y va restando del sueldo
    gastosArr.forEach( obj => {
        sueldo -= obj.monto
    })

    // El sueldo resultante lo guardamos en LS y lo asignamos como nuevo valor en el formulario
    sueldoInput.value = sueldo
    localStorage.setItem('sueldo', sueldoInput.value)

    divSaldo.innerHTML = `
 
        <div class="card" style="width: 18rem; margin:3px">
            <div class="card-body">
                <h5 class="card-title"> Saldo disponible: ${sueldo} </h5>
            </div>
        </div>
    
    `
}) 

iniciaApp()

