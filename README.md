# Frontend

## Pré-requisitos

- Node.js (v14+)

## Instalação

1. Clone este repositório e navegue até à pasta `frontend`:
   ```bash
   git clone https://github.com/MistaPaulo/moviecatalogue_frontend.git
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Variáveis de Ambiente

Crie um ficheiro `.env` na raiz do diretório `frontend`, que siga o formato do seguinte exemplo:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Executar Localmente

- **Modo desenvolvimento**  
  ```bash
  npm start
  ```

- **Modo produção**  
  ```bash
  npm run build
  npx serve -s build
  ```
