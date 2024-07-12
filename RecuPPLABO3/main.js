const PERSONAS = JSON.parse(`[
    {"id":1, "nombre":"Clark", "apellido":"Kent", "edad":45, "alterego":"Superman", "ciudad":"Metropolis","publicado":2002},
    {"id":2, "nombre":"Bruce", "apellido":"Wayne", "edad":35, "alterego":"Batman", "ciudad":"Gotica","publicado":20012},
    {"id":3, "nombre":"Bart", "apellido":"Alen", "edad":30, "alterego":"Flash", "ciudad":"Central","publicado":2017},
    {"id":4, "nombre":"Lex", "apellido":"Luthor", "edad":18, "enemigo":"Superman", "robos":500,"asesinatos":7},
    {"id":5, "nombre":"Harvey", "apellido":"Dent", "edad":20, "enemigo":"Batman", "robos":750,"asesinatos":2},
    {"id":666, "nombre":"Celina", "apellido":"kyle", "edad":23, "enemigo":"Batman", "robos":25,"asesinatos":1}]`);



class Persona{
    constructor(id,nombre,apellido,edad){
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }
    toString(){
        return `id: ${this.id},nombre: ${this.nombre},apellido: ${this.apellido},edad: ${this.edad}`;
    }

    
    toJson(){
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            edad: this.edad
        });
    }
    
}

class Heroe extends Persona{
    constructor(id,nombre,apellido,edad,alterego,ciudad,publicado){
        super(id,nombre,apellido,edad);
        this.alterego = alterego;
        this.ciudad = ciudad;
        this.publicado = publicado;
    }
    toString(){
        return `${super.toString()},alterego: ${this.alterego},ciudad:${this.ciudad},publicado:${this.publicado}`;
    }
    toJson(){
        return JSON.stringify({
                id: this.id,
                nombre: this.nombre,
                apellido: this.apellido,
                edad: this.edad,
                alterego: this.alterego,
                ciudad: this.ciudad,
                publicado: this.publicado
        });
    }
}

class Villano extends Persona{
    constructor(id,nombre,apellido,edad,enemigo,robos,asesinatos){
        super(id,nombre,apellido,edad);
        this.enemigo = enemigo;
        this.robos = robos;
        this.asesinatos = asesinatos;
    }
    toString(){
        return `${super.toString()},enemigo:${this.enemigo},robos:${this.robos},asesinatos:${this.asesinatos}`;
    }
    toJson(){
        return JSON.stringify({
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            edad: this.edad,
            enemigo: this.enemigo,
            robos: this.robos,
            asesinatos: this.asesinatos
        })
    }
}

function $(id)
{
    return document.getElementById(id);
}

function instanciarPersonas(personas){
    return personas.map(persona => {
        if(persona.hasOwnProperty('alterego'))
            {
            return new Heroe(persona.id,persona.nombre,persona.apellido,persona.edad,persona.alterego,persona.ciudad,persona.publicado);
        }else{
            return new Villano(persona.id,persona.nombre,persona.apellido,persona.edad,persona.enemigo,persona.robos,persona.asesinatos);
        }
    });
}

const cargarPersonasALaTabla = (personas)=>{

    personas.forEach(persona => 
    {
        let filaDePersonaNueva = document.createElement('tr');               
        
        filaDePersonaNueva.innerHTML = `
        <td class="datos" name="columna-id">${persona.id}</td>
        <td class="datos" name="columna-nombre">${persona.nombre}</td>
        <td class="datos" name="columna-apellido">${persona.apellido}</td>
        <td class="datos" name="columna-edad">${persona.edad}</td>
        <td class="datos" name="columna-alterego">${persona.alterego || "N/A"} </td>
        <td class="datos" name="columna-ciudad">${persona.ciudad || "N/A"} </td>
        <td class="datos" name="columna-publicado">${persona.publicado || "N/A"} </td>
        <td class="datos" name="columna-enemigo">${persona.enemigo || "N/A"} </td>
        <td class="datos" name="columna-robos">${persona.robos || "N/A"} </td>            
        <td class="datos" name="columna-asesinatos">${persona.asesinatos || "N/A"} </td>            
        `;
        filaDePersonaNueva.setAttribute('name','persona');
        filaDePersonaNueva.addEventListener('dblclick',()=>mostrarAbmConDatos(filaDePersonaNueva));

        $('tablaPersonas').appendChild(filaDePersonaNueva);
    });
}

const ocultarColumna = () => {
    let checkBoxs = $('contenedor-columnas').querySelectorAll('input');
    columnasVerdaderas = [];
    columnasVerdaderas = Array.from(checkBoxs)
    .filter(c => c.checked)
    .map(c => c.id);


    let columnas = $('tabla-persona').querySelectorAll('.datos');
    columnas.forEach(columna=>{

        if(columnasVerdaderas.includes(columna.getAttribute('name'))){
            columna.style.visibility = 'visible';
        }else{
            columna.style.visibility = 'hidden';
        }
    })
}

const calcularPromedio = ()=>{
    let edades = [...document.querySelectorAll("#tabla-persona td[name='columna-edad']")];
    let totalEdad = edades.reduce((total, edad) => total + parseInt(edad.textContent), 0);
    let promedio = (totalEdad / edades.length).toFixed(2);           
    
    $('promedio-persona').textContent = promedio;
    
}

const filtrarPersonas = ()=>{
    
    let filtro = $('filtro-persona')
    let personasFiltradas = personasInstanciadas.filter(persona => {
        
        if(filtro.value == 'Heroe')
        {
            return persona.hasOwnProperty('alterego');
        }
        else if(filtro.value == 'Villano')
        {
            return persona.hasOwnProperty('enemigo');
        }else
        {
            return persona;
        }
    })
    vaciarElemento($('tablaPersonas'));
    cargarPersonasALaTabla(personasFiltradas);
}

const vaciarElemento = (elemento)=>{
    while(elemento.hasChildNodes()){
        elemento.removeChild(elemento.lastChild);
    }
}

const mostrarAbmConDatos = (persona)=>{
    
    $("id").parentNode.style.display = 'grid';
    $('contenedor-principal').style.display = 'none';
    $('btn-aceptar').style.display = 'none';
    $('titulo-abm').textContent = "Modificar/Eliminar persona";
    cargarDatos(persona);
    $('btn-modificar').style.display = 'inline';
    $('btn-eliminar').style.display = 'inline';

    $('contenedor-abm').style.display = 'grid';
}

const cargarDatos = (persona)=>{

    $('id').textContent = persona.querySelector('td[name="columna-id"]').textContent;
    $('nombre').value = persona.querySelector('td[name="columna-nombre"]').textContent;
    $('apellido').value = persona.querySelector('td[name="columna-apellido"]').textContent;
    $('edad').value = persona.querySelector('td[name="columna-edad"]').textContent;

    if(persona.querySelector('td[name="columna-alterego"]').textContent.trim() !== "N/A"){
        $('tipo').value = 'Heroe';
        $('atributo1').value = persona.querySelector('td[name="columna-alterego"]').textContent;
        $('atributo2').value = persona.querySelector('td[name="columna-ciudad"]').textContent;
        $('atributo3').value = persona.querySelector('td[name="columna-publicado"]').textContent;
    }else{
        $('tipo').value = 'Villano';
        $('atributo1').value = persona.querySelector('td[name="columna-enemigo"]').textContent;
        $('atributo2').value = persona.querySelector('td[name="columna-robos"]').textContent;
        $('atributo3').value = persona.querySelector('td[name="columna-asesinatos"]').textContent;
    }
    cargarAtributosDelTipo();
}

const mostrarAbmAgregarPersona = ()=>{
    $('btn-modificar').style.display = 'none';
    $('btn-eliminar').style.display = 'none';
    $("id").parentNode.style.display = 'none';
    $('atributo1').parentNode.style.display = 'none';
    $('atributo2').parentNode.style.display = 'none';
    $('atributo3').parentNode.style.display = 'none';
    $('contenedor-principal').style.display = 'none';
    $('titulo-abm').textContent = "Agregar nueva persona";
    $('contenedor-abm').style.display = 'grid';
    $('btn-aceptar').addEventListener('click',agregarPersona);
    $('btn-aceptar').style.display = 'inline';
}

const ResetearAbm = ()=>
{
    let datos = $("contenedor-abm").querySelectorAll(".data-persona");
    $('btn-modificar').style.display = 'none';
    $('btn-eliminar').style.display = 'none';
    $('tipo').value = '--';
    datos.forEach((element)=>
    {
        element.value = "";
    });
}

const agregarPersona = ()=>{
    if(validarDatos()){
        $('contenedor-abm').style.display = 'none'
        let personaNueva = retortarPersona();
        let id = obtenerUltimoId();
        personaNueva.id = id;
        personasInstanciadas.push(personaNueva);
        vaciarElemento($('tablaPersonas'));
        ResetearAbm();
        cargarPersonasALaTabla(personasInstanciadas);
        $('contenedor-principal').style.display = 'grid'
    }
}


const retortarPersona = ()=>{
    let nombre = $('nombre').value;
    let apellido = $('apellido').value;
    let edad = $('edad').value;
    let atributo1 = $('atributo1').value;
    let atributo2 = $('atributo2').value;
    let atributo3 = $('atributo3').value;
    if($('tipo').value == "Villano"){

        return new Villano(0,nombre,apellido,edad,atributo1,atributo2,atributo3);
    }
    else
    {
        return new Heroe(0,nombre,apellido,edad,atributo1,atributo2,atributo3);
    }
}

const obtenerUltimoId = ()=>{
    
    let ultimoId = Math.max(...personasInstanciadas.map(p => p.id));
    return ultimoId + 1;
}

const validarDatos = ()=>{
    let nombre = $('nombre').value;
    let apellido = $('apellido').value;
    let edad = $('edad').value;
    let atributo1 = $('atributo1');
    let atributo2 = $('atributo2');
    let atributo3 = $('atributo3');

    if(typeof nombre !== 'null' && nombre != '' && 
        typeof apellido !== 'null' && apellido != '' &&
        typeof edad !== 'null' && edad > 0)
    {
        if($('tipo').value == 'Heroe')
        {
            if(typeof atributo1.value !== 'null' && atributo1.value !== "" &&
                typeof atributo2.value !== 'null' && atributo2.value !== "" &&
                typeof atributo3.value !== 'null' && atributo3.value > 1940)
            {
                return true
            }
        }
        else
        {
            if(typeof atributo1.value !== 'null' && atributo1.value !== '' &&
                typeof atributo2.value !== 'null' && atributo2.value > 0 &&
                typeof atributo3.value !== 'null' && atributo3.value > 0 )
            {
                return true;
            }
        }
    }
    alert('Datos mal ingresados!');
    return false;
}

const cargarAtributosDelTipo = () =>
{
    let atributo1Padre = $('atributo1').parentNode;
    let atributo2Padre = $('atributo2').parentNode;
    let atributo3Padre = $('atributo3').parentNode;
    let atributo1 = $('atributo1');
    let atributo2 = $('atributo2');
    let atributo3 = $('atributo3');
    if($('tipo').value == 'Villano'){
        atributo1Padre.innerHTML = 'Enemigo:';
        atributo1Padre.appendChild(atributo1);
        atributo2Padre.innerHTML = 'Robos:';
        atributo2Padre.appendChild(atributo2);
        atributo3Padre.innerHTML = 'Asesinatos:';
        atributo3Padre.appendChild(atributo3);
        atributo1Padre.style.display = 'block';
        atributo2Padre.style.display = 'block';
        atributo3Padre.style.display = 'block';
    }
    else if($('tipo').value == 'Heroe'){
        atributo1Padre.innerHTML = 'Alter Ego:';
        atributo1Padre.appendChild(atributo1);
        atributo2Padre.innerHTML = 'Ciudad:';
        atributo2Padre.appendChild(atributo2);
        atributo3Padre.innerHTML = 'Publicado:';
        atributo3Padre.appendChild(atributo3);
        atributo1Padre.style.display = 'block';
        atributo2Padre.style.display = 'block';
        atributo3Padre.style.display = 'block';
    }
    else{
        atributo1Padre.style.display = 'none';
        atributo2Padre.style.display = 'none';
        atributo3Padre.style.display = 'none';
    }
}

const modificarPersona = () =>{
    if(validarDatos())
    {
        $('contenedor-abm').style.display = 'none'
        let persona = retortarPersona();
        persona.id = $('id').textContent;
        personasInstanciadas = personasInstanciadas.filter((p)=>p.id != persona.id);
        personasInstanciadas.push(persona);
        vaciarElemento($('tablaPersonas'));
        ResetearAbm();
        cargarPersonasALaTabla(personasInstanciadas);
        $('contenedor-principal').style.display = 'grid'
    }
}
const eliminarPersona = ()=>{
    if(validarDatos())
    {
        $('contenedor-abm').style.display = 'none'
        let persona = retortarPersona();
        persona.id = $('id').textContent;
        personasInstanciadas = personasInstanciadas.filter((p)=>p.id != persona.id);
        vaciarElemento($('tablaPersonas'));
        ResetearAbm();
        cargarPersonasALaTabla(personasInstanciadas);
        $('contenedor-principal').style.display = 'grid'
    }
}

const ordenarMenorMayor = (atributo) =>{

    personasInstanciadas.sort((a, b) => {
        let valorA = a[atributo];
        let valorB = b[atributo];

        if (typeof valorA === undefined && typeof valorB === undefined) {
            return 0;
        }
        if (typeof valorA === undefined) {
            return 1;
        }
        if (typeof valorB === undefined) {
            return -1;
        }

        if (typeof valorA === 'string' && typeof valorB === 'string') {
            return valorA.localeCompare(valorB);
        }

        if (valorA < valorB) {
            return -1;
        }
        if (valorA > valorB) {
            return 1;
        }
        return 0;
    });
    vaciarElemento($('tablaPersonas'));
    cargarPersonasALaTabla(personasInstanciadas);
}
const ordenarMayorMenor = (atributo) =>{

        personasInstanciadas.sort((a, b) => {
            let valorA = a[atributo];
            let valorB = b[atributo];
    
            if (valorA === undefined && valorB === undefined) {
                return 0;
            }
    
            if (valorA === undefined) {
                return 1;
            }
            if (valorB === undefined) {
                return -1;
            }
    
            if (typeof valorA === 'string' && typeof valorB === 'string') {
                return valorB.localeCompare(valorA);
            }
    
            if (valorA > valorB) {
                return -1;
            }
            if (valorA < valorB) {
                return 1;
            }
            return 0;
        });
    vaciarElemento($('tablaPersonas'));
    cargarPersonasALaTabla(personasInstanciadas);
}

var personasInstanciadas = instanciarPersonas(PERSONAS);
cargarPersonasALaTabla(personasInstanciadas);

const btnAgregarPersona = $('btn-agregar');
const btnCancelar = $('btn-cancelar');
const btnCalcular = $('btn-calcular');
const btnModificar = $('btn-modificar');
const btnEliminar = $('btn-eliminar');
const checkBoxs = $('contenedor-columnas').querySelectorAll('input');
const filtroPersona = $('filtro-persona');
const selectTipo = $('tipo');
const columnas = $('tabla-persona').querySelector('tr').querySelectorAll('th[class="datos"]');



btnAgregarPersona.addEventListener('click',mostrarAbmAgregarPersona);
btnCancelar.addEventListener('click',()=>{
    $('contenedor-abm').style.display = 'none';
    $('contenedor-principal').style.display = 'grid';
    ResetearAbm();
})
btnCalcular.addEventListener('click',calcularPromedio);
btnModificar.addEventListener('click',modificarPersona);
btnEliminar.addEventListener('click',eliminarPersona);

checkBoxs.forEach(checkBox=>{
    checkBox.addEventListener('change',ocultarColumna)
});
filtroPersona.addEventListener('change',filtrarPersonas);
selectTipo.addEventListener('change',cargarAtributosDelTipo);
columnas.forEach(c=>
    {
        let atributo = c.getAttribute('name').split('-')[1];
        c.addEventListener('click',()=>ordenarMenorMayor(atributo));
        c.addEventListener('dblclick',()=>ordenarMayorMenor(atributo));
    })