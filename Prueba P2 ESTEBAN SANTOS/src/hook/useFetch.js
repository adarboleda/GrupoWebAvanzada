import { useState, useEffect } from "react";
//hook para obtener datos de una API
export function useFetch (asyncCallback){
    //estado internos
    const [data, setData]=useState(null);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);
    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const response=await asyncCallback();
                setData(response);
                setLoading(false);
            }catch(error){
                setError(error);
            }finally{
                setLoading(false);
            }
        };
        fetchData();
    },[asyncCallback]);
    return {data, loading, error};
}   