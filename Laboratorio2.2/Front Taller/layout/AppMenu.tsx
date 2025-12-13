import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';
import { useAuth } from '@/context/AuthContext';

const AppMenu = () => {
    const { usuario } = useAuth();

    const model: MenuModel[] = [
        {
            label: 'Sistema de Seguros',
            icon: 'pi pi-fw pi-shield',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                }
            ]
        },
        {
            label: 'Gestión',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: 'Conductores',
                    icon: 'pi pi-fw pi-user',
                    to: '/seguros/conductores'
                },
                {
                    label: 'Vehículos',
                    icon: 'pi pi-fw pi-car',
                    to: '/seguros/vehiculos'
                }
            ]
        },
        {
            label: 'Cotizaciones',
            icon: 'pi pi-fw pi-calculator',
            items: [
                {
                    label: 'Nueva Cotización',
                    icon: 'pi pi-fw pi-plus',
                    to: '/seguros/cotizacion'
                },
                {
                    label: 'Historial',
                    icon: 'pi pi-fw pi-list',
                    to: '/seguros/historial'
                }
            ]
        },
        {
            label: 'Pagos',
            icon: 'pi pi-fw pi-money-bill',
            items: [
                {
                    label: 'Gestionar Pagos',
                    icon: 'pi pi-fw pi-credit-card',
                    to: '/seguros/pagos'
                }
            ]
        }
    ];

    // Solo agregar Administración si el usuario es ADMIN
    if (usuario?.rol === 'ADMIN') {
        model.push({
            label: 'Administración',
            icon: 'pi pi-fw pi-lock',
            items: [
                {
                    label: 'Usuarios',
                    icon: 'pi pi-fw pi-users',
                    to: '/seguros/usuarios'
                }
            ]
        });
    }

    return <AppSubMenu model={model} />;
};

export default AppMenu;
