import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: 'Gestión de Fútbol',
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
            label: 'Equipos y Jugadores',
            icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'Equipos',
                    icon: 'pi pi-fw pi-flag',
                    to: '/gestion/equipos'
                },
                {
                    label: 'Jugadores',
                    icon: 'pi pi-fw pi-user',
                    to: '/gestion/jugadores'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
