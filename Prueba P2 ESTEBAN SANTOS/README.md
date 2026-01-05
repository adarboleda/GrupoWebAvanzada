# 📊 COVID-19 Tracker USA

Aplicación web desarrollada en React que consume la API de **The COVID Tracking Project** para mostrar datos históricos sobre el COVID-19 en Estados Unidos.

## 🚀 Características

- ✅ Consumo de API REST en la nube
- ✅ Visualización de 5 parámetros clave de COVID-19
- ✅ Uso de React Hooks (useState, useEffect)
- ✅ Componentes modulares y reutilizables
- ✅ Diseño responsivo con CSS personalizado
- ✅ Manejo de estados de carga y errores

## 📊 API Utilizada

**API:** The COVID Tracking Project  
**Endpoint:** `https://api.covidtracking.com/v1/us/daily.json`  
**Método:** GET

## 🔢 Parámetros Mostrados

1. **📅 Fecha** - Fecha del registro
2. **🦠 Casos Positivos** - Total de casos confirmados
3. **💀 Muertes** - Total de fallecimientos
4. **🏥 Hospitalizaciones** - Total de hospitalizados
5. **✅ Recuperados** - Total de personas recuperadas

## 🛠️ Tecnologías

- React 19.2.0
- JavaScript ES6+
- CSS3 (Diseño personalizado)
- Fetch API

## 📁 Estructura del Proyecto

```
src/
├── App.js                      # Componente principal
├── components/
│   └── productos/
│       ├── ProductList.js      # Lista de tarjetas
│       ├── ProductCard.js      # Tarjeta individual
│       └── Loading.js          # Componente de carga
├── hook/
│   └── useFetch.js            # Custom hook para fetch
├── services/
│   └── productService.js      # Servicio de API
└── style/
    └── app.css                # Estilos principales
```

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# La aplicación se abrirá en http://localhost:3000
```

## 📖 Documentación

Para más detalles técnicos, consulta el archivo [DOCUMENTACION.md](./DOCUMENTACION.md)

## 👨‍💻 Autor

**Esteban Santos**  
Programación Web Avanzada  
1 de diciembre de 2025

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos.
