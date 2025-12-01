import { useState, useEffect } from "react";

//hook personalizado para consumir APIs
export function useFetch(asyncCallback) {
    const [data, setData] = useState([]);   
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    //ejecutar una peticion cuando el componente se monta
    useEffect(() => {
        async function fetchData() { 
            setLoading(true);
            try {
                //ejecutar la funcion de la API
                const result = await asyncCallback();
                setData(result);
            } catch (err) {
                //si la API falla
                setError(err);
            } finally {
                //finalizar carga
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { data, loading, error };
}