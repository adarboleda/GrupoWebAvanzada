import React,{useState, useEffect, use} from "react";

//componente funcional del formulario
function DonacionesForm({onGuardar, editDonacion, onCancelEdit}) {

  const[form, setForm] = useState({
    euros: " ",
    dolares: " ",
    reales: " "
  });

  useEffect(() => {
    if(editDonacion){
      setForm(editDonacion);
    }}, [editDonacion]); 

    //handle change 
    const handleChange = (e) => {
        setForm({...form,[e.target.name]: e.target.value});
    }
    //handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        //calidacin: ningun valor va sser negativo
        if(Object.values(form).some(value => Number(value) < 0)){
            alert("Todos los valores deben ser positivos");
            return;
        }

        //envia los datos conversion
        onGuardar({euros: Number(form.euros), 
            dolares: Number(form.dolares), 
            reales: Number(form.reales)});
        //limpia el formulario
        setForm({euros: " ", dolares: " ", reales: " "});
        
        //muestre formulario
        return (
        <form onSubmit={handleSubmit} style={{margin: "1rem"}}>
            <h2> {editDonacion ? "Editar donación" : "Nueva donación"}  </h2>
        <input 
            type="number" 
            name="euros"
            placeholder="Euros"
            value={form.euros}
            onChange={handleChange}
            required
        >   </input>
        <input 
            type="number" 
            name="dolares"
            placeholder="Dólares"
            value={form.dolares}
            onChange={handleChange}
            required
        >   </input>
        <input 
            type="number" 
            name="reales"
            placeholder="Reales"
            value={form.reales}
            onChange={handleChange}
            required
        >   </input>
        <button type="submit"> 
            {editDonacion ? "Actualizar" : "Guardar"} </button>

      
        {editDonacion && (
            <button type="button" onClick={onCancelEdit} style={{marginLeft: "10px"}}>
                Cancelar
            </button>)}
        </form>
        );
    }
}

//exportar el componente
export default DonacionesForm;

