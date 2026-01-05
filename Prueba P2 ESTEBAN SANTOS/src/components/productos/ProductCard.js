import "../../style/app.css";

function ProductCard({ producto }) {
    // Formatear la fecha desde formato YYYYMMDD a DD/MM/YYYY
    const formatDate = (dateString) => {
        const str = dateString.toString();
        const year = str.substring(0, 4);
        const month = str.substring(4, 6);
        const day = str.substring(6, 8);
        return `${day}/${month}/${year}`;
    };

    // Formatear números con separador de miles
    const formatNumber = (num) => {
        return num ? num.toLocaleString('es-ES') : '0';
    };

    // Calcular tasa de mortalidad
    const calculateDeathRate = () => {
        if (producto.positive && producto.death) {
            return ((producto.death / producto.positive) * 100).toFixed(2);
        }
        return '0';
    };

    return (
        <div className="covid-card">
            <div className="card-header">
                <h3 className="date-title">📅 {formatDate(producto.date)}</h3>
            </div>
            <div className="card-content">
                <div className="stat-item positive">
                    <span className="stat-label">🦠 Casos Positivos</span>
                    <span className="stat-value">{formatNumber(producto.positive)}</span>
                </div>
                <div className="stat-item deaths">
                    <span className="stat-label">💀 Muertes</span>
                    <span className="stat-value">{formatNumber(producto.death)}</span>
                </div>
                <div className="stat-item hospitalized">
                    <span className="stat-label">🏥 Hospitalizados</span>
                    <span className="stat-value">{formatNumber(producto.hospitalized)}</span>
                </div>
                <div className="stat-item recovered">
                    <span className="stat-label">✅ Recuperados</span>
                    <span className="stat-value">{formatNumber(producto.recovered)}</span>
                </div>
                <div className="stat-item tests">
                    <span className="stat-label">🔬 Total Tests</span>
                    <span className="stat-value">{formatNumber(producto.totalTestResults)}</span>
                </div>
            </div>
            <div className="card-footer">
                <div className="death-rate">
                    <span>Tasa de Mortalidad: </span>
                    <strong>{calculateDeathRate()}%</strong>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;