'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import EquipoForm from '../components/EquipoForm';
import EquipoTable from '../components/EquipoTable';

export default function EquiposPage() {
  const [showForm, setShowForm] = useState(false);
  const [equipoEditar, setEquipoEditar] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const handleNuevoEquipo = () => {
    setEquipoEditar(null);
    setShowForm(true);
  };

  const handleEditarEquipo = (equipo) => {
    setEquipoEditar(equipo);
    setShowForm(true);
  };

  const handleGuardar = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Card title="Gestión de Equipos">
          <div className="mb-3">
            <Button label="Nuevo Equipo" icon="pi pi-plus" onClick={handleNuevoEquipo} />
          </div>
          <EquipoTable refresh={refresh} onEdit={handleEditarEquipo} />
        </Card>
      </div>
      <EquipoForm visible={showForm} onHide={() => setShowForm(false)} onSave={handleGuardar} equipoEditar={equipoEditar} />
    </div>
  );
}
