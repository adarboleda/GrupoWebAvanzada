'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';

/**
 * Componente Messages
 * Página para visualizar todos los mensajes enviados desde el formulario de contacto
 */
function Messages() {
    // Estado para almacenar los mensajes
    const [messages, setMessages] = useState<any[]>([]);

    // Estado para controlar el diálogo de detalles
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [displayDialog, setDisplayDialog] = useState(false);

    // Cargar mensajes desde localStorage al montar el componente
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        setMessages(savedMessages);
    }, []);

    // Función para mostrar el mensaje completo
    const viewMessage = (message: any) => {
        setSelectedMessage(message);
        setDisplayDialog(true);
    };

    // Función para eliminar un mensaje
    const deleteMessage = (index: number) => {
        const updatedMessages = messages.filter((_, i) => i !== index);
        setMessages(updatedMessages);
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
    };

    // Función para eliminar todos los mensajes
    const deleteAllMessages = () => {
        if (confirm('¿Estás seguro de que deseas eliminar todos los mensajes?')) {
            setMessages([]);
            localStorage.setItem('messages', JSON.stringify([]));
        }
    };

    // Template para el botón de acciones
    const actionBodyTemplate = (rowData: any, options: any) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info p-button-text" onClick={() => viewMessage(rowData)} tooltip="Ver mensaje" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-text" onClick={() => deleteMessage(options.rowIndex)} tooltip="Eliminar" />
            </div>
        );
    };

    // Template para el footer del diálogo
    const dialogFooter = (
        <div>
            <Button label="Cerrar" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-text" />
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <Card title="Mensajes Recibidos" subTitle="Lista de todos los mensajes enviados desde el formulario de contacto">
                    <div className="flex justify-content-end mb-3">
                        <Button label="Eliminar Todos" icon="pi pi-trash" className="p-button-danger" onClick={deleteAllMessages} disabled={messages.length === 0} />
                    </div>
                    <DataTable
                        value={messages}
                        paginator
                        rows={10}
                        dataKey="date"
                        emptyMessage="No hay mensajes"
                        className="datatable-responsive"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} mensajes"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[5, 10, 25]}
                    >
                        <Column field="name" header="Nombre" sortable style={{ width: '20%' }}></Column>
                        <Column field="email" header="Email" sortable style={{ width: '25%' }}></Column>
                        <Column
                            field="message"
                            header="Mensaje"
                            body={(rowData) => (
                                <span>
                                    {rowData.message.substring(0, 50)}
                                    {rowData.message.length > 50 ? '...' : ''}
                                </span>
                            )}
                            style={{ width: '35%' }}
                        ></Column>
                        <Column field="date" header="Fecha" sortable style={{ width: '15%' }}></Column>
                        <Column body={actionBodyTemplate} header="Acciones" style={{ width: '10%', textAlign: 'center' }}></Column>
                    </DataTable>

                    {/* Diálogo para ver el mensaje completo */}
                    <Dialog
                        visible={displayDialog}
                        style={{ width: '50vw' }}
                        header="Detalle del Mensaje"
                        modal
                        footer={dialogFooter}
                        onHide={() => setDisplayDialog(false)}
                        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    >
                        {selectedMessage && (
                            <div className="grid">
                                <div className="col-12">
                                    <h5 className="text-primary">Nombre:</h5>
                                    <p className="text-900">{selectedMessage.name}</p>
                                </div>
                                <div className="col-12">
                                    <h5 className="text-primary">Email:</h5>
                                    <p className="text-900">{selectedMessage.email}</p>
                                </div>
                                <div className="col-12">
                                    <h5 className="text-primary">Fecha:</h5>
                                    <p className="text-900">{selectedMessage.date}</p>
                                </div>
                                <div className="col-12">
                                    <h5 className="text-primary">Mensaje:</h5>
                                    <p className="text-900 white-space-normal">{selectedMessage.message}</p>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Card>
            </div>
        </div>
    );
}

export default Messages;
