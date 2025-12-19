# Guia de Desenvolvimento do Sistema Veterinário Completo

Este documento serve como a especificação técnica e funcional para o desenvolvimento do Sistema Hospitalar Veterinário, que inclui módulos de Clínica, Petshop, Atendimento Domiciliar, App do Tutor, Painel Master e Integração com IA (AnalisaVet).

## ⚠️ Instrução Crítica Inicial
**Integração AnalisaVet**: O usuário possui o código do AnalisaVet pronto. Ele deve ser inserido no diretório:
`vet-system/backend/src/analisavet/`

---

## 🏗️ Arquitetura do Sistema

O sistema será um **Monorepo** (ou estrutura similar) dividido em:
1.  **Backend (API)**: Node.js com Express.
    *   Gerencia regras de negócio, banco de dados, autenticação e integração com IA.
2.  **Frontend (Web App)**: React com Vite.
    *   Single Page Application (SPA) responsiva.
    *   Gerencia todos os painéis (Master, Admin, Vet, Recepção) baseado em permissões (RBAC).
3.  **App do Tutor**: (Pode ser parte do Frontend responsivo ou um PWA separado).
    *   Focado na experiência do cliente final.

---

## 1. Painel Admin da Clínica (O Cérebro)

### 1.1 Dashboard do Admin
*   **Visão Geral**: Consultas do dia, internações ativas, vacinas, produtos críticos, lista de compras.
*   **Ações Rápidas**: Criar usuário, configurar agenda, ver lista de compras.

### 1.2 Usuários & Permissões
*   **Controle RBAC**: Criar perfis (Vet, Auxiliar, Recepção) com permissões granulares (Ver, Criar, Editar, Excluir) por módulo.
*   **Permissões Específicas**: Ex: "Letícia" vê Agenda e Estoque, mas não Financeiro.

### 1.3 Configurações da Clínica (Flags)
*   **Ativação Modular**: Ativar/Desativar Petshop, Domiciliar, Internação, Fiscal, IA.

### 1.4 Serviços
*   Cadastro de serviços com tempo padrão, comissão, e se gera prontuário.

### 1.5 Produtos e Estoque
*   Controle por unidade e ml (fracionado).
*   Importação via XML/Excel.
*   Baixa automática por uso em internação/procedimentos.

### 1.6 Regras Fiscais
*   Mapeamento de códigos fiscais para automação contábil.

### 1.7 Formulários Clínicos
*   Construtor de formulários (pré-consulta, retorno) personalizáveis.

### 1.8 Editor de Receituário
*   Editor visual (drag & drop) para templates de receitas.

### 1.9 Documentos e Assinatura Digital
*   Gestão de termos (cirurgia, eutanásia) com suporte a assinatura digital/aceite.

### 1.10 Configuração de Internação
*   Boletins médicos personalizáveis e horários de visita.

---

## 2. Painel Recepção
*   **Agenda**: Visão geral, check-in, confirmação, reagendamento. Controle de conflitos e duplicidade (ex: vacinas).
*   **Cadastro**: Gestão de Tutores e Pets.

---

## 3. Painel Consultório (Veterinário)
*   **Fila de Atendimento**: Iniciar consultas.
*   **Prontuário Eletrônico**: Dados do pet, anamnese, exame físico, diagnóstico, conduta.
    *   Integrado com formulários de pré-consulta.
    *   **IA de Transcrição**: Transcreve áudio da consulta filtrando conversas paralelas.
    *   **IA Clínica**: Organiza textos, sugere pontos de atenção (sem diagnóstico), gera resumos.
*   **Receituário Inteligente**: Drag & drop de medicamentos, modelos salvos.
*   **AnalisaVet Integrado**: Solicitação e visualização de exames com apoio de IA.

---

## 4. Painel Internação (Auxiliar / Vet)
*   **Leitos e Pacientes**: Gestão visual.
*   **Prescrição e Execução (Checagem)**: Botão "FEITO" com rastreabilidade (quem e quando) e baixa de estoque automática.
*   **Boletim Médico**: Geração (com apoio de IA) e envio para tutor via App.
*   **IA Operacional**: Alertas de atraso em medicação, estoque baixo.

---

## 5. Painel Estoque
*   **Baixa Rápida**: Para consumo interno.
*   **Inventário**: Com leitor de código de barras.
*   **Compras**: Sugestão de compras baseada em consumo (IA).

---

## 6. Painel Financeiro / PDV
*   **PDV**: Venda de produtos e serviços.
*   **Comissões**: Cálculo automático para profissionais.

---

## 7. Petshop (Módulo Opcional)
*   Agenda específica para banho/tosa.

---

## 8. Atendimento Domiciliar (Módulo Opcional)
*   Agenda e controle de atendimentos externos.

---

## 9. App do Tutor
*   **Perfil**: Meus pets, histórico.
*   **Agendamento**: Marcar consultas/vacinas.
*   **Internação**: Acompanhar boletins e agendar visitas.
*   **Documentos**: Assinar termos digitalmente.
*   **Avaliação (NPS)**: Avaliar atendimentos.

---

## 10. Módulo IA (AnalisaVet & Assistentes)

**Princípio Fundamental**: A IA é assistiva. A decisão final é sempre do humano.

### 10.1 AnalisaVet (Exames)
*   Organização e destaque de resultados fora do padrão.
*   Comparação com histórico.
*   Resumo técnico.

### 10.2 IA de Transcrição (Áudio)
*   Transcreve consultas.
*   Filtra conversas paralelas (café, assuntos pessoais).
*   Gera resumo clínico estruturado.

### 10.3 IA Operacional & Administrativa
*   Alertas de estoque e agenda.
*   Resumos gerenciais.

---

## 11. Módulo de Avaliação (NPS)
*   Envio automático de pesquisa após atendimentos.
*   Cálculo de NPS e classificação (Promotor, Neutro, Detrator).
*   Alertas de avaliações negativas.

---

## Guia de Desenvolvimento - Primeiros Passos

1.  **Backend**:
    *   Instalar dependências (`npm init`, `npm install express mongoose...`).
    *   Configurar conexão com banco de dados.
    *   Criar rotas de autenticação.
    *   Colocar arquivos do AnalisaVet em `src/analisavet`.
2.  **Frontend**:
    *   Criar projeto (`npm create vite@latest`).
    *   Instalar bibliotecas de UI e Roteamento.
    *   Criar estrutura de pastas por módulos (Admin, Vet, etc.).
3.  **Painel Master**:
    *   Implementar lógica "Super Admin" para gerenciar múltiplas clínicas (se for SaaS) ou apenas configuração global.

ESTE GUIA DEVE SER SEGUIDO PARA GARANTIR QUE TODAS AS ESPECIFICAÇÕES SEJAM ATENDIDAS.
