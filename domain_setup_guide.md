# 🚀 Guia Completo: Configurando seu Domínio RoletaProIA.com no Render

Parabéns pela decisão de usar um domínio próprio! Isso vai trazer mais profissionalismo, credibilidade e um grande impulso no SEO do seu projeto. 

Preparei um guia passo a passo para te ajudar a configurar o domínio **RoletaProIA.com** no Render. Siga as instruções com atenção.

---

## Passo 1: Registro do Domínio

O primeiro passo é registrar o domínio `RoletaProIA.com`. Se você ainda não fez isso, aqui estão algumas opções populares e confiáveis:

- **[Namecheap](https://www.namecheap.com/):** Geralmente tem os melhores preços e oferece proteção de privacidade (WhoisGuard) gratuitamente.
- **[GoDaddy](https://www.godaddy.com/):** Muito popular e fácil de usar, mas pode ter preços um pouco mais altos nas renovações.
- **[Registro.br](https://registro.br/):** Focado em domínios `.br`, mas também oferece outras extensões.

**Ação:**
1. Escolha um registrador de domínio.
2. Busque por `RoletaProIA.com` e siga o processo de compra.
3. Durante a compra, você criará uma conta onde poderá gerenciar as configurações de DNS do seu domínio.

---

## Passo 2: Adicionar o Domínio no Render

Agora, vamos informar ao Render que você quer usar seu novo domínio.

**Ação:**
1. Acesse o [Dashboard do Render](https://dashboard.render.com).
2. Selecione o seu serviço (o `roletaproia`).
3. No menu lateral, clique em **"Settings"**.
4. Role para baixo até a seção **"Custom Domains"**.
5. Clique em **"Add Custom Domain"**.
6. Digite `roboroleta.com.br` e clique em **"Save"**.
7. Adicione também a variação com `www`: digite `www.roboroleta.com.br` e clique em **"Save"**.

Após adicionar os domínios, o Render vai te mostrar os **registros DNS** que você precisa configurar no seu registrador. Serão dois tipos de registro:

- **Registro A (Apex/Naked Domain):** Para `roboroleta.com.br`
- **Registro CNAME (Subdomínio):** Para `www.roboroleta.com.br`

O Render vai te fornecer um valor para cada um, algo como:

| Domínio | Tipo | Valor |
| :--- | :--- | :--- |
| `roboroleta.com.br` | A | `216.24.57.1` (Exemplo) |
| `www.roboroleta.com.br` | CNAME | `service-name.onrender.com` (Exemplo) |

**Guarde esses valores. Você vai usá-los no próximo passo.**

---

## Passo 3: Configurar os Registros DNS

Com os valores do Render em mãos, volte ao site onde você registrou o domínio (Namecheap, GoDaddy, etc.) e procure pela seção de gerenciamento de DNS.

**Ação:**
1. Faça login na sua conta do registrador de domínio.
2. Encontre a seção "DNS Management", "Advanced DNS" ou similar para o domínio `RoletaProIA.com`.
3. **Adicione/Edite o Registro A:**
   - **Host/Name:** `@` (ou deixe em branco, dependendo do provedor)
   - **Type:** `A`
   - **Value/Points to:** O endereço IP que o Render te deu (ex: `216.24.57.1`)
   - **TTL:** Deixe o padrão (geralmente 1 hora ou automático).
4. **Adicione/Edite o Registro CNAME:**
   - **Host/Name:** `www`
   - **Type:** `CNAME`
   - **Value/Points to:** O endereço que o Render te deu (ex: `service-name.onrender.com`)
   - **TTL:** Deixe o padrão.

**Atenção:** A propagação do DNS pode levar de alguns minutos a algumas horas. O Render mostrará o status como "Pending" até que a configuração seja verificada.

---

## Passo 4: Atualizar as Variáveis de Ambiente no Render

Enquanto o DNS propaga, vamos atualizar as URLs no ambiente do seu projeto no Render. Eu já fiz as alterações no código, mas você precisa configurar no painel do Render.

**Ação:**
1. No [Dashboard do Render](https://dashboard.render.com), selecione seu serviço.
2. Vá para **"Environment"** no menu lateral.
3. Na seção **"Environment Variables"**, atualize as seguintes variáveis:
   - `VITE_APP_URL` para `https://roboroleta.com.br`
   - `VITE_APP_LOGO` para `https://roboroleta.com.br/robot-roulette.png`
4. Se você tiver um backend separado, adicione/atualize também:
   - `FRONTEND_URL` para `https://roboroleta.com.br`
   - `CORS_ORIGIN` para `https://roboroleta.com.br`
5. Clique em **"Save Changes"**. O Render fará um novo deploy automaticamente com as novas variáveis.

---

## Passo 5: Verificação Final e SEO

Depois que o Render confirmar que o domínio está verificado e o deploy terminar, é hora de cuidar do SEO.

**Ação:**

1. **Acesse seu novo domínio:** Verifique se `https://roboroleta.com.br` e `https://www.roboroleta.com.br` estão funcionando corretamente.

2. **Google Search Console:**
   - Acesse o [Google Search Console](https://search.google.com/search-console).
   - Clique em **"Adicionar propriedade"**.
   - Escolha a opção **"Domínio"** (a da esquerda) e digite `roboroleta.com.br`.
   - O Google vai te dar um registro TXT para adicionar no seu DNS (similar ao Passo 3). Adicione-o para provar que você é o dono do domínio.
   - Após a verificação, **reenvie o sitemap** na nova propriedade:
     - Vá para a seção "Sitemaps".
     - Adicione a URL: `https://roboroleta.com.br/sitemap.xml`
     - Clique em **"Enviar"**.

3. **Solicite a indexação** das suas páginas principais novamente através da ferramenta "Inspeção de URL" com o novo domínio.

---

Pronto! Seu site agora está rodando em um domínio profissional, o que é um passo crucial para o sucesso do seu projeto. Se tiver qualquer dúvida durante o processo, pode me perguntar!
