import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';

const AppMenu = () => {
    // COMENTADOS: Todos los menús que no se usan en la aplicación de seguros
    // Solo se mantienen las opciones para: Cotizaciones e Historial
    
    const model: MenuModel[] = [
        {
            label: 'Sistema de Seguros',
            icon: 'pi pi-fw pi-shield',
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
        }
        // COMENTADOS - No necesarios para la app de seguros:
        // - Favorites / Dashboards
        // - Apps (Blog, Calendar, Chat, Files, Mail, Task List)
        // - UI Kit (Form Layout, Input, Button, Table, etc.)
        // - Prime Blocks
        // - Utilities (Icons, Colors, PrimeFlex, Figma)
        // - Pages (Landing, Auth pages, CRUD, Timeline, Invoice, etc.)
        // - E-Commerce (Products, Cart, Checkout, etc.)
        // - User Management
        // - Hierarchy
        // - Start / Documentation
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
