# Custom Menu CLI

<img src="./docs/icon.png" alt="Custom Menu CLI Icon" width="600px" height="400px"/>

![Exemplo de Menu 1](./docs/example1.png)
![Exemplo de Menu 2](./docs/example2.png)

Esta é uma ferramenta de interface de linha de comando (CLI) que cria um menu interativo com base em um arquivo JSON. Ele foi projetado para simplificar a execução de comandos frequentes em um terminal.

## Funcionalidades

- Menu interativo no terminal.
- Estrutura do menu definida por um arquivo JSON.
- Fácil de configurar e usar.
- Suporte para execução de comandos com confirmação.
- Execute sequências de ações diretamente da linha de comando.
- Estrutura interna aprimorada pela unificação da lógica de execução de ações.
- Validação de dependência aprimorada com verificações de profundidade de recursão para evitar aninhamento excessivo.

## Lançamentos

Você pode encontrar todas as versões lançadas e os executáveis standalone pré-compilados na página de [Releases do GitHub](https://github.com/mateusmed/custom-menu-cli/releases).


## Instalação

Para instalar esta ferramenta globalmente, execute o seguinte comando:

```bash
npm install -g custom-menu-cli
```

## Uso

Existem três maneiras principais de utilizar esta ferramenta:

### 1. Como Executável (Build de Release)

Você pode gerar executáveis para Linux, macOS e Windows. Após o build, os arquivos estarão na pasta `dist/`.

Primeiro, gere os arquivos com o comando:

```bash
npm run build
```

Depois, execute o arquivo correspondente ao seu sistema operacional, passando opcionalmente o caminho para um arquivo de menu. Se nenhum caminho for fornecido, ele procurará por um `menu.json` no diretório atual.

```bash
# No Linux/macOS
./dist/custom-menu-linux [caminho/para/seu/menu.json]

# No Windows
.\dist\custom-menu-win.exe [caminho\para\seu\menu.json]
```

### 2. Globalmente via NPM

Instale o pacote globalmente para usar o comando `custom-menu-cli` em qualquer lugar do seu sistema.

```bash
npm install -g custom-menu-cli
```

Depois de instalado, execute o comando:

```bash
custom-menu-cli [caminho/para/seu/menu.json]
```

### 3. Programaticamente via `require`

Você pode importar a função `runCli` em seus próprios projetos Node.js para integrar a funcionalidade do menu.

Primeiro, adicione o pacote como uma dependência do seu projeto:
```bash
npm install custom-menu-cli
```

Depois, use-o em seu código:

```javascript
const { runCli } = require('custom-menu-cli');

async function iniciarMeuMenuCustomizado() {
    console.log("Iniciando menu customizado...");
    // Opcionalmente, passe o caminho para o seu arquivo menu.json
    await runCli('./caminho/para/seu/menu.json');
    console.log("Menu customizado finalizado.");
}

iniciarMeuMenuCustomizado();
```

### 4. Geração de Menu Baseada em Pastas

O `custom-menu-cli` agora suporta a geração de menus a partir de uma pasta estruturada contendo arquivos JSON. Isso permite uma melhor organização e modularidade das suas definições de menu.

**Estrutura de Exemplo (`test_menus/`):**
```
test_menus/
├── 1-project-a/
│   ├── 1.1-down-service.json
│   ├── 1.2-up-service.json
│   └── 1.3-restart-project-a.json
├── 2-restart-all.json
└── 3-restart-project-a-nested.json
```

Cada arquivo `.json` dentro da pasta (e suas subpastas) representa uma opção de menu. Os diretórios são automaticamente convertidos em opções do tipo `navigation`.

**Como usar:**

Basta passar o caminho para a sua pasta de menu como argumento:

```bash
custom-menu-cli ./caminho/para/sua/pasta_de_menu
```

O CLI irá automaticamente descobrir e combinar todos os arquivos JSON válidos em uma única estrutura de menu.

### 5. Execução de Ações pela Linha de Comando

Você pode executar uma sequência de ações diretamente da linha de comando, sem entrar no menu interativo. Isso é útil para scripts e automação.

**Uso:**

```bash
node index.js menu=<caminho-para-o-menu> custom-action=<id_da_acao_1>,<id_da_acao_2>,...
```

- `menu=<caminho-para-o-menu>`: O caminho para o seu arquivo ou diretório de menu.
- `custom-action=<ids_das_acoes>`: Uma lista de IDs de ações, separados por vírgula, para executar em sequência.

**Exemplos:**

```bash
# Executar uma única ação
node index.js menu=menu.json custom-action=1.1

# Executar uma sequência de ações
node index.js menu=./test_menus/ custom-action=1.1,1.2
```

**Validação de Profundidade de Recursão:**

A ferramenta agora inclui validação de profundidade de recursão para evitar ações customizadas aninhadas excessivamente profundas e potenciais loops infinitos. Se uma sequência de ações customizadas exceder uma profundidade máxima de recursão predefinida, a ferramenta detectará e se recusará a executar, exibindo uma mensagem de erro. Isso ajuda a manter a estabilidade e a previsibilidade em estruturas de menu complexas.

## Estrutura do JSON

O arquivo JSON que define o menu tem a seguinte estrutura:

```json
{
  "name": "custom-menu-cli",
  "description": "JSON-based terminal menu",
  "options": [
    {
      "id": "1",
      "name": "Projeto A",
      "type": "navigation",
      "options": [
        {
          "id": "1.1",
          "name": "Down Service",
          "type": "action",
          "command": "echo 'Down A'",
          "confirm": true
        },
        {
          "id": "1.2",
          "name": "Up Service",
          "type": "action",
          "command": "echo 'Up A'"
        },
        {
          "id": "1.3",
          "name": "Restart Project A (from inside)",
          "type": "custom-action",
          "idList": ["1.1", "1.2"],
          "confirm": true
        }
      ]
    },
    {
      "id": "2",
      "name": "Restart All",
      "type": "custom-action",
      "idList": ["1.1", "1.2"],
      "confirm": true
    },
    {
      "id": "3",
      "name": "Restart Project A (Nested)",
      "type": "custom-action",
      "idList": ["1.3"],
      "confirm": true
    }
  ]
}
```

### Campos

- `name`: O nome do menu.
- `description`: Uma breve descrição do menu.
- `options`: Um array de opções do menu.
  - `id`: Um identificador único para a opção.
  - `name`: O texto que será exibido para a opção.
  - `type`: O tipo de opção. Pode ser `action` (executa um comando), `navigation` (abre um submenu) ou `custom-action` (executa uma lista de comandos de outras ações).
  - `command`: O comando a ser executado (se o tipo for `action`).
  - `idList`: Uma lista de ids de outras ações a serem executados (se o tipo for `custom-action`).
  - `confirm`: Um booleano que indica se uma confirmação deve ser solicitada antes de executar o comando.
  - `options`: Um array de sub-opções (se o tipo for `navigation`).

## Licença

Este projeto está licenciado sob a Licença MIT.

## Autor

- **Mateus Medeiros**
  - GitHub: [@mateusmed](https://github.com/mateusmed)
  - LinkedIn: [Mateus Medeiros](https://www.linkedin.com/in/mateus-med/)
