'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import JugadorForm from '../components/JugadorForm';
import JugadorTable from '../components/JugadorTable';

export default function JugadoresPage() {
  const [showForm, setShowForm] = useState(false);
  const [jugadorEditar, setJugadorEditar] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [equipoIdFiltro, setEquipoIdFiltro] = useState(null);

  const handleNuevoJugador = () => {
    setJugadorEditar(null);
    setShowForm(true);
  };

  const handleEditarJugador = (jugador) => {
    setJugadorEditar(jugador);
    setShowForm(true);
  };

  const handleGuardar = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Card title="Gestión de Jugadores">
          <div className="mb-3">
            <Button label="Nuevo Jugador" icon="pi pi-plus" onClick={handleNuevoJugador} />
          </div>
          <JugadorTable refresh={refresh} equipoIdFiltro={equipoIdFiltro} onEdit={handleEditarJugador} />
        </Card>
      </div>
      <JugadorForm visible={showForm} onHide={() => setShowForm(false)} onSave={handleGuardar} jugadorEditar={jugadorEditar} />
    </div>
  );
}
