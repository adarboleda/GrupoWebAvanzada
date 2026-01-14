'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { Password } from 'primereact/password';
import { usuarioService } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';

interface Usuario {
    id_usuario: number;
    username: string;
    nombre_completo: string;
    email: string;
    rol: 'ADMIN' | 'OPERADOR';
    activo: boolean;
    createdAt?: string;
}

const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [usuario, setUsuario] = useState<Partial<Usuario>>({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [password, setPassword] = useState('');
    const toast = useRef<Toast>(null);
    const { usuario: usuarioActual } = useAuth();

    const roles = [
        { label: 'Administrador', value: 'ADMIN' },
        { label: 'Operador', value: 'OPERADOR' }
    ];

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setLoading(true);
        const resultado = await usuarioService.obtenerTodos();
        if (resultado.ok) {
            setUsuarios(resultado.data);
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: resultado.error,
                life: 3000
            });
        }
        setLoading(false);
    };

    const openNew = () => {
        setUsuario({
            activo: true,
            rol: 'OPERADOR'
        });
        setPassword('');
        setIsEditing(false);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const saveUsuario = async () => {
        setSubmitted(true);

        if (!usuario.username?.trim() || !usuario.nombre_completo?.trim() || !usuario.email?.trim()) {
            return;
        }

        if (!isEditing && !password) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'La contraseña es requerida para nuevos usuarios',
                life: 3000
            });
            return;
        }

        const datosUsuario = {
            username: usuario.username,
            nombre_completo: usuario.nombre_completo,
            email: usuario.email,
            rol: usuario.rol || 'OPERADOR',
            activo: usuario.activo !== false,
            ...(password && { password })
        };

        let resultado;
        if (isEditing) {
            resultado = await usuarioService.actualizar(usuario.id_usuario!, datosUsuario);
        } else {
            resultado = await usuarioService.crear(datosUsuario);
        }

        if (resultado.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: `Usuario ${isEditing ? 'actualizado' : 'creado'} exitosamente`,
                life: 3000
            });
            setUsuarioDialog(false);
            setUsuario({});
            setPassword('');
            cargarUsuarios();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: resultado.error,
                life: 5000
            });
        }
    };

    const editUsuario = (usuario: Usuario) => {
        setUsuario({ ...usuario });
        setPassword('');
        setIsEditing(true);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = async () => {
        const resultado = await usuarioService.eliminar(usuario.id_usuario!);

        if (resultado.ok) {
            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario eliminado exitosamente',
                life: 3000
            });
            setDeleteUsuarioDialog(false);
            setUsuario({});
            cargarUsuarios();
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: resultado.error,
                life: 3000
            });
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setUsuario({ ...usuario, [name]: val });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Nuevo Usuario" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Actualizar" icon="pi pi-refresh" onClick={cargarUsuarios} />;
    };

    const rolBodyTemplate = (rowData: Usuario) => {
        return <Tag value={rowData.rol === 'ADMIN' ? 'Administrador' : 'Operador'} severity={rowData.rol === 'ADMIN' ? 'danger' : 'info'} />;
    };

    const activoBodyTemplate = (rowData: Usuario) => {
        return <Tag value={rowData.activo ? 'Activo' : 'Inactivo'} severity={rowData.activo ? 'success' : 'warning'} />;
    };

    const actionBodyTemplate = (rowData: Usuario) => {
        const esUsuarioActual = rowData.id_usuario === usuarioActual?.id_usuario;

        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUsuario(rowData)} disabled={esUsuarioActual} tooltip={esUsuarioActual ? 'No puedes eliminar tu propia cuenta' : ''} />
            </div>
        );
    };

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUsuario} />
        </>
    );

    const deleteUsuarioDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsuarioDialog} />
            <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteUsuario} />
        </>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

            <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

            <DataTable value={usuarios} loading={loading} paginator rows={10} dataKey="id_usuario" emptyMessage="No hay usuarios registrados" className="datatable-responsive">
                <Column field="id_usuario" header="ID" sortable style={{ width: '5%' }}></Column>
                <Column field="username" header="Usuario" sortable style={{ width: '15%' }}></Column>
                <Column field="nombre_completo" header="Nombre Completo" sortable style={{ width: '25%' }}></Column>
                <Column field="email" header="Email" sortable style={{ width: '20%' }}></Column>
                <Column header="Rol" body={rolBodyTemplate} sortable style={{ width: '12%' }}></Column>
                <Column header="Estado" body={activoBodyTemplate} sortable style={{ width: '10%' }}></Column>
                <Column header="Acciones" body={actionBodyTemplate} exportable={false} style={{ width: '13%' }}></Column>
            </DataTable>

            <Dialog
                visible={usuarioDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                modal
                className="p-fluid"
                footer={usuarioDialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="username" className="font-bold">
                        Usuario *
                    </label>
                    <InputText id="username" value={usuario.username || ''} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={submitted && !usuario.username ? 'p-invalid' : ''} />
                    {submitted && !usuario.username && <small className="p-error">El usuario es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="nombre_completo" className="font-bold">
                        Nombre Completo *
                    </label>
                    <InputText id="nombre_completo" value={usuario.nombre_completo || ''} onChange={(e) => onInputChange(e, 'nombre_completo')} required className={submitted && !usuario.nombre_completo ? 'p-invalid' : ''} />
                    {submitted && !usuario.nombre_completo && <small className="p-error">El nombre completo es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="email" className="font-bold">
                        Email *
                    </label>
                    <InputText id="email" type="email" value={usuario.email || ''} onChange={(e) => onInputChange(e, 'email')} required className={submitted && !usuario.email ? 'p-invalid' : ''} />
                    {submitted && !usuario.email && <small className="p-error">El email es requerido.</small>}
                </div>

                <div className="field">
                    <label htmlFor="password" className="font-bold">
                        Contraseña {isEditing ? '(dejar en blanco para no cambiar)' : '*'}
                    </label>
                    <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={!isEditing} className={submitted && !isEditing && !password ? 'p-invalid' : ''} />
                    {submitted && !isEditing && !password && <small className="p-error">La contraseña es requerida.</small>}
                </div>

                <div className="field">
                    <label htmlFor="rol" className="font-bold">
                        Rol *
                    </label>
                    <Dropdown id="rol" value={usuario.rol} options={roles} onChange={(e) => setUsuario({ ...usuario, rol: e.value })} placeholder="Seleccione un rol" />
                </div>

                <div className="field-checkbox">
                    <input type="checkbox" id="activo" checked={usuario.activo !== false} onChange={(e) => setUsuario({ ...usuario, activo: e.target.checked })} className="mr-2" />
                    <label htmlFor="activo">Usuario Activo</label>
                </div>
            </Dialog>

            <Dialog visible={deleteUsuarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                <div className="confirmation-content flex align-items-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {usuario && (
                        <span>
                            ¿Está seguro de que desea eliminar el usuario <b>{usuario.username}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default UsuariosPage;
