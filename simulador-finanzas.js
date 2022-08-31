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

    // Mostramos los gastos almacenados en LS 
    mostrarGastos();    

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

    // Mostramos el gastos en el DOM
    mostrarGastos()

    // Alerta de creacion de gasto exitoso
    Swal.fire(
        'Hecho!',
        'El gasto ha sido creado correctamente.',
        'success'
      )

})

// Funcion para mostrar en el DOM los gastos creados en el LocalStorage
const mostrarGastos = () => {

        console.log(gastosArr)
        divGastos.innerHTML = ''
        gastosArr.forEach( (gasto ) => {
    
            divGastos.innerHTML += `
            
            <div class="card p-2 card-gasto" id="gasto${gasto.id}" style="width: 18rem; margin:3px">
                <div class="card-body">
                    <h5 class="card-title"> Gasto #${gasto.id} </h5>
                    <p class="card-text"> Monto: ${gasto.monto} </p>
                    <p class="card-text"> Tipo pago: ${gasto.tipoDePago} </p>
                    <p class="card-text"> Fecha: ${gasto.fecha} </p>
                </div>
                <div class="ps-2">
                    <button id="${gasto.id}" class="btn btn-danger"> Eliminar </button> 
                </div>
            </div>
            `
        })

}

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

// Evento para eliminar gastos en la aplicacion
divGastos.addEventListener('click', (e) => {
    // Obtenemos todas las cards de gastos
    const cardGasto = document.querySelectorAll('.card-gasto')

    // Armamos el id del elemento que vamos a eliminar
    let idElim = `gasto${e.target.id}`
    let itemElim = document.getElementById(idElim)

    // El usuario toma la decision para eliminar el elemento
    Swal.fire({
        title: '¿Eliminar gasto?',
        text: "Se eliminara el gasto permanentemente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
            // Removemos el gasto seleccionado del DOM y del array
            divGastos.removeChild(itemElim)

            gastosArr.forEach((elem, indice)=> {
                if (elem.id == e.target.id)
                    gastosArr.splice(indice,1)
            })
        
            // Guardamos el arreglo modificado en LS
            localStorage.setItem('gastos', JSON.stringify(gastosArr))

          Swal.fire(
            'Eliminado correctamente!',
            'El gasto ha sido eliminado de la aplicacion.',
            'success'
          )
        }
      })

})


iniciaApp()

