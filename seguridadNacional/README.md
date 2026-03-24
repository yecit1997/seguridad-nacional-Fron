# Seguridad Nacional - Sistema de Seguridad de la Policía Nacional de Colombia

Este proyecto es una aplicación React construida con Vite, diseñada para ser escalable y mantenible.

## Estructura del Proyecto

```
src/
├── api/              # Cliente HTTP y llamadas a API
├── components/       # Componentes compartidos/reutilizables
├── config/           # Configuraciones de la aplicación
├── constants/        # Constantes globales
├── contexts/         # Contextos de React para estado global
├── features/         # Funcionalidades específicas (estructura por feature)
├── hooks/            # Hooks personalizados compartidos
├── pages/            # Componentes de página principales
├── services/         # Lógica de negocio y servicios
├── tests/            # Pruebas unitarias e integración
├── types/            # Definiciones de tipos (TypeScript)
└── utils/            # Utilidades y helpers
```

## Arquitectura

- **Feature-based**: Cada funcionalidad se organiza en su propia carpeta dentro de `features/`.
- **Shared Components**: Componentes reutilizables en `components/`.
- **Pages**: Páginas principales en `pages/`.
- **API Layer**: Separación clara entre cliente HTTP (`api/client.js`) y servicios específicos.
- **State Management**: Uso de Context API para autenticación y estado global.

## Tecnologías

- React 19
- Vite
- Tailwind CSS
- Axios para HTTP
- React Router DOM

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la build de producción
