import React from 'react'; // Importa a biblioteca React para construir componentes de interface de usuário.

const PlayerModal = ({ player, isOpen, onClose }) => { // Define o componente funcional PlayerModal que recebe props: player (dados do jogador), isOpen (estado de visibilidade do modal) e onClose (função para fechar o modal).
  if (!isOpen || !player) return null; // Se o modal não estiver aberto ou não houver dados do jogador, o componente não renderiza nada.

  return ( // Início da renderização do componente.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> {/* Div principal que cria um overlay fixo, escurecido e centraliza o modal. */}
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"> {/* Div que representa o conteúdo do modal: fundo branco, cantos arredondados, largura máxima e altura limitada com scroll. */}
        {/* Botão de fechar */} {/* Comentário para indicar a seção do botão de fechar. */}
        <button // Botão para fechar o modal.
          onClick={onClose} // Define a função onClose para ser executada quando o botão é clicado.
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-50" // Estilos Tailwind CSS para posicionamento absoluto, cor do texto, hover e tamanho da fonte.
        >
          × {/* Caractere 'x' para o ícone de fechar. */}
        </button>

        <div className="p-0"> {/* Div para agrupar o conteúdo principal do modal, sem padding inicial. */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 p-6 pb-0">Detalhes do Jogador</h2> {/* Título da seção de detalhes do jogador com estilos de texto e padding. */}
          
          {/* Seção de destaque com foto e nome estilizado - Responsiva */} {/* Comentário para indicar a seção de destaque. */}
          <div className="relative h-auto md:h-96 overflow-hidden chelsea-hero-section"> {/* Div para a seção de destaque, com altura responsiva e overflow oculto. */}
            {/* Degradê branco suave para vermelho */} {/* Comentário para indicar a seção do gradiente. */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-[#E5050F] to-[#E5050F]"></div> {/* Div que cria o efeito de gradiente de branco para vermelho, cobrindo toda a seção. */}
            
            {/* Sobrenomes BEM GRANDES com transparência no fundo */} {/* Comentário para indicar a seção dos sobrenomes grandes. */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pl-40"> {/* Div que centraliza os sobrenomes, com posicionamento absoluto e padding-left para mover para a direita. */}
              {player.name.split(" ").slice(1).map((namePart, index) => ( // Mapeia as partes do nome do jogador (exceto o primeiro) para criar um h1 para cada.
                <h1 // Elemento h1 para exibir cada parte do sobrenome.
                  key={index} // Chave única para cada item na lista, importante para o React.
                  className="text-white font-black select-none pointer-events-none leading-none tracking-tight" // Estilos Tailwind CSS para texto branco, negrito, não selecionável e espaçamento.
                  style={{ // Estilos inline para controle preciso do tamanho da fonte, margem superior, opacidade, cor e sombra do texto.
                    fontSize: 'clamp(3rem, 9vw, 7rem)', // Tamanho da fonte responsivo.
                    marginTop: index > 0 ? '-0.15em' : '0', // Margem superior negativa para sobrepor as linhas.
                    opacity: 0.4, // Opacidade do texto.
                    color: 'rgba(255, 255, 255, 0.5)', // Cor do texto com transparência.
                    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)' // Sombra do texto para melhor legibilidade.
                  }}
                >
                  {namePart.toUpperCase()} {/* Exibe a parte do nome em maiúsculas. */}
                </h1>
              ))}
            </div>
            
            {/* Container para foto e primeiro nome (responsivo) */} {/* Comentário para indicar o container da foto e primeiro nome. */}
            <div className="relative flex flex-col md:flex-row items-start justify-start h-full"> {/* Div container para a foto e o primeiro nome, com layout responsivo alinhado à esquerda. */}
              {/* Foto do jogador - Colada na borda esquerda do container */} {/* Comentário para indicar a seção da foto do jogador. */}
              <div className="w-auto md:w-80 flex justify-start items-end pt-8 md:pt-0 z-20" // Div para a foto do jogador, sem padding para ficar colada na borda.
                   style={{ height: '100%' }}> {/* Estilo inline para garantir que a div ocupe 100% da altura disponível. */}
                {player.photoData?.url || player.photoUrl ? ( // Verifica se há URL da foto do jogador.
                  <img // Elemento img para exibir a foto do jogador.
                    src={player.photoData?.url || player.photoUrl} // Define a URL da imagem.
                    alt={player.name} // Texto alternativo para a imagem.
                    className="w-48 md:w-full h-auto object-contain" // Estilos Tailwind CSS para largura responsiva, altura automática e ajuste da imagem.
                    style={{ // Estilos inline para filtro, cor de fundo, modo de mesclagem, altura máxima e posição do objeto.
                      filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))', // Sombra para a imagem.
                      backgroundColor: 'transparent', // Fundo transparente.
                      mixBlendMode: 'normal', // Modo de mesclagem normal.
                      maxHeight: '95%', // Altura máxima da imagem.
                      alignSelf: 'flex-end', // Alinha a imagem à parte inferior da div.
                      objectPosition: 'bottom' // Garante que a base da imagem fique sempre colada.
                    }}
                  />
                ) : ( // Se não houver foto, exibe um placeholder.
                  <div className="w-48 h-64 bg-gray-200 rounded-lg flex items-center justify-center"> {/* Div placeholder para quando não há foto. */}
                    <span className="text-gray-500">Sem foto</span> {/* Texto indicando que não há foto. */}
                  </div>
                )}
              </div>
              
              {/* Primeiro nome - Posicionado sobre o segundo nome, alinhado à esquerda e um pouco mais para baixo */} {/* Comentário para indicar a seção do primeiro nome. */}
              <div className="absolute z-10" style={{ top: 'calc(50% - 80px)', left: 'calc(50% - 160px)' }}> {/* Div para o primeiro nome, com posicionamento absoluto. Ajustado para ficar mais à esquerda e um pouco mais para baixo em relação ao centro, com valores mais precisos. */}
                <p className="text-white text-4xl md:text-5xl font-bold tracking-wider" // Parágrafo para exibir o primeiro nome, com estilos de texto e espaçamento.
                   style={{ // Estilos inline para opacidade, sombra do texto e espaçamento entre letras.
                     opacity: 0.9, // Opacidade do texto.
                     textShadow: '2px 2px 6px rgba(0,0,0,0.7)', // Sombra do texto.
                     letterSpacing: '0.05em' // Espaçamento entre letras.
                   }}>
                  {player.name.split(' ')[0].toUpperCase()} {/* Exibe o primeiro nome em maiúsculas. */}
                </p>
              </div>
              
              {/* Espaço vazio para equilibrar layout em desktop */} {/* Comentário para indicar o espaço vazio. */}
              <div className="hidden md:block w-80"></div> {/* Div vazia para equilibrar o layout em telas maiores. */}
            </div>
          </div>

          {/* Informações do jogador */} {/* Comentário para indicar a seção de informações do jogador. */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Div para as informações do jogador, com layout de grid responsivo. */}
            {/* Dados Pessoais */} {/* Comentário para indicar a seção de dados pessoais. */}
            <div className="bg-gray-50 p-4 rounded-lg"> {/* Div para a seção de dados pessoais, com fundo cinza claro e cantos arredondados. */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3> {/* Título da seção de dados pessoais. */}
              
              <div className="space-y-3"> {/* Div para agrupar os campos de dados pessoais com espaçamento vertical. */}
                <div> {/* Div para um campo de dado individual. */}
                  <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo do campo. */}
                    Nome Completo {/* Texto do rótulo. */}
                  </label>
                  <p className="text-gray-900 font-medium">{player.fullName || player.name}</p> {/* Valor do campo (nome completo do jogador ou nome da foto como fallback). */}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Div para agrupar campos em um grid responsivo. */}
                  <div> {/* Div para o campo de data de nascimento. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo do campo. */}
                      Data de Nascimento {/* Texto do rótulo. */}
                    </label>
                    <p className="text-gray-900"> {/* Valor do campo (data de nascimento formatada). */}
                      {player.birthDate ? new Date(player.birthDate).toLocaleDateString('pt-BR') : 'Não informada'} {/* Exibe a data de nascimento formatada ou 'Não informada'. */}
                    </p>
                  </div>
                  
                  <div> {/* Div para o campo de naturalidade. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo do campo. */}
                      Naturalidade {/* Texto do rótulo. */}
                    </label>
                    <p className="text-gray-900">{player.birthplace || 'Não informada'}</p> {/* Valor do campo (naturalidade ou 'Não informada'). */}
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Esportivos */} {/* Comentário para indicar a seção de dados esportivos. */}
            <div className="bg-gray-50 p-4 rounded-lg"> {/* Div para a seção de dados esportivos. */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Esportivos</h3> {/* Título da seção. */}
              
              <div className="space-y-3"> {/* Div para agrupar os campos. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid para os campos. */}
                  <div> {/* Div para o campo de posição. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo. */}
                      Posição {/* Texto do rótulo. */}
                    </label>
                    <p className="text-gray-900">{player.position || 'Não informada'}</p> {/* Valor. */}
                  </div>
                  
                  <div> {/* Div para o campo de categoria. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo. */}
                      Categoria {/* Texto do rótulo. */}
                    </label>
                    <p className="text-gray-900">{player.category || 'Não informada'}</p> {/* Valor. */}
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Acadêmicos */} {/* Comentário para indicar a seção de dados acadêmicos. */}
            <div className="bg-gray-50 p-4 rounded-lg"> {/* Div para a seção de dados acadêmicos. */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Acadêmicos</h3> {/* Título da seção. */}
              
              <div className="space-y-3"> {/* Div para agrupar os campos. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid para os campos. */}
                  <div> {/* Div para o campo de escola. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo. */}
                      Escola {/* Texto do rótulo. */}
                    </label>
                    <p className="text-gray-900">{player.school || 'Não informada'}</p> {/* Valor. */}
                  </div>
                  
                  <div> {/* Div para o campo de ano que estuda. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo. */}
                      Ano que Estuda {/* Texto do rótulo. */}
                    </label>
                    <p className="text-gray-900">{player.year || 'Não informado'}</p> {/* Valor. */}
                  </div>
                </div>
              </div>
            </div>

            {/* Dados do Alojamento */} {/* Comentário para indicar a seção de dados do alojamento. */}
            <div className="bg-gray-50 p-4 rounded-lg"> {/* Div para a seção de dados do alojamento. */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Alojamento</h3> {/* Título da seção. */}
              
              <div className="space-y-3"> {/* Div para agrupar os campos. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid para os campos. */}
                  <div> {/* Div para o campo de admissão no alojamento. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo. */}
                      Admissão no Alojamento {/* Texto do rótulo. */}
                    </label>
                    <p className="text-gray-900"> {/* Valor. */}
                      {player.admissionDate ? new Date(player.admissionDate).toLocaleDateString('pt-BR') : 'Não informada'} {/* Exibe a data de admissão formatada ou 'Não informada'. */}
                    </p>
                  </div>
                  
                  <div> {/* Div para o campo de quarto. */}
                    <label className="block text-sm font-medium text-gray-700 mb-1"> {/* Rótulo. */}
                      Quarto {/* Texto do rótulo. */}
                    </label>
                    <p className="text-gray-900">{player.room || 'Não informado'}</p> {/* Valor. */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Observações Médicas e Contato de Emergência */} {/* Comentário para indicar a seção de observações médicas e contato de emergência. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-6 pb-6"> {/* Div para as seções de observações médicas e contato de emergência, com layout de grid responsivo. */}
            {/* Observações Médicas */} {/* Comentário para indicar a seção de observações médicas. */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200"> {/* Div para a seção de observações médicas, com fundo vermelho claro e borda. */}
              <h4 className="text-lg font-semibold text-red-800 mb-3">Observações Médicas</h4> {/* Título da seção. */}
              <div> {/* Div para o campo de alergias e observações. */}
                <label className="block text-sm font-medium text-red-700 mb-1"> {/* Rótulo. */}
                  Alergias e Observações {/* Texto do rótulo. */}
                </label>
                <p className="text-red-900"> {/* Valor. */}
                  {player.medicalObservations || 'Nenhuma informada pela mãe.'} {/* Exibe as observações médicas ou uma mensagem padrão. */}
                </p>
              </div>
            </div>

            {/* Contato para Emergência */} {/* Comentário para indicar a seção de contato de emergência. */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200"> {/* Div para a seção de contato de emergência, com fundo verde claro e borda. */}
              <h4 className="text-lg font-semibold text-green-800 mb-3"> {/* Título da seção. */}
                Contato dos Responsáveis para Emergência {/* Texto do título. */}
              </h4>
              <div className="space-y-3"> {/* Div para agrupar os campos. */}
                <div> {/* Div para o campo de nome do responsável. */}
                  <label className="block text-sm font-medium text-green-700 mb-1"> {/* Rótulo. */}
                    Nome do Responsável {/* Texto do rótulo. */}
                  </label>
                  <p className="text-green-900"> {/* Valor. */}
                    {player.emergencyContactName || 'Não informado'} {/* Exibe o nome do responsável ou 'Não informado'. */}
                  </p>
                </div>
                <div> {/* Div para o campo de telefone. */}
                  <label className="block text-sm font-medium text-green-700 mb-1"> {/* Rótulo. */}
                    Telefone {/* Texto do rótulo. */}
                  </label>
                  <p className="text-green-900"> {/* Valor. */}
                    {player.emergencyContactPhone || 'Não informado'} {/* Exibe o telefone de emergência ou 'Não informado'. */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de fechar */} {/* Comentário para indicar a seção do botão de fechar na parte inferior. */}
          <div className="flex justify-end p-6 pt-0"> {/* Div para alinhar o botão de fechar à direita. */}
            <button // Botão para fechar o modal.
              onClick={onClose} // Define a função onClose para ser executada quando o botão é clicado.
              className="bg-[#E5050F] text-white px-6 py-2 rounded-lg hover:bg-[#C20C18] transition-colors" // Estilos Tailwind CSS para cor de fundo, texto, padding, cantos arredondados e efeito hover.
            >
              Fechar {/* Texto do botão. */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal; // Exporta o componente PlayerModal para que possa ser usado em outras partes da aplicação. 

