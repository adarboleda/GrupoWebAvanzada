function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">🔄 Cargando datos de COVID-19...</p>
            <p className="loading-subtext">Obteniendo información desde la API</p>
        </div>
    );
}

export default Loading;