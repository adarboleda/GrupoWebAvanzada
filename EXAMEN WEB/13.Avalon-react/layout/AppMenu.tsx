import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';

const AppMenu = () => {
    const model: MenuModel[] = [
        {
            label: 'Gestión de Equipos y Jugadores',
            icon: 'pi pi-shield',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                },
                {
                    label: 'Equipos',
                    icon: 'pi pi-fw pi-users',
                    to: '/equipos'
                },
                {
                    label: 'Jugadores',
                    icon: 'pi pi-fw pi-user',
                    to: '/jugadores'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
