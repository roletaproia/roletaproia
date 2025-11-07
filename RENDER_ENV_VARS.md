# Variáveis de Ambiente para Render.com

Após configurar o domínio personalizado, atualize as seguintes variáveis de ambiente no Render:

## Frontend (Web Service)

```
VITE_APP_URL=https://roboroleta.com.br
VITE_APP_LOGO=https://roboroleta.com.br/robot-roulette.png
```

## Backend (se separado)

```
FRONTEND_URL=https://roboroleta.com.br
CORS_ORIGIN=https://roboroleta.com.br
```

## Como atualizar no Render:

1. Acesse https://dashboard.render.com
2. Selecione seu serviço "roletaproia"
3. Vá em "Environment" no menu lateral
4. Clique em "Edit" nas variáveis de ambiente
5. Atualize os valores acima
6. Clique em "Save Changes"
7. O Render vai fazer redeploy automático
