# Auto Password Login

App Android que genera automáticamente una contraseña al registrar usuarios y la envía por correo electrónico.

## Estructura del proyecto

```
PasswordLessLogin/
├── backend/          # Servidor Node.js + Express
│   ├── server.js     # API REST (registro, login, envío de email)
│   ├── package.json
│   └── .env.example  # Configuración de Gmail
├── android/          # App Android (Java nativo)
│   ├── app/
│   │   └── src/main/java/com/passwordlesslogin/
│   │       ├── api/       # Retrofit + ApiService
│   │       ├── model/     # Request/Response models
│   │       └── ui/        # Actividades (Login, Register, Home)
│   └── build.gradle
└── README.md
```

## Requisitos

- Node.js 16+
- Android Studio (para compilar el APK)
- Cuenta de Gmail con "Contraseñas de aplicación" activada

## Configuración del Backend

1. Ir a la carpeta `backend/` y copiar `.env.example` a `.env`
2. Editar `.env` con tus datos de Gmail:
   - `GMAIL_USER`: tu correo de Gmail
   - `GMAIL_APP_PASSWORD`: contraseña de aplicación (generar en https://myaccount.google.com/apppasswords)
3. Instalar dependencias: `npm install`
4. Iniciar servidor: `npm start` (corre en http://localhost:3000)

## Compilar el APK

1. Abrir la carpeta `android/` en Android Studio
2. Esperar a que Gradle sincronice
3. Conectar dispositivo o iniciar emulador
4. Build → Build Bundle(s) / APK(s) → Build APK(s)

O desde terminal:
```bash
cd android
./gradlew assembleDebug
```

El APK se generará en `android/app/build/outputs/apk/debug/`

## Notas

- La app usa `10.0.2.2:3000` como URL del backend (es la IP del host desde el emulador de Android). Para dispositivo físico, cambiar la IP en `RetrofitClient.java`.
- El backend guarda los usuarios en `users.json` (no requiere base de datos externa).
- La contraseña se genera automáticamente con 12 caracteres combinando mayúsculas, minúsculas, números y símbolos.
