# Frontend - Wow Chatbot

Este es el frontend para la aplicación Wow Chatbot, una interfaz interactiva que permite a los usuarios conversar con personajes de World of Warcraft a través de un chatbot, con un diseño temático y manejo de historial por facción.

## 🚀 Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **Vite**: Herramienta de construcción y desarrollo
- **Styled Components**: Para estilizado de componentes
- **React Router**: Para manejo de rutas
- **Google Fonts**: Para tipografía personalizada (Cinzel)
- **Axios**: Cliente HTTP para hacer peticiones al backend
- **UUID**: Para generar identificadores únicos
- **Vercel**: Plataforma de despliegue

## 📁 Estructura del Proyecto

```
frontend/
├── public/          # Archivos estáticos (fondos, iconos, audio)
│   ├── audio/      # Archivos de música
│   └── images/     # Imágenes y recursos
│   └── ...otros assets (zGg9N1o.jpg, wow-bg.jpg, alliance-fondo.jpg, horda-fondo.jpg)
├── src/
│   ├── assets/     # Recursos estáticos (iconos de facción)
│   ├── components/ # Componentes React (Login, Register, FactionSelection, Chat, LoadingScreen)
│   ├── hooks/      # Hooks personalizados (useAudio)
│   ├── App.jsx     # Componente principal y enrutamiento
│   └── main.jsx    # Punto de entrada
├── package.json    # Dependencias y scripts
├── package-lock.json # Bloqueo de dependencias
├── vite.config.js  # Configuración de Vite
```

## 🔧 Configuración

1. Clona el repositorio.
2. Instala las dependencias:
```bash
npm install
```
3. Inicia el servidor de desarrollo:
```bash
npm run dev
```
El frontend se iniciará por defecto en `http://localhost:5173`.

4. Para construir para producción:
```bash
npm run build
```

## 🎨 Características Principales

- **Autenticación Temática**: Pantallas de Login y Registro estilizadas con el tema de World of Warcraft y fondo personalizado.
- **Pantalla de Selección de Facción**: Interfaz interactiva para elegir entre Alianza y Horda, con efectos visuales, animaciones y música temática.
- **Chat Interactivo por Facción**: Interfaz de chat estilo World of Warcraft con historial de conversación separado para cada facción. Permite conversar con un NPC temático según la facción elegida.
- **Sistema de Audio**: Música de fondo durante la selección de facción y música específica al entrar en el chat de Alianza o Horda.
- **Diseño Responsivo**: Interfaz adaptada para diferentes tamaños de pantalla.

## 🌐 Flujo de la Aplicación

1.  El usuario accede a la aplicación.
2.  Es redirigido a la pantalla de **Login** o **Registro** si no está autenticado.
3.  Después de iniciar sesión o registrarse, el usuario es dirigido a la pantalla de **Selección de Facción** si aún no ha elegido una.
4.  Al seleccionar una facción, accede al **Chat** correspondiente, donde puede conversar con un NPC temático y ver/continuar el historial de esa facción.
5.  Puede cambiar de facción desde la pantalla de chat, regresando a la selección de facción.

## 🎨 Diseño

- Interfaz inspirada en World of Warcraft.
- Paleta de colores temática (predominantemente dorado).
- Fuentes personalizadas (Cinzel).
- Efectos visuales y animaciones (fade-in, glow, float).
- Fondos temáticos dinámicos para las pantallas de autenticación y chat.

# wow-fronted
