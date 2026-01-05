// API de COVID Tracking - Datos históricos de EE.UU.
const API_URL="https://api.covidtracking.com/v1/us/daily.json";

export async function getCovidData(){
    const response=await fetch(API_URL);
    if( !response.ok){
        throw new Error("Error al obtener los datos de COVID-19");
    }
    const data=await response.json();
    // Retornamos los primeros 30 días para mejor visualización
    return data.slice(0, 30);
}