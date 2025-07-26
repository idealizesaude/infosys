import os
from datetime import datetime

# 📌 CONFIGURAÇÕES
PASTA_PROJETO = '.'
EXTENSOES = ['.html', '.css', '.js']
AGORA = datetime.now().strftime('%d-%m-%Y_%H-%M-%S')

ARQ_CODIGOS = f'codigos-projeto_{AGORA}.txt'
ARQ_ESTRUTURA = f'estrutura-do-projeto_{AGORA}.txt'

# 📁 Gera estrutura de diretórios do projeto (ignora .git e pastas ocultas)
def gerar_estrutura(pasta):
    linhas = []

    for raiz, dirs, arquivos in os.walk(pasta):
        # Remove pastas ocultas (ex: .git, .vscode) do walk
        dirs[:] = [d for d in dirs if not d.startswith('.')]

        nivel = raiz.replace(pasta, '').count(os.sep)
        indentacao = '│   ' * nivel
        pasta_formatada = f"{indentacao}├── {os.path.basename(raiz)}/"
        linhas.append(pasta_formatada)

        subindent = '│   ' * (nivel + 1)
        for arquivo in arquivos:
            if not arquivo.startswith('.'):  # ignora arquivos ocultos
                linhas.append(f"{subindent}├── {arquivo}")

    return '\n'.join(linhas)

# 📄 Gera conteúdo dos arquivos de código
def coletar_codigos(pasta):
    conteudos = []
    for raiz, _, arquivos in os.walk(pasta):
        for nome_arquivo in arquivos:
            if any(nome_arquivo.endswith(ext) for ext in EXTENSOES):
                caminho_completo = os.path.join(raiz, nome_arquivo)
                try:
                    with open(caminho_completo, 'r', encoding='utf-8') as f:
                        conteudo = f.read()
                        conteudos.append(f'===== {caminho_completo} =====\n{conteudo}\n\n')
                except Exception as e:
                    print(f'⚠️ Erro ao ler {caminho_completo}: {e}')
    return conteudos

# 💾 Salva os arquivos
def salvar_arquivo(nome_arquivo, conteudo):
    with open(nome_arquivo, 'w', encoding='utf-8') as f:
        if isinstance(conteudo, list):
            f.writelines(conteudo)
        else:
            f.write(conteudo)
    print(f'✅ Arquivo "{nome_arquivo}" salvo com sucesso.')

# 🚀 Execução principal
if __name__ == '__main__':
    estrutura = gerar_estrutura(PASTA_PROJETO)
    salvar_arquivo(ARQ_ESTRUTURA, estrutura)

    codigos = coletar_codigos(PASTA_PROJETO)
    salvar_arquivo(ARQ_CODIGOS, codigos)