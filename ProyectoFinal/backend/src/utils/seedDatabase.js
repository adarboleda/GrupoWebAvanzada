import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';
import Bodega from '../models/Bodega.js';
import Producto from '../models/Producto.js';
import Vehiculo from '../models/Vehiculo.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Script para poblar la base de datos con datos de prueba
 * Ejecutar: node src/utils/seedDatabase.js
 */
const seedDatabase = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Limpiar colecciones existentes (CUIDADO: Esto borrará todos los datos)
    console.log('🗑️  Limpiando base de datos...');
    await Usuario.deleteMany({});
    await Bodega.deleteMany({});
    await Producto.deleteMany({});
    await Vehiculo.deleteMany({});
    console.log('✅ Base de datos limpia\n');

    // ========== CREAR USUARIOS ==========
    console.log('👥 Creando usuarios...');

    const usuarios = await Usuario.insertMany([
      {
        nombre: 'Administrador Principal',
        email: 'admin@logistica.com',
        password: 'admin123',
        rol: 'admin',
        telefono: '3001234567',
      },
      {
        nombre: 'Carlos Coordinador',
        email: 'coordinador@logistica.com',
        password: 'coord123',
        rol: 'coordinador',
        telefono: '3009876543',
      },
      {
        nombre: 'Juan Conductor',
        email: 'conductor1@logistica.com',
        password: 'cond123',
        rol: 'conductor',
        telefono: '3005551111',
      },
      {
        nombre: 'Pedro Conductor',
        email: 'conductor2@logistica.com',
        password: 'cond123',
        rol: 'conductor',
        telefono: '3005552222',
      },
      {
        nombre: 'María Operadora',
        email: 'operador@logistica.com',
        password: 'oper123',
        rol: 'operador',
        telefono: '3005553333',
      },
    ]);

    console.log(`✅ ${usuarios.length} usuarios creados\n`);

    // ========== CREAR BODEGAS ==========
    console.log('🏢 Creando bodegas...');

    const bodegas = await Bodega.insertMany([
      {
        nombre: 'Bodega Central Bogotá',
        direccion: {
          calle: 'Calle 100 #15-20',
          ciudad: 'Bogotá',
          estado: 'Cundinamarca',
          codigoPostal: '11001',
          coordenadas: {
            latitud: 4.710989,
            longitud: -74.072092,
          },
        },
        estado: 'activa',
        capacidadMaxima: 10000,
        descripcion: 'Bodega principal de distribución en Bogotá',
      },
      {
        nombre: 'Bodega Norte Medellín',
        direccion: {
          calle: 'Carrera 65 #45-30',
          ciudad: 'Medellín',
          estado: 'Antioquia',
          codigoPostal: '05001',
          coordenadas: {
            latitud: 6.244203,
            longitud: -75.581212,
          },
        },
        estado: 'activa',
        capacidadMaxima: 8000,
        descripcion: 'Bodega de distribución regional zona norte',
      },
      {
        nombre: 'Bodega Costa Barranquilla',
        direccion: {
          calle: 'Calle 80 #52-120',
          ciudad: 'Barranquilla',
          estado: 'Atlántico',
          codigoPostal: '08001',
          coordenadas: {
            latitud: 10.963889,
            longitud: -74.796387,
          },
        },
        estado: 'activa',
        capacidadMaxima: 6000,
        descripcion: 'Bodega para región costa atlántica',
      },
    ]);

    console.log(`✅ ${bodegas.length} bodegas creadas\n`);

    // ========== CREAR PRODUCTOS ==========
    console.log('📦 Creando productos...');

    const productos = await Producto.insertMany([
      {
        nombre: 'Laptop Dell Inspiron 15',
        codigo: 'ELEC-001',
        descripcion: 'Laptop para uso empresarial',
        categoria: 'Electrónica',
        stock_actual: 50,
        stock_minimo: 10,
        unidadMedida: 'unidad',
        precio: 2500000,
        bodega: bodegas[0]._id,
      },
      {
        nombre: 'Mouse Inalámbrico Logitech',
        codigo: 'ELEC-002',
        descripcion: 'Mouse ergonómico inalámbrico',
        categoria: 'Electrónica',
        stock_actual: 100,
        stock_minimo: 20,
        unidadMedida: 'unidad',
        precio: 80000,
        bodega: bodegas[0]._id,
      },
      {
        nombre: 'Arroz Diana x 50kg',
        codigo: 'ALIM-001',
        descripcion: 'Bulto de arroz Diana',
        categoria: 'Alimentos',
        stock_actual: 200,
        stock_minimo: 50,
        unidadMedida: 'kg',
        precio: 120000,
        bodega: bodegas[1]._id,
      },
      {
        nombre: 'Aceite de Cocina x 20L',
        codigo: 'ALIM-002',
        descripcion: 'Aceite vegetal para cocina',
        categoria: 'Alimentos',
        stock_actual: 150,
        stock_minimo: 30,
        unidadMedida: 'litro',
        precio: 85000,
        bodega: bodegas[1]._id,
      },
      {
        nombre: 'Camisetas Polo Talla M',
        codigo: 'TEXT-001',
        descripcion: 'Camisetas tipo polo corporativas',
        categoria: 'Textil',
        stock_actual: 300,
        stock_minimo: 50,
        unidadMedida: 'unidad',
        precio: 45000,
        bodega: bodegas[2]._id,
      },
      {
        nombre: 'Acetaminofén 500mg Caja x100',
        codigo: 'FARM-001',
        descripcion: 'Medicamento analgésico',
        categoria: 'Farmacéutico',
        stock_actual: 500,
        stock_minimo: 100,
        unidadMedida: 'caja',
        precio: 25000,
        bodega: bodegas[0]._id,
      },
    ]);

    console.log(`✅ ${productos.length} productos creados\n`);

    // ========== CREAR VEHÍCULOS ==========
    console.log('🚚 Creando vehículos...');

    const conductores = usuarios.filter((u) => u.rol === 'conductor');

    const vehiculos = await Vehiculo.insertMany([
      {
        placa: 'ABC123',
        marca: 'Chevrolet',
        modelo: 'NPR',
        año: 2022,
        tipo: 'camion',
        capacidad_carga: 5000,
        unidad_capacidad: 'kg',
        estado: 'disponible',
        conductor_asignado: conductores[0]._id,
        kilometraje: 15000,
        documentos: {
          seguro: {
            numeroPoliza: 'SEG-2024-001',
            vencimiento: new Date('2026-12-31'),
            aseguradora: 'Seguros Bolívar',
          },
          tecnicomecanica: {
            numero: 'TM-2024-001',
            vencimiento: new Date('2026-06-30'),
          },
        },
      },
      {
        placa: 'XYZ789',
        marca: 'Mercedes-Benz',
        modelo: 'Sprinter',
        año: 2023,
        tipo: 'van',
        capacidad_carga: 2000,
        unidad_capacidad: 'kg',
        estado: 'disponible',
        conductor_asignado: conductores[1]._id,
        kilometraje: 8000,
        documentos: {
          seguro: {
            numeroPoliza: 'SEG-2024-002',
            vencimiento: new Date('2026-12-31'),
            aseguradora: 'Seguros del Estado',
          },
          tecnicomecanica: {
            numero: 'TM-2024-002',
            vencimiento: new Date('2026-08-15'),
          },
        },
      },
      {
        placa: 'DEF456',
        marca: 'Hino',
        modelo: 'Serie 500',
        año: 2021,
        tipo: 'camion',
        capacidad_carga: 8000,
        unidad_capacidad: 'kg',
        estado: 'mantenimiento',
        kilometraje: 45000,
        documentos: {
          seguro: {
            numeroPoliza: 'SEG-2024-003',
            vencimiento: new Date('2026-12-31'),
            aseguradora: 'Seguros Bolívar',
          },
          tecnicomecanica: {
            numero: 'TM-2024-003',
            vencimiento: new Date('2026-05-20'),
          },
        },
      },
    ]);

    console.log(`✅ ${vehiculos.length} vehículos creados\n`);

    // ========== RESUMEN ==========
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMEN DE DATOS CREADOS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Usuarios: ${usuarios.length}`);
    console.log(`🏢 Bodegas: ${bodegas.length}`);
    console.log(`📦 Productos: ${productos.length}`);
    console.log(`🚚 Vehículos: ${vehiculos.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('👤 CREDENCIALES DE ACCESO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:        admin@logistica.com / admin123');
    console.log('Coordinador:  coordinador@logistica.com / coord123');
    console.log('Conductor 1:  conductor1@logistica.com / cond123');
    console.log('Conductor 2:  conductor2@logistica.com / cond123');
    console.log('Operador:     operador@logistica.com / oper123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
    console.log('✅ Proceso completado exitosamente\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
};

// Ejecutar
seedDatabase();
