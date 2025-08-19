# Correções Realizadas (Sistema_novo)

Data: 2025-08-19

Este pacote contém as correções aplicadas para estabilizar o fluxo de cadastro de pessoas, upload de foto e integração com Firestore/Cloudinary.

## Principais ajustes

1. Alinhamento das coleções do Firestore
   - Unificação para usar apenas a coleção `personnel` em todas as operações (listar, adicionar, editar, excluir).
   - Arquivo afetado: `src/services/personnelService.js`.
   - Remoção de referências antigas a `funcionarios` e `players`.

2. Correção do contrato de callbacks do formulário
   - `PersonnelForm` passou a receber e invocar `onSuccess` (antes `onSubmit`).
   - Arquivos afetados: `src/components/PersonnelForm.jsx`, `src/components/AdminPanelNew.jsx`.

3. Correções de sintaxe em `PersonnelForm.jsx`
   - Remoção de chaves duplicadas na declaração do componente.
   - Inserção de `;` e quebras de linha ausentes nas imports.

4. Upload Cloudinary
   - App configurado para usar `VITE_CLOUDINARY_UPLOAD_PRESET=ebystopu` (preset UNSIGNED).
   - Serviço de upload utiliza `personnelStorageService.uploadPhoto()` com validação de arquivo.

5. UX do modal
   - Botão "X" chama `onCancel` que fecha o modal através de `onClose` no `AdminPanelNew`.
   - Tecla ESC já fecha o modal via listener global.

## Pré-requisitos do ambiente

- Firestore:
  - Crie a coleção `personnel` (nome exatamente assim, minúsculo).
  - Regras sugeridas (já compatíveis com seu padrão):
    ```
    match /personnel/{personnelId} {
      allow read: if isAuthorizedUser();
      allow write: if isAdmin();
    }
    ```
- Cloudinary:
  - Upload preset `ebystopu` em modo "Unsigned".
  - `.env` com:
    ```
    VITE_CLOUDINARY_CLOUD_NAME=<seu_cloud_name>
    VITE_CLOUDINARY_UPLOAD_PRESET=ebystopu
    ```

## Como rodar

```bash
npm install
npm run dev
```

Após qualquer alteração no `.env`, reinicie o servidor de desenvolvimento.

## Teste rápido

1. Acesse Painel Admin → Pessoal → "Adicionar Primeira Pessoa".
2. Preencha "Nome da Foto", selecione uma imagem (JPG/PNG até ~10MB), escolha "Tipo" e pelo menos uma atribuição.
3. Clique em Salvar. O documento deve aparecer na listagem (coleção `personnel`).
4. Botão "X" do modal deve fechar o formulário.

## Observações

- Se o upload for bloqueado por `ERR_BLOCKED_BY_CLIENT`, desative extensões de bloqueio de anúncios/privacidade temporariamente (ex.: AdBlock/uBlock).
- Garanta que cada documento tenha o campo `name` para ordenação correta.


