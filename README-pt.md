# Custom Menu CLI

Esta é uma ferramenta de interface de linha de comando (CLI) que cria um menu interativo com base em um arquivo JSON. Ele foi projetado para simplificar a execução de comandos frequentes em um terminal.

## Funcionalidades

- Menu interativo no terminal.
- Estrutura do menu definida por um arquivo JSON.
- Fácil de configurar e usar.
- Suporte para execução de comandos com confirmação.

## Instalação

Para instalar esta ferramenta globalmente, execute o seguinte comando:

```bash
npm install -g custom-menu-cli
```

## Uso

Esta ferramenta pode ser utilizada de duas formas: como uma ferramenta de Linha de Comando (CLI) ou programaticamente, importando sua função principal.

### Como Ferramenta CLI

Para usar o CLI, você pode executar o comando `custom-menu-cli`, passando opcionalmente o caminho para um arquivo JSON. Se nenhum caminho for fornecido, ele procurará um arquivo `menu.json` no diretório atual.

```bash
custom-menu-cli [caminho/para/seu/menu.json]
```

### Uso Programático

Você pode importar a função `runCli` do pacote e executá-la dentro de suas próprias aplicações Node.js. Isso permite integrar a funcionalidade do menu customizado em scripts ou sistemas maiores.

```javascript
import { runCli } from 'custom-menu-cli';

async function iniciarMeuMenuCustomizado() {
    console.log("Iniciando menu customizado...");
    // Opcionalmente, passe o caminho para o seu arquivo menu.json
    await runCli('./caminho/para/seu/menu.json');
    console.log("Menu customizado finalizado.");
}

iniciarMeuMenuCustomizado();
```

## Estrutura do JSON

O arquivo JSON que define o menu tem a seguinte estrutura:

```json
{
  "name": "Deploy Menu",
  "description": "Menu de navegação para deploys",
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
        }
      ]
    },
    {
      "id": "2",
      "name": "Restart All",
      "type": "custom-action",
      "idList": ["1.1", "1.2"],
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
