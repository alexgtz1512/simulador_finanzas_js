// Variables globales
const API_KEY  = "1a392fc2341a48e37ae1e616f07e338fa0d1f41abcd13446bd6a39a12e13df87"
let valorDolar = 0
let gastosArr    = []
let sueldo    

class Gasto {
    constructor (id, montoPesos, montoDolares, tipoPago, fecha, status) {
        this.id        = id;
        this.montoPesos     = montoPesos;
        this.montoDolares   = montoDolares;
        this.tipoDePago  = tipoPago;
        this.fecha       = fecha;
        this.status      = status;
    }
}

// Declaraciones del DOM
let sueldoInput     = document.getElementById('sueldoInput')
const divFormGastos = document.getElementById('divFormGastos')
const formGasto     = document.getElementById('formGasto')
const divGastos     = document.getElementById('divGastos')
const formSaldo     = document.getElementById('formSaldo')
const divSaldo      = document.getElementById('divSaldo')

// Consultamos la API de BANXICO para obtener el tipo de cambio para conversion de pesos a dolar
fetch(`https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF343410/datos/oportuno?token=${API_KEY}`)
.then( (resp) => resp.json())
.then( (data) => {
    valorDolar = parseFloat(data.bmx.series[0].datos[0].dato)
    console.log(valorDolar)
} )


// Funcion de inicio

const iniciaApp = () => {
    
    // Obetnemos el sueldo de LS 
    let sueldoLS = localStorage.getItem('sueldo')
    
    if ( sueldoLS ) {
        sueldoInput.value = sueldoLS
        sueldo = sueldoLS
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
/**
 * Formularios:
 *  formSaldo: Almacena un nuevo saldo disponible y resta los gastos pendientes automaticamente
 *  formGasto: Crea los gastos catpurados y actualiza el saldo disponible
 */

formSaldo.addEventListener('submit', (e) => {
    e.preventDefault()
    localStorage.setItem('sueldo', sueldoInput.value)
    sueldo = sueldoInput.value
    actzaSaldoDisp()
    mostrarDisponible()
    mostrarGastos()
    mostrarMsj('success', 'Hecho!', 'El sueldo fue actualizado correctamente!')
}) 

formGasto.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Obtenemos los valores del formulariode gastos
    const idGasto    = gastosArr.length + 1
    const montoPesos = document.getElementById('montoGasto').value
    const tipoPago   = document.getElementById('tipoPago').value
    const fechaPago  = document.getElementById('fechaPago').value
    const statusApli = false;

    //Calculamos el monto en dolares en base al tipo de cambio obtenido en BANXICO (API)
    const montoDolares = (montoPesos / valorDolar).toFixed(2);
    
    // Creamos el objeto gasto y lo guardamos en el array
    gastosArr.push ( new Gasto( idGasto, montoPesos, montoDolares, tipoPago, fechaPago, statusApli ) ); 
    formGasto.reset()
    
    // Invocamos la funcion para actualizar el saldo disponible
    actzaSaldoDisp()

    // Mostramos los gastos y el saldo disponible en el DOM
    mostrarGastos()      
    mostrarDisponible();
})

/**
 * Funciones para mostrar informacion al usuario:
 *  mostrarGastos: Muestra los gastos creados
 *  mostrarDisponible: Muestra el saldo disponible
 *  mostrarMsj: Funcion para mostrar mensjes con sweet alert
 */

 const mostrarGastos = () => {
    console.log(gastosArr)
    divGastos.innerHTML = ''
    gastosArr.forEach( (gasto ) => {
        let status = (gasto.status) ? 'Aplicado' : 'No aplicado'
        divGastos.innerHTML += `
        
        <div class="card p-2 card-gasto" id="gasto${gasto.id}" style="width: 18rem; margin:3px">
            <div class="card-body">
                <h5 class="card-title"> Gasto #${gasto.id} </h5>
                <p class="card-text"> Monto MXN: ${gasto.montoPesos} </p>
                <p class="card-text"> Monto Dolares: ${gasto.montoDolares} </p>
                <p class="card-text"> Tipo pago: ${gasto.tipoDePago} </p>
                <p class="card-text"> Fecha: ${gasto.fecha} </p>
                <p class="card-text"> Estatus: ${status} </p>
            </div>
            <div class="ps-2">
                <button id="${gasto.id}" class="btn btn-danger"> Eliminar </button> 
            </div>
        </div>
        `
    })

}

const mostrarDisponible = () => {
    console.warn(sueldo)
        // Calculamos de manera informativa el disponible en dolares
        let sueldoDolar = (sueldo /valorDolar).toFixed(2)

        divSaldo.innerHTML = `
     
            <div class="card" style="width: 18rem; margin:3px; font-weight:bold;">
                <div class="card-body">
                    <p class="card-title"> Saldo disp.(pesos): ${sueldo} </p>
                </div>
            </div>
    
            <div class="card" style="width: 18rem; margin:3px; font-weight:bold;">
                <div class="card-body">
                    <p class="card-title"> Saldo disp.(dolares): ${sueldoDolar} </p>
                </div>
            </div>
        
        `
}

const mostrarMsj = (icono, titulo, mensaje) => {
    Swal.fire({
        icon:  `${icono}`,
        title: `${titulo}`,
        text:  `${mensaje}`,    
    })
}

/**
 * Funciones generales:
 *  actzaSaldoDisp: valida los gastos no aplicados y los resta del saldo disponible
 *  Enveto divGastos: Elimina los gastos de la aplicacion
 *  mostrarMsj: Funcion para mostrar mensjes con sweet alert
 */
// Funcion que 
const actzaSaldoDisp = () => {

    gastosArr.forEach( obj => {

        if (!obj.status) {
            //Si el gasto tiene monto mayor al saldo disponible, la deja como no aplicado. De lo contrario, la aplica
            console.error(sueldo, obj.montoPesos)
            if (sueldo < obj.montoPesos) { 
                mostrarMsj('warning', 'Advertencia!', `No se puede aplicar el gasto con id ${obj.id} debido a que el sueldo es insuciciente!. Cuando se capture un ingreso mayor al importe del gasto, se descontara automaticamente`)
            } else {
                sueldo -= obj.montoPesos
                obj.status = true 
                mostrarMsj('success', 'Hecho!', 'El gasto ha sido aplicado correctamente!.') 
            }
        } 
    })

    // Actualizamos el input en el DOM 
    sueldoInput.value = sueldo

    // Guardamos la actualizacion del sueldo y de los gastos a LS
    localStorage.setItem('sueldo', sueldo)
    localStorage.setItem('gastos', JSON.stringify(gastosArr))
}

divGastos.addEventListener('click', (e) => {
    // Obtenemos todas las cards de gastos
    const cardGasto = document.querySelectorAll('.card-gasto')

    // Armamos el id del elemento que vamos a eliminar
    let idElim = `gasto${e.target.id}`
    let itemElim = document.getElementById(idElim)

    /* NOTA: Falta agregar una condicion para omitir que se haga la eliminacion si se presiona algun otro elemento que no sea el boton de ELIMINAR, pero aún no encuentro como hacerlo*/

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

// Funcion de inicio del programa
iniciaApp()

