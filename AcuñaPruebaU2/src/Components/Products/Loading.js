function loading() {
    return (
        <div className="loading">
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando usuarios...</p>
        </div>
    );
}

export default loading;