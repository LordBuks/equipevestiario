# Guia de Migração - Sistema Unificado de Pessoal

## Resumo das Mudanças

Este projeto foi refatorado para eliminar a redundância entre o cadastro de "Efetivo" e "Setores". Agora você pode:

1. **Cadastrar uma pessoa uma única vez** no sistema
2. **Atribuir essa pessoa a múltiplos postos/setores** sem recadastrar
3. **Remover fotos** durante o cadastro/edição
4. **Buscar e selecionar** pessoas já cadastradas para atribuir a postos

## Novos Componentes Criados

### 1. `src/services/personnelService.js`
- **Substitui:** `playersService` e `employeesService`
- **Função:** Gerencia a coleção unificada `personnel` no Firebase
- **Recursos:** CRUD completo + gerenciamento de atribuições

### 2. `src/hooks/usePersonnel.js`
- **Substitui:** `usePlayers.js` e `useEmployees.js`
- **Função:** Hook unificado para gerenciar estado do pessoal
- **Recursos:** Filtros por tipo e atribuição

### 3. `src/components/PersonnelForm.jsx`
- **Substitui:** `PlayerForm.jsx` e `EmployeeForm.jsx`
- **Função:** Formulário unificado para cadastro/edição
- **Novos recursos:** 
  - Botão para remover foto
  - Seleção de múltiplas atribuições
  - Validação aprimorada

### 4. `src/components/PersonnelSelector.jsx`
- **Novo componente**
- **Função:** Interface para selecionar pessoas já cadastradas
- **Recursos:** Busca por nome, matrícula, preview de dados

### 5. Componentes Atualizados
- `src/components/EmployeesPageNew.jsx` - Nova versão da página de setores
- `src/components/AdminPanelNew.jsx` - Nova versão do painel administrativo

## Estrutura do Banco de Dados

### Nova Coleção: `personnel`
```javascript
{
  id: "documento_id",
  name: "Nome da foto",
  fullName: "Nome completo",
  type: "Especial|Agente|Monitor",
  assignments: ["Visitantes", "Imprensa"], // Array de atribuições
  birthDate: "2000-01-01",
  registration: "12345",
  // ... outros campos existentes
  photoData: {
    url: "https://cloudinary.com/...",
    publicId: "id_da_imagem",
    width: 800,
    height: 600,
    format: "jpg"
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Como Testar

### 1. Configuração Inicial
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas chaves reais do Firebase e Cloudinary

# Iniciar servidor
npm run dev
```

### 2. Fluxo de Teste Recomendado

#### A. Teste do Cadastro Unificado
1. Acesse o **Painel Administrativo**
2. Vá para a aba **"Pessoal"**
3. Clique em **"Adicionar Pessoa"**
4. Preencha os dados e selecione:
   - **Tipo:** "Agente"
   - **Atribuições:** Marque "Visitantes"
5. Teste a **função de remover foto**
6. Salve o cadastro

#### B. Teste da Atribuição a Postos
1. Vá para **"Setores"** no menu principal
2. Selecione o setor **"Imprensa"**
3. Clique em **"Adicionar Agente ao Posto"**
4. Selecione o agente cadastrado anteriormente
5. Verifique se ele aparece no setor "Imprensa"
6. Volte para "Visitantes" e confirme que ele ainda está lá

#### C. Teste de Edição
1. No painel administrativo, edite a pessoa criada
2. Adicione mais atribuições
3. Teste remover e adicionar nova foto
4. Verifique se as mudanças aparecem em todos os setores

## Migração de Dados Existentes

**IMPORTANTE:** Os dados existentes nas coleções `players` e `employees` precisam ser migrados para a nova coleção `personnel`.

### Script de Migração (Execute no Console do Firebase)
```javascript
// Este script deve ser executado no console do Firebase
// ou via Cloud Functions para migrar dados existentes

async function migrateData() {
  const playersSnapshot = await db.collection('players').get();
  const employeesSnapshot = await db.collection('employees').get();
  
  // Migrar players
  for (const doc of playersSnapshot.docs) {
    const data = doc.data();
    await db.collection('personnel').add({
      ...data,
      type: data.category || 'Agente',
      assignments: [],
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    });
  }
  
  // Migrar employees
  for (const doc of employeesSnapshot.docs) {
    const data = doc.data();
    await db.collection('personnel').add({
      ...data,
      type: 'Monitor',
      assignments: data.function ? [data.function] : [],
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    });
  }
}
```

## Arquivos de Configuração

### `.env` (Configure com suas chaves)
```
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF123

VITE_CLOUDINARY_CLOUD_NAME=seu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=seu_preset
```

## Funcionalidades Implementadas

✅ **Cadastro unificado** - Uma pessoa, múltiplas atribuições  
✅ **Remoção de foto** - Botão para remover foto com confirmação  
✅ **Seletor de pessoal** - Interface para "puxar" agentes existentes  
✅ **Busca avançada** - Por nome, nome completo ou matrícula  
✅ **Validação aprimorada** - Verificações de dados e arquivos  
✅ **Compatibilidade visual** - Mantém todo o design original  

## Próximos Passos

1. **Teste todas as funcionalidades** com suas chaves do Firebase
2. **Execute a migração de dados** se necessário
3. **Substitua os componentes antigos** pelos novos no `App.jsx`
4. **Remova arquivos obsoletos** após confirmar que tudo funciona

## Suporte

Se encontrar algum problema durante os testes, verifique:
1. Configuração das variáveis de ambiente
2. Permissões do Firebase Firestore
3. Configuração do Cloudinary
4. Console do navegador para erros específicos

