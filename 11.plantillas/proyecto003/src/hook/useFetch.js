import { useState, useEffect } from 'react';

//hook personalizado
export function useFetch(asyncCallback) {
  //estados internos
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //ejecutar una peticion
  useEffect(() => {
    async function fetchData() {
      try {
        //ejecuta la funcion de la api
        const result = await asyncCallback();
        setData(result);
      } catch (error) {
        //si la api falla
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
