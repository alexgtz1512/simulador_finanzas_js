// Variables globales
let gastosArr    = []
let sdoDisp   = 0
let sueldo    = 0
let numGastos = 0

class Gasto {
    constructor (id, monto, tipoPago, fecha) {
        this.id        = id;
        this.monto     = monto;
        this.tipoPago  = tipoPago;
        this.fecha     = fecha;
    }
}


const creaGastos = (gastos) => {
    // Variables locales usadas para capturar los datos del gasto
    let id       
    let monto    
    let tipoPago 
    let date     

    //Funcion que valida que el tipo de pago sea valido
    const evaluaTipoPago = () => {

        tipoPago = prompt (`Gasto ${id} | Ingresa el tipo de pago` ).toLowerCase();

        if (tipoPago == 'efectivo' || tipoPago == 'tarjeta' || tipoPago == 'vales') {
            return tipoPago
        } else {
            let opcion = confirm('Tipo de pago no valido, solo se acepta efectivo, tarjeta o vales. ¿Deseas reintentar?')
            if (opcion == true) {
               return evaluaTipoPago();
            } else {
                return 'otro'
            }
            
        }

    }

    //Iteracion para solicitar el numero de gastos ingresado por el usuario
    for (let i = 0; i < gastos; i++) {

        id       = i + 1; 
        monto    = parseFloat ( prompt(`Gasto ${id} | Ingresa monto`));
        tipoPago = evaluaTipoPago();
        date     = new Date().toLocaleDateString();

        //Crea un nuevo objeto de Gasto en el arreglo
        gastosArr.push ( new Gasto( id, monto, tipoPago, date ) ); 
    }
    console.log (gastosArr)

}

//Funcion para calcular el saldo disponible despues de gastos
const restaGastos = (sueldo) => {

    gastosArr.forEach ( obj => {
        sueldo -= obj.monto

    })
    return sueldo;
}

//Imprime el saldo disponible o deuda
const imprimeSaldo = () => {
    if (sdoDisp > 0) {
        console.log (`El saldo disponible es de ${sdoDisp}`)
    } else {
        console.log(`Tu saldo es negativo: ${sdoDisp}`)
    }
}

const montoPorTipoPago = (filtro) => {
    let suma = 0
    gastosArr.forEach( elem => {
        if (elem.tipoPago == filtro) {
            suma += elem.monto
        }
    })

    console.log(`El monto gastado con ${filtro} es: ${suma}`)
}


sueldo    = parseFloat( prompt("Ingresa tu sueldo") );
numGastos = parseInt( prompt("Ingresa numero de gastos"))

//Registra datos de los gastos
creaGastos(numGastos);

//Calcula el saldo disponible despues de gastos
sdoDisp  = restaGastos(sueldo)
console.table(sdoDisp)

//Imprime saldo disponible o deuda
imprimeSaldo()

montoPorTipoPago('efectivo')
montoPorTipoPago('tarjeta')
montoPorTipoPago('vales')
