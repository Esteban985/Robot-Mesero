const estados = {
    '1': 'Cliente no estaba en Mesa',
    '2': 'entregado',
    '3': 'Pedido Equivocado'
}

class nuevoPedido {
    constructor(numerodeMesa, nombre, platillo, bebida, numero, estado) {
        this.numeroMesa = numerodeMesa;
        this.nombreCliente = nombre;
        this.platillo = platillo;
        this.bebida = bebida;
        this.noPedido = numero;
        this.estado = nuevoPedido.agregarEstado();
        this.next = null;
    }
    static agregarEstado() {
        return Math.floor(Math.random() * 3) + 1
    }
}

class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.length = 0;
        this.noPedido = 0;
        this.noMesa = 0;
    }
    peek() {
        return this.first;
    }
    enqueue(nombre, platillo, bebida) {
        this.noPedido++;
        this.noMesa++;
        const pedidoNuevo = new nuevoPedido(this.noMesa, nombre, platillo, bebida, this.noPedido);
        if (this.length == 0) {
            this.first = pedidoNuevo;
            this.last = pedidoNuevo;
        } else {
            this.last.next = pedidoNuevo;
            this.last = pedidoNuevo;
        }
        this.length++;

        return this;
    }
    //eliminar el primero
    dequeue() {
        let basura = this.first;
        this.first = this.first.next;

        this.length--;
        if (this.length == 0) {
            this.noMesa = 0;
        }
        hisotrial.enqueue(basura.numeroMesa, basura.nombreCliente, basura.platillo, basura.bebida, basura.noPedido)
    }
    mostrarPedidos() {
        let html = ''
        let pedidos = this.first

        while (pedidos != null) {
            html += `
            <div class="pedido-card">
                <strong>#${pedidos.noPedido}</strong>
                <p>Mesa ${pedidos.numeroMesa} - ${pedidos.nombreCliente}</p>
                <small>${pedidos.platillo} + ${pedidos.bebida}</small>
            </div>`
            pedidos = pedidos.next
        }

        if (this.first == null) {
            mostrarProximoPedido.textContent = 'Sin pedidos'
            mostrarPedidoActual.textContent = 'Esperando pedidos...'
        } else {
            if (this.first.next != null) {
                mostrarProximoPedido.textContent = this.first.next.nombreCliente
            } else {
                mostrarProximoPedido.textContent = 'Sin pedidos'
            }
            mostrarPedidoActual.textContent = this.first.nombreCliente
        }

        mostrarPendientes.textContent = this.length
        containerPedidos.innerHTML = html
    }
    leerMensaje() {
        let mensaje = `Pedido completado, A nombre de ${this.first.nombreCliente}`
        return mensaje;
    }
}

class QueueHistorial {
    constructor() {
        this.first = null;
        this.last = null;
        this.length = 0;
    }
    peek() {
        return this.first;
    }
    //Voy a recibir los datos de lo que elimine para poder crear un nuevo nodo.
    enqueue(noMesa,nombre,platillo,bebida,noPedido) {
        const pedidoNuevo = new nuevoPedido(noMesa,nombre,platillo,bebida,noPedido);
        if (this.length == 0) {
            this.first = pedidoNuevo;
            this.last = pedidoNuevo;
        } else {
            this.last.next = pedidoNuevo;
            this.last = pedidoNuevo;
        }
        this.length++;

        return this;
    }
    dequeue() {
        let basura = this.first;
        this.first = this.first.next;

        this.length--;

        return basura;
    }
    dibujarHistorial() {
        let html = ''
        let actual = this.first

        while (actual != null) {
            let clase = ''
            if (actual.estado == 1) {
                clase = 'no-encontrado'
            } else if (actual.estado == 2) {
                clase = 'entregado'
            } else if (actual.estado == 3) {
                clase = 'equivocado'
            }
            html += `
            <tr>
                <td>#${actual.noPedido}</td>
                <td>${actual.numeroMesa}</td>
                <td>${actual.nombreCliente}</td>
                <td>
                    <span class="estado ${clase}">
                            ${estados[actual.estado]}
                    </span>
                </td>
            </tr>`
            actual = actual.next
        }

        containerHistorial.innerHTML = html
    }
}

const misPedidos = new Queue();
const hisotrial = new QueueHistorial();

//DOM
let formDatos = document.querySelector('#datos')
let containerPedidos = document.querySelector('#listaPedidos')
let mostrarPedidoActual = document.querySelector('#pedidoActual')
let mostrarProximoPedido = document.querySelector('#proximoPedido')
let mostrarPendientes = document.querySelector('#totalPendientes')
let btnSiguiente = document.querySelector('#siguientePedido')
let containerHistorial = document.querySelector('#hisotrial')

formDatos.addEventListener('submit', (event) => {
    event.preventDefault()
    if (event.target.nombre.value.trim() == '') {
        alert('No puede dejar el nombre vacio')
    } else if (event.target.platillo.value.trim() == '') {
        alert('No puede dejar el campo del platillo vacio')
    } else if (event.target.bebida.value.trim() == '') {
        alert('No puede dejar el campo de bebida vacio')
    } else {
        misPedidos.enqueue(event.target.nombre.value.trim(), event.target.platillo.value.trim(), event.target.bebida.value.trim())
        formDatos.reset()
        misPedidos.mostrarPedidos()
    }
})

btnSiguiente.addEventListener('click', (event) => {
    if (misPedidos.first == null) {
        alert('No hay pedidos por entregar')
    } else {
        const sonido = new SpeechSynthesisUtterance(misPedidos.leerMensaje())
        sonido.lang = 'es-ES';
        sonido.volume = 1; //ajuster el volumen
        sonido.rate = 1;// ajustar la velocidad
        sonido.pitch = 1;//ajustar la agusidez de la voz
        window.speechSynthesis.cancel(sonido)
        window.speechSynthesis.speak(sonido)
        misPedidos.dequeue()
        misPedidos.mostrarPedidos()
        hisotrial.dibujarHistorial()
    }
})