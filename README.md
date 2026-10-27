# Ampara — Plataforma SaaS B2B White Label de Proteção às Colaboradoras

> Uma rede de apoio discreta que ajuda a mulher a sair de uma situação de risco sem expô-la, sem exigir denúncia formal imediata e sem acionar a polícia desnecessariamente.

---

## 🏢 Arquitetura White Label de Camuflagem Corporativa

O **Ampara** adota uma estratégia de proteção por design inédita: o aplicativo é **100% White Label**.
Cada empresa contratante pode customizar:
- **Nome de Fachada:** (Ex: *"TechCorp Conecta"*, *"Portal Sou Vale"*, *"Gente & Cultura VivaBem"*).
- **Logotipo e Identidade Visual:** Cores oficiais da marca da empresa e ícones institucionais.
- **Fachada Corporativa Realista:** Quando aberto por terceiros ou pelo agressor, o app exibe uma interface completa de **Holerite, Saldo de Vale Alimentação/Refeição, Espelho de Ponto Digital e Comunicados Internos**.
- **PIN Falso (`0000`):** Se a colaboradora for coagida a abrir o app, digitar o PIN `0000` abre um extrato fictício de FGTS e Banco de Horas corporativo.
- **PIN Real (`7788`) / Toque Triplo no Logo:** Revela a central de acolhimento e proteção **Ampara**.

Essa camuflagem elimina qualquer suspeita no ambiente doméstico, pois o aplicativo tem a aparência legítima de uma ferramenta corporativa oficial de trabalho.

---

## 🛡️ Princípios Inegociáveis

1. **A empresa NUNCA acessa relatos, gravações, identidade ou localização das usuárias.**
2. **Privacidade por Design (Privacy by Design):** Arquitetura blindada criptograficamente — os dados sensíveis permanecem sob chaves exclusivas do dispositivo da mulher.
3. **Conta Portátil e Vitalícia:** A conta da usuária não usa e-mail corporativo. Se ela for desligada ou mudar de empresa, a conta continua ativa sem custo.
4. **K-Anonymity no RH:** O painel corporativo só exibe métricas se houver no mínimo **20 colaboradoras ativas**, impedindo inferência em times pequenos.

---

## 👥 Personas & Jornadas

| Persona | O que faz na plataforma | O que NUNCA vê |
| :--- | :--- | :--- |
| **Colaboradora** | Aciona SOS silencioso, grava evidências criptografadas com hash SHA-256, cadastra até 3 contatos de confiança, acessa guia de proteção. | *n/a* |
| **Contato de Confiança** | Recebe alerta com link em tempo real, localização GPS aproximada e instruções discretas de intervenção ("pedir açúcar", "ligar com pretexto neutro"). | Dados da empresa ou de outras usuárias. |
| **RH / Corporação** | Customiza o White Label do app corporativo, gerencia licenças, gera tokens cegos e acompanha métricas agregadas (N ≥ 20). | Identidade, relatos, áudios e localização das colaboradoras. |

---

## 🚀 Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor Vite
npm run dev

# 3. Compilar build de produção
npm run build
```

URL de execução: `http://localhost:5173/`
