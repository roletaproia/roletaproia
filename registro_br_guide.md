# 🚀 Guia Passo a Passo: Configurando seu Domínio no Registro.br para o Render

Parabéns pela compra do domínio `roboroleta.com.br`! Agora vamos fazer a mágica acontecer e conectar seu domínio ao seu projeto no Render.

O processo no **Registro.br** é um pouco diferente dos outros, mas é bem simples. Siga este guia com atenção.

---

## Passo 1: Adicionar o Domínio no Render

Primeiro, precisamos avisar o Render que você quer usar seu novo domínio. É aqui que você vai pegar as informações que precisa para o Registro.br.

**Ação:**
1. Acesse o [Dashboard do Render](https://dashboard.render.com).
2. Selecione o seu serviço (o `roletaproia`).
3. No menu lateral, clique em **"Settings"**.
4. Role para baixo até a seção **"Custom Domains"**.
5. Clique em **"Add Custom Domain"**.
6. Digite `roboroleta.com.br` e clique em **"Save"**.
7. Adicione também a variação com `www`: digite `www.roboroleta.com.br` e clique em **"Save"**.

O Render vai te mostrar os **registros DNS** que você precisa configurar. Anote esses valores! Será algo parecido com isto:

| Domínio | Tipo | Valor (Exemplo) |
| :--- | :--- | :--- |
| `roboroleta.com.br` | A | `216.24.57.1` |
| `www.roboroleta.com.br` | CNAME | `seu-servico.onrender.com` |

**Guarde esses valores. Você vai usá-los no próximo passo.**

---

## Passo 2: Configurar o DNS no Registro.br

Com os valores do Render em mãos, vamos para o site do Registro.br.

**Ação:**
1. Acesse o site [Registro.br](https://registro.br) e faça login na sua conta.
2. Na lista de domínios, clique em `roboroleta.com.br`.
3. Role a página até encontrar a seção **"DNS"**.
4. Clique em **"Editar Zona"** (se essa opção não aparecer, pode ser que você precise clicar em "Configurar Endereçamento" primeiro e escolher a opção de edição avançada).

### Editando a Zona DNS

Você verá uma tela para adicionar e editar registros. Vamos adicionar duas novas entradas.

**1. Configurando o Domínio Principal (`roboroleta.com.br`)**
   - Clique em **"+ NOVO REGISTRO"**.
   - **Deixe o primeiro campo (Host) em branco.** Isso indica que é o domínio principal.
   - No campo **"Tipo"**, selecione **`A`**.
   - No campo **"Dados"** (ou "Valor"), cole o **endereço IP** que o Render te deu (ex: `216.24.57.1`).
   - Clique em **"Adicionar"**.

**2. Configurando o Subdomínio `www` (`www.roboroleta.com.br`)**
   - Clique novamente em **"+ NOVO REGISTRO"**.
   - No primeiro campo (Host), digite **`www`**.
   - No campo **"Tipo"**, selecione **`CNAME`**.
   - No campo **"Dados"** (ou "Valor"), cole o **endereço do serviço** que o Render te deu (ex: `seu-servico.onrender.com`). **Importante:** Adicione um ponto final (`.`) no final do endereço. Ex: `seu-servico.onrender.com.`
   - Clique em **"Adicionar"**.

### Salvando as Alterações

Após adicionar os dois registros, clique no botão **"SALVAR"** no final da página. O Registro.br informará que a publicação pode levar até 2 horas.

---

## Passo 3: Atualizar as Variáveis de Ambiente no Render

Enquanto o DNS propaga, vamos garantir que as variáveis de ambiente no Render estão corretas.

**Ação:**
1. No [Dashboard do Render](https://dashboard.render.com), selecione seu serviço.
2. Vá para **"Environment"** no menu lateral.
3. Na seção **"Environment Variables"**, verifique/atualize as seguintes variáveis:
   - `VITE_APP_URL` para `https://roboroleta.com.br`
   - `VITE_APP_LOGO` para `https://roboroleta.com.br/robot-roulette.png`
4. Clique em **"Save Changes"**. O Render fará um novo deploy automaticamente.

---

## Passo 4: Verificação Final

1. **Aguarde a propagação:** Pode levar de 30 minutos a 2 horas. No painel do Render, o status do seu domínio mudará de "Pending" para "Verified".
2. **Acesse seu novo domínio:** Verifique se `https://roboroleta.com.br` e `https://www.roboroleta.com.br` estão funcionando.
3. **Configure o Google Search Console:** Siga as instruções do guia anterior para adicionar e verificar sua nova propriedade de domínio e reenviar o sitemap.

Pronto! Seu site estará no ar com o novo domínio. Se tiver qualquer dúvida, pode me chamar!
