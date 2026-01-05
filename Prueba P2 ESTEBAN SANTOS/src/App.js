import { useFetch } from "./hook/useFetch";
import { getCovidData } from "./services/productService";
import ProductList from "./components/productos/ProductList";
import Loading from "./components/productos/Loading";
import "./style/app.css";

function App() {
  const { data: covidData, loading, error } = useFetch(getCovidData);
  return (
    <div className="container">
      <div className="header">
        <h1>📊 COVID-19 Tracker USA</h1>
        <p className="subtitle">Datos históricos de seguimiento de COVID-19 en Estados Unidos</p>
        <div className="info-badge">
          <span>🔬 Fuente: The COVID Tracking Project</span>
        </div>
      </div>
      {loading && <Loading />}
      {error && <p className="error-message">⚠️ {error.message}</p>}
      {covidData && <ProductList productos={covidData} />}
    </div>
  );
}

export default App;
