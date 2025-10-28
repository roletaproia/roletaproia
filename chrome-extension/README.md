# 🤖 Roleta Pro I.A. - Extensão Chrome

Extensão do Chrome para conectar o **Roleta Pro I.A.** com a roleta da **1win** e automatizar apostas.

---

## 📋 Funcionalidades

✅ **Captura automática** de números da roleta 1win  
✅ **Comunicação em tempo real** com o sistema Roleta Pro I.A.  
✅ **Execução automática** de apostas baseadas em estratégias  
✅ **Histórico** de números capturados  
✅ **Interface simples** e intuitiva  

---

## 🚀 Instalação

### Passo 1: Baixar a extensão

1. Faça download deste diretório (`chrome-extension`)
2. Ou clone o repositório completo

### Passo 2: Instalar no Chrome

1. Abra o Chrome e digite na barra de endereços:
   ```
   chrome://extensions/
   ```

2. Ative o **Modo do desenvolvedor** (canto superior direito)

3. Clique em **"Carregar sem compactação"**

4. Selecione a pasta `chrome-extension`

5. A extensão será instalada! 🎉

---

## 📖 Como Usar

### 1️⃣ Abrir as páginas necessárias

Você precisa ter **2 abas abertas**:

1. **Roleta Pro I.A.** - https://roletaproia.onrender.com/betting-robot
2. **1win Roleta** - https://1whfxh.life/casino/play/v_evolution:RoletaAoVivo

💡 **Dica:** Clique no ícone da extensão e use os botões "🌐 Abrir Roleta Pro I.A." e "🎰 Abrir 1win" para abrir automaticamente!

### 2️⃣ Configurar estratégia

1. Na página do **Roleta Pro I.A.**, selecione:
   - ✅ Estratégia (Fibonacci, Martingale, etc.)
   - ✅ Valor da aposta inicial
   - ✅ Stop Loss e Stop Win

### 3️⃣ Iniciar o robô

1. Clique no botão **"▶️ Iniciar Robô"**
2. A extensão começará a monitorar os números da 1win
3. Apostas serão executadas automaticamente!

### 4️⃣ Acompanhar em tempo real

- 📊 Veja os números capturados em tempo real
- 💰 Acompanhe suas apostas e saldo
- 📈 Monitore taxa de vitória

### 5️⃣ Parar o robô

- Clique em **"⏸️ Parar Robô"** quando quiser parar

---

## 🎛️ Popup da Extensão

Clique no ícone da extensão para ver:

- ✅ Status do monitoramento
- ✅ Último número capturado
- ✅ Status das abas (1win e Roleta Pro)
- ✅ Histórico dos últimos 10 números
- ✅ Botões de controle rápido

---

## 🔧 Solução de Problemas

### ❌ "Extensão não instalada"

**Solução:** Verifique se a extensão está ativada em `chrome://extensions/`

### ❌ "Aba da 1win não encontrada"

**Solução:** Abra a página da roleta 1win: https://1whfxh.life/casino/play/v_evolution:RoletaAoVivo

### ❌ "Números não estão sendo capturados"

**Solução:**
1. Verifique se a roleta está rodando
2. Abra o console (F12) e veja se há erros
3. Recarregue a página da 1win

### ❌ "Apostas não estão sendo executadas"

**Solução:**
1. Verifique se você tem saldo suficiente
2. Confirme que uma estratégia está selecionada
3. Verifique se o robô está iniciado

---

## 🔒 Segurança e Privacidade

✅ **Código aberto** - Todo o código está disponível para auditoria  
✅ **Sem coleta de dados** - Nenhuma informação é enviada para servidores externos  
✅ **Apenas comunicação local** - Extensão comunica apenas entre suas próprias abas  
✅ **Sem acesso a senhas** - Extensão não acessa credenciais ou dados sensíveis  

---

## ⚠️ Avisos Importantes

🚨 **Use com responsabilidade**
- Defina sempre Stop Loss e Stop Win
- Não aposte mais do que pode perder
- Monitore constantemente o robô

🚨 **Limitações**
- A extensão não garante lucros
- Resultados passados não garantem resultados futuros
- Use apenas com dinheiro que pode perder

🚨 **Termos de Uso**
- Ao usar esta extensão, você concorda que é responsável por suas apostas
- O desenvolvedor não se responsabiliza por perdas financeiras
- Use apenas se for maior de 18 anos

---

## 🛠️ Desenvolvimento

### Estrutura de Arquivos

```
chrome-extension/
├── manifest.json          # Configuração da extensão
├── background.js          # Service worker (gerencia comunicação)
├── content-1win.js        # Script injetado na 1win (captura números)
├── content-roletaproia.js # Script injetado no Roleta Pro (comunica)
├── popup.html             # Interface do popup
├── popup.js               # Lógica do popup
├── icons/                 # Ícones da extensão
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # Este arquivo
```

### Tecnologias

- **Manifest V3** - Última versão do Chrome Extensions
- **Content Scripts** - Injeção de código nas páginas
- **Service Worker** - Gerenciamento em background
- **Chrome Storage API** - Armazenamento local
- **Chrome Tabs API** - Comunicação entre abas

---

## 📞 Suporte

Precisa de ajuda? Entre em contato:

- 🌐 **Site:** https://roletaproia.onrender.com
- 💬 **Chat:** Acesse o chat no site
- 📧 **Email:** suporte@roletaproia.com

---

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 🎉 Agradecimentos

Desenvolvido com ❤️ pela equipe **Roleta Pro I.A.**

Boa sorte e boas apostas! 🍀🎰

