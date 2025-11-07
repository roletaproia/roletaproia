# 🎯 PASSO A PASSO: Configurar ROBOROLETA.COM.BR no Registro.br

## ✅ O Que Já Foi Feito

- ✅ Domínio adicionado no Render: `roboroleta.com.br`
- ✅ Subdomínio WWW adicionado: `www.roboroleta.com.br`
- ✅ Código do projeto atualizado para o novo domínio

---

## 🔴 AGORA É SUA VEZ! Siga Estes Passos:

### PASSO 1: Acessar o Registro.br

1. Acesse: https://registro.br
2. Faça login com sua conta
3. Clique no domínio **roboroleta.com.br**

---

### PASSO 2: Entrar no Modo Avançado de DNS

1. Na página do domínio, procure a seção **"DNS"**
2. Clique no botão **"Modo avançado"** (geralmente está no final da seção)
3. Clique em **"Editar Zona"**

---

### PASSO 3: Adicionar Registro CNAME para o Domínio Principal

⚠️ **IMPORTANTE:** O Registro.br não suporta ANAME/ALIAS diretamente, então vamos usar CNAME.

**Adicione o primeiro registro:**

| Campo | Valor |
|-------|-------|
| **Nome/Host** | Deixe em branco (ou coloque `@`) |
| **Tipo** | `CNAME` |
| **Dados/Valor** | `roletaproia.onrender.com.` ← **NÃO ESQUEÇA O PONTO NO FINAL!** |
| **TTL** | `3600` (ou deixe o padrão) |

Clique em **"Adicionar"** ou **"+"**

---

### PASSO 4: Adicionar Registro CNAME para WWW

**Adicione o segundo registro:**

| Campo | Valor |
|-------|-------|
| **Nome/Host** | `www` |
| **Tipo** | `CNAME` |
| **Dados/Valor** | `roletaproia.onrender.com.` ← **NÃO ESQUEÇA O PONTO NO FINAL!** |
| **TTL** | `3600` (ou deixe o padrão) |

Clique em **"Adicionar"** ou **"+"**

---

### PASSO 5: Salvar as Alterações

1. Revise os dois registros que você acabou de adicionar
2. Clique em **"SALVAR"** ou **"Publicar Zona"**
3. Confirme a operação se solicitado

---

## ⏱️ Aguarde a Propagação

Após salvar, o DNS pode levar de **30 minutos a 2 horas** para propagar completamente.

**Sinais de que está funcionando:**
- Você consegue acessar `https://roboroleta.com.br` e ver seu site
- Você consegue acessar `https://www.roboroleta.com.br` e ver seu site
- No Render, o status dos domínios muda de "DNS update needed" para "Verified"

---

## 🔍 Como Verificar se Funcionou?

### Opção 1: Testar no Navegador (Mais Simples)

Depois de 30 minutos, tente acessar:
- https://roboroleta.com.br
- https://www.roboroleta.com.br

Se carregar seu site, está funcionando! 🎉

### Opção 2: Verificar DNS (Mais Técnico)

Abra o terminal/prompt de comando e digite:

```bash
nslookup roboroleta.com.br
```

Se retornar o endereço do Render, está configurado corretamente!

---

## ❓ Problemas Comuns

### Problema 1: "Este domínio já existe em outro site"

**Solução:** Você tentou adicionar `www.example.com` novamente. Ignore esse erro, o domínio principal já foi adicionado com sucesso.

### Problema 2: Registro.br não aceita CNAME no domínio raiz

**Solução Alternativa:**

Se o Registro.br não permitir CNAME no domínio raiz (campo vazio), use um registro A:

| Campo | Valor |
|-------|-------|
| **Nome/Host** | Deixe em branco (ou `@`) |
| **Tipo** | `A` |
| **Dados/Valor** | `216.24.571` |
| **TTL** | `3600` |

⚠️ **Nota:** O IP pode mudar no futuro. CNAME é mais confiável, mas se não funcionar, use o registro A.

### Problema 3: Demora mais de 2 horas

**Solução:** 
1. Verifique se você salvou as alterações no Registro.br
2. Limpe o cache do DNS do seu computador:
   - Windows: `ipconfig /flushdns`
   - Mac/Linux: `sudo dscacheutil -flushcache`
3. Tente acessar em uma aba anônima do navegador

---

## 🎉 Próximos Passos (Depois que Funcionar)

1. **Verificar no Google Search Console**
   - Adicione o novo domínio `roboroleta.com.br`
   - Envie o sitemap: `https://roboroleta.com.br/sitemap.xml`

2. **Testar HTTPS**
   - O Render configura SSL automaticamente (Let's Encrypt)
   - Pode levar até 24 horas para o certificado ser emitido

3. **Compartilhar nas Redes Sociais**
   - Teste como o link aparece no Facebook/WhatsApp
   - As meta tags Open Graph já estão configuradas!

---

## 📞 Precisa de Ajuda?

Se tiver qualquer dúvida ou problema, me avise! Estou aqui para ajudar. 😊

**Lembre-se:** Não tenha medo de errar! Você pode sempre voltar e editar os registros DNS no Registro.br.
