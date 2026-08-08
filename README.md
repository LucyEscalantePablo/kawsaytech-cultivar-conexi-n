# KawsayTech Cultivar Conexión

Actúa como un Arquitecto de Software Senior, Diseñador UX/UI, Desarrollador Full Stack y Especialista en Productos Digitales para Startups Agrotecnológicas.

Quiero que diseñes una plataforma web completa llamada "KawsayTech", enfocada en apoyar a pequeños y medianos productores agrícolas mediante herramientas digitales e Inteligencia Artificial.

IMPORTANTE:

KawsayTech NO es únicamente un marketplace.

Es una plataforma integral para agricultores que estará compuesta por diferentes módulos independientes, los cuales podrán desarrollarse progresivamente sin modificar la arquitectura principal del sistema.

El sistema debe construirse utilizando una arquitectura modular, escalable, mantenible y preparada para incorporar nuevas funcionalidades en el futuro.

El MVP (Primera Versión) únicamente desarrollará el módulo de Comercialización para los cultivos de Papa y Palta.

Los demás módulos serán incorporados en futuras versiones.

====================================================

OBJETIVO GENERAL

====================================================

Crear una plataforma web moderna donde un agricultor pueda administrar sus cultivos, comercializar sus productos y posteriormente utilizar herramientas inteligentes para mejorar su producción.

La plataforma debe transmitir innovación, confianza, sostenibilidad y tecnología aplicada al sector agrícola.

====================================================

TECNOLOGÍAS

====================================================

Diseñar el proyecto utilizando las siguientes tecnologías:

Frontend

- React

- Next.js

- Tailwind CSS

- shadcn/ui

- Lucide Icons

Backend

- FastAPI (Python)

Base de datos

- PostgreSQL

Almacenamiento de imágenes

- Cloudinary

Autenticación

- JWT

Mapas

- Google Maps API

Despliegue

- Frontend: Vercel

- Backend: Render

- Base de datos: Supabase PostgreSQL

Arquitectura

Frontend

↓

API REST (FastAPI)

↓

PostgreSQL

↓

Módulos IA (Python)

====================================================

TIPOS DE USUARIO

====================================================

Diseñar la plataforma considerando tres tipos de usuarios.

1. Agricultor

Podrá:

• Administrar su perfil

• Publicar productos

• Gestionar ventas

• Ver solicitudes

• Recibir notificaciones

• Consultar estadísticas

• Acceder posteriormente a los módulos de IA

2. Comprador

Podrá:

• Buscar productos

• Filtrar publicaciones

• Contactar agricultores

• Enviar solicitudes de compra

• Consultar historial

3. Administrador

Podrá:

• Gestionar usuarios

• Gestionar productos

• Administrar categorías

• Supervisar publicaciones

• Visualizar estadísticas generales

====================================================

ESTRUCTURA GENERAL

====================================================

Diseñar una navegación lateral moderna con los siguientes módulos.

Inicio

Dashboard

Comercialización

Diagnóstico IA

Fertilizantes

Cuidados del Cultivo

Alertas Climáticas

Estadísticas

Perfil

Configuración

Ayuda

Aunque únicamente se desarrollará el módulo Comercialización, los demás módulos deben aparecer deshabilitados o con la etiqueta "Próximamente", permitiendo demostrar la visión futura del proyecto.

====================================================

MÓDULO 1 (MVP)

COMERCIALIZACIÓN

====================================================

Este será el único módulo completamente funcional.

Debe permitir comercializar inicialmente únicamente:

• Papa

• Palta

Posteriormente se podrán agregar nuevos cultivos sin modificar la arquitectura.

Este módulo debe incluir:

Dashboard Comercial

Mostrar:

Productos publicados

Ventas

Solicitudes

Productos vendidos

Precio promedio

Accesos rápidos

----------------------------------------------------

Publicar Producto

Formulario con:

Producto

Variedad

Cantidad

Unidad

Precio

Calidad

Ubicación

Fecha de cosecha

Descripción

Fotografías

Estado del producto

----------------------------------------------------

Marketplace

Mostrar tarjetas modernas con:

Imagen

Producto

Precio

Cantidad

Ubicación

Productor

Calificación

Botón Ver detalles

Filtros por:

Producto

Precio

Región

Calidad

Cantidad

----------------------------------------------------

Detalle del producto

Mostrar:

Galería

Información del agricultor

Descripción

Precio

Disponibilidad

Ubicación

Botón Contactar

Botón Solicitar compra

----------------------------------------------------

Solicitudes de compra

El comprador podrá indicar:

Cantidad

Precio ofrecido

Mensaje

Fecha requerida

Estado

----------------------------------------------------

Gestión de publicaciones

Editar

Eliminar

Marcar vendido

Pausar publicación

Duplicar publicación

----------------------------------------------------

Historial

Ventas

Solicitudes

Productos vendidos

Ingresos

====================================================

MÓDULOS FUTUROS

====================================================

Estos módulos únicamente deberán mostrarse diseñados visualmente.

No desarrollar lógica todavía.

----------------------------------------------------

Diagnóstico mediante IA

Permitir:

Subir fotografía

Analizar enfermedad

Historial de diagnósticos

Resultados

Recomendaciones

----------------------------------------------------

Fertilizantes

Recomendaciones personalizadas

Cantidad

Frecuencia

Época de aplicación

----------------------------------------------------

Cuidados del cultivo

Calendario

Riego

Poda

Control de plagas

Buenas prácticas

----------------------------------------------------

Alertas climáticas

Pronóstico

Heladas

Lluvias

Granizo

Temperatura

Humedad

====================================================

DISEÑO

====================================================

Utilizar una apariencia moderna inspirada en la agricultura y la tecnología.

Colores principales:

Verde (#2E7D32)

Blanco

Verde claro

Amarillo suave

Gris claro

Tipografía moderna.

Tarjetas con bordes redondeados.

Sombras suaves.

Botones elegantes.

Iconografía limpia.

Diseño responsive.

Material Design 3.

====================================================

EXPERIENCIA DE USUARIO

====================================================

La plataforma debe ser extremadamente sencilla para agricultores con conocimientos básicos de tecnología.

La navegación debe ser intuitiva.

Mostrar siempre botones grandes.

Usar iconos descriptivos.

Reducir la cantidad de texto.

Priorizar imágenes.

Mostrar indicadores visuales.

====================================================

ESTRUCTURA DEL PROYECTO

====================================================

Generar la estructura completa del proyecto utilizando una arquitectura modular.

Ejemplo:

src/

app/

components/

layouts/

services/

hooks/

utils/

types/

modules/

comercializacion/

diagnostico/

fertilizantes/

cuidados/

alertas/

estadisticas/

perfil/

config/

====================================================

RESULTADO ESPERADO

====================================================

Genera:

1. Arquitectura completa del sistema.

2. Diagrama de navegación.

3. Wireframes de todas las pantallas.

4. Diseño UX/UI moderno.

5. Organización de carpetas.

6. Modelo de Base de Datos.

7. APIs necesarias.

8. Flujo de usuarios.

9. Componentes reutilizables.

10. Buenas prácticas de desarrollo.

11. Propuesta visual similar a plataformas modernas como Notion, Stripe, Vercel o Airbnb, adaptada al sector agrícola.

El resultado debe ser profesional, escalable y con apariencia de un producto tecnológico listo para evolucionar hacia una startup de alto impacto.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a803e730-7f83-43aa-9a8c-3484b6a73da3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
