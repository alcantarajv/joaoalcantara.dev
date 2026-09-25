# joaoalcantara.dev

[![CI](https://github.com/alcantarajv/joaoalcantara.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/alcantarajv/joaoalcantara.dev/actions/workflows/ci.yml)

Site pessoal de João Vitor Alcântara Corrêa, desenvolvedor backend (Java e Spring Boot).

Reúne os projetos de portfólio, as formas de contato e o currículo em PDF. No ar em **https://joaoalcantara.dev**.

## Projetos apresentados

| Projeto | Código | No ar |
|---|---|---|
| Encurtador de Links | [alcantarajv/encurtador-links](https://github.com/alcantarajv/encurtador-links) | [encurtador-links-rudi.onrender.com](https://encurtador-links-rudi.onrender.com) |
| Reserva de Quadras | [alcantarajv/reserva-quadras](https://github.com/alcantarajv/reserva-quadras) | [reserva-quadras.onrender.com](https://reserva-quadras.onrender.com) |
| API de Pedidos e Pagamentos | [alcantarajv/api-pedidos](https://github.com/alcantarajv/api-pedidos) | [api-pedidos-yi5d.onrender.com](https://api-pedidos-yi5d.onrender.com) |

## Stack

- [Astro](https://astro.build) gerando HTML estático, com TypeScript em modo estrito
- CSS puro com variáveis, sem framework de interface
- Hospedagem no Cloudflare Workers (static assets), com deploy a cada push na `main`

## Como rodar

Requer Node 22.12 ou mais recente.

```bash
npm install
npm run dev       # servidor local em http://localhost:4321
npm run check     # verificação de tipos (TypeScript estrito)
npm run build     # gera o site estático em dist/
npm run preview   # serve dist/ em http://localhost:8787 com as regras do Cloudflare (wrangler dev)
npm run links     # verifica links quebrados em dist/ (rode depois do build)
```

O CI (GitHub Actions) roda `npm ci`, `check`, `build` e `links` a cada push na `main`, em pull requests e uma vez por semana.

## Deploy

O site é publicado no Cloudflare Workers (static assets) pelo **Workers Builds**: cada push na `main` gera o build (`npm run build`) e publica `dist/` (`npx wrangler deploy`), sem token no repositório. A configuração do Worker está em `wrangler.jsonc`, e a versão do Node em `.node-version`, lida tanto pelo CI quanto pelo Workers Builds.

Configurado no painel da Cloudflare (fora do repositório):

- **Domínio:** `joaoalcantara.dev` registrado no Cloudflare Registrar, com renovação automática, e ligado ao Worker como *Custom Domain* (DNS e certificado criados pela Cloudflare).
- **`www`:** registro `AAAA www 100::` com proxy ligado e uma *Redirect Rule* (`https://www.*` → `https://${1}`, 301, preservando a query string). O registro só existe para o `www` passar pela Cloudflare e a regra redirecionar.
- **HTTPS:** *Always Use HTTPS* ligado. Todo o TLD `.dev` está na lista de pré-carregamento HSTS dos navegadores, então o site só abre por HTTPS de qualquer forma; a opção cobre clientes que não usam essa lista, como o `curl`.

## Como adicionar um projeto

Crie um arquivo `.md` em `src/content/projetos/`. O nome do arquivo vira o identificador do projeto (por exemplo, `meu-projeto.md` → `meu-projeto`). Nenhum HTML precisa ser editado.

```yaml
---
titulo: "Nome do Projeto"
foco: "latência"              # rótulo curto exibido no card
pergunta: "Qual problema difícil este projeto responde?"
resumo: "Uma frase sobre o projeto, usada em descrições e compartilhamento."
stack: ["Java 21", "Spring Boot 4", "PostgreSQL"]
links:
  aoVivo: "https://..."       # opcional; sem ele o card não mostra o selo "No ar"
  docs: "https://..."         # opcional; documentação da API (Swagger)
  codigo: "https://github.com/alcantarajv/..."
ordem: 4                      # posição na página, do menor para o maior
publicado: true               # false tira o projeto do site sem apagar o arquivo
---

O raciocínio do projeto, em Markdown: o problema, as alternativas descartadas e um trecho de código.
```

O schema está em `src/content.config.ts`. Um campo obrigatório faltando, um campo com nome errado ou uma URL inválida fazem o `npm run check` e o `npm run build` falharem, então o erro aparece antes de chegar ao site no ar.

As decisões técnicas entram neste README conforme o site for construído.
