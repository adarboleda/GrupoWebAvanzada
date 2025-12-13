'use client';
import React, { useState, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../../../layout/context/layoutcontext';

/**
 * Componente Contact
 * Página de contacto que muestra información de contacto, mapa y formulario para enviar mensajes
 */
function Contact() {
    // ===== ESTADOS DEL FORMULARIO =====
    // Estado para el nombre del usuario
    const [name, setName] = useState('');

    // Estado para el email del usuario
    const [email, setEmail] = useState('');

    // Estado para el mensaje del usuario
    const [message, setMessage] = useState('');

    // ===== DATOS ESTÁTICOS DE CONTACTO =====
    // Array de información de contacto (teléfono, dirección, fax)
    // Se utiliza para mostrar tarjetas de contacto en la página
    const [content] = useState([
        { icon: 'pi pi-fw pi-phone', title: 'Phone', info: '1 (833) 597-7538' },
        {
            icon: 'pi pi-fw pi-map-marker',
            title: 'Our Head Office',
            info: 'Churchill-laan 16 II, 1052 CD, Amsterdam'
        },
        { icon: 'pi pi-fw pi-print', title: 'Fax', info: '3 (833) 297-1548' }
    ]);

    // ===== CONTEXTO DE LAYOUT =====
    // Obtener la configuración del layout (para determinar tema claro/oscuro)
    const { layoutConfig } = useContext(LayoutContext);

    const handleSend = () => {
        if (!name || !email || !message) {
            // Aquí podrías mostrar un mensaje de error o realizar alguna acción
            alert('Los cmampos del formulario son obligatorios.');
            return;
        }
        const newMessage = {
            name,
            email,
            message,
            date: new Date().toLocaleString()
        };

        const saved = JSON.parse(localStorage.getItem('messages') || '[]');
        saved.push(newMessage);
        localStorage.setItem('messages', JSON.stringify(saved));

        // Limpiar el formulario después de enviar
        setName('');
        setEmail('');
        setMessage('');
        alert('Mensaje enviado correctamente.');
    };

    return (
        <div className="grid card grid-nogutter" style={{ columnGap: '2rem', rowGap: '2rem' }}>
            {/* Título de la página */}
            <div className="col-12">
                <p className="text-900 font-bold">Contact Us</p>
            </div>

            {/* Mapa de fondo responsivo */}
            <div
                className="col-12 mt-3 h-20rem border-1 surface-border p-0 w-full bg-cover border-round"
                style={{
                    // Cambiar mapa según el esquema de color (claro/oscuro)
                    backgroundImage: `url('/demo/images/contact/map-${layoutConfig.colorScheme === 'light' ? 'light' : 'dark'}.svg')`
                }}
            ></div>

            {/* Sección de información de contacto en tarjetas */}
            <div className="col-12 mt-5">
                <div className="grid grid-nogutter px-2 flex-column md:flex-row" style={{ columnGap: '2rem', rowGap: '2rem' }}>
                    {/* Mapear y renderizar cada item de contacto */}
                    {content.map((item, i) => {
                        return (
                            <div key={i} className="col flex flex-column justify-content-center text-center align-items-center border-1 surface-border py-5 px-4 border-round">
                                {/* Ícono de la tarjeta */}
                                <i className={classNames('pi pi-fw text-2xl text-primary', item.icon)}></i>

                                {/* Título de la tarjeta (ej: Phone, Address) */}
                                <span className="text-900 font-bold mt-4 mb-1">{item.title}</span>

                                {/* Información de contacto */}
                                <span className="text-500">{item.info}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Sección de formulario de contacto */}
            <div className="col-12 mt-5">
                <p className="text-900 font-bold">Send Us Email</p>
                <div className="grid flex-column md:flex-row formgrid grid-nogutter mt-6" style={{ rowGap: '2rem', columnGap: '2rem' }}>
                    {/* Campo de nombre */}
                    <div className="field col">
                        <label htmlFor="name" className="block text-primary font-bold">
                            Name
                        </label>
                        <span className="p-input-icon-left w-full" style={{ height: '3.5rem' }}>
                            {/* Ícono de usuario */}
                            <i className="pi pi-user" style={{ left: '1.5rem' }}></i>

                            {/* Input de nombre con validación de estado */}
                            <InputText
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                className="w-full px-7 text-900 font-semibold"
                                style={{ height: '3.5rem' }}
                            />
                        </span>
                    </div>

                    {/* Campo de email */}
                    <div className="field col">
                        <label htmlFor="email" className="block text-primary font-bold">
                            Email Address
                        </label>
                        <span className="p-input-icon-left w-full" style={{ height: '3.5rem' }}>
                            {/* Ícono de sobre/correo */}
                            <i className="pi pi-envelope" style={{ left: '1.5rem' }}></i>

                            {/* Input de email con validación de estado */}
                            <InputText
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full px-7 text-900 font-semibold"
                                style={{ height: '3.5rem' }}
                            />
                        </span>
                    </div>

                    {/* Campo de mensaje */}
                    <div className="field col-12 flex flex-column">
                        <label htmlFor="message" className="block text-primary font-bold">
                            Message
                        </label>

                        {/* Textarea para el mensaje con 5 filas */}
                        <InputTextarea id="message" rows={5} cols={30} value={message} onChange={(event) => setMessage(event.target.value)} />

                        {/* Botón para enviar el formulario */}
                        <Button className="ml-auto mt-3 border-round" label="Send Message" onClick={handleSend}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
