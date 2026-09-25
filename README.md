# joaoalcantara.dev

[![CI](https://github.com/alcantarajv/joaoalcantara.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/alcantarajv/joaoalcantara.dev/actions/workflows/ci.yml)

Site pessoal de João Vitor Alcântara Corrêa, desenvolvedor backend (Java e Spring Boot). No ar em **<https://joaoalcantara.dev>**.

Reúne os projetos de portfólio, cada um apresentado pela pergunta que responde e pelo raciocínio por trás da solução, além das formas de contato e do currículo em PDF.

---

## Stack

- [Astro](https://astro.build) gerando HTML estático, com TypeScript em modo estrito
- CSS puro com variáveis, sem framework de interface
- Fontes servidas pelo próprio site, via pacotes `@fontsource`
- Cloudflare Workers (static assets) com deploy pelo Workers Builds
- GitHub Actions para verificação de tipos, build e links quebrados
- Cloudflare Web Analytics, sem cookies

## Como rodar

Requer Node 22.12 ou mais recente (o CI e o deploy usam a versão de `.node-version`).

```bash
npm install
npm run dev       # servidor local em http://localhost:4321
npm run check     # verificação de tipos e do schema dos projetos
npm run build     # gera o site estático em dist/
npm run preview   # serve dist/ em http://localhost:8787 com as regras do Cloudflare (wrangler dev)
npm run links     # verifica links quebrados em dist/ (rode depois do build)
```

O CI roda `npm ci`, `check`, a verificação do PDF do currículo, `build` e `links` a cada push na `main`, em pull requests e toda segunda-feira, porque link externo quebra mesmo sem commit.

## Como adicionar um projeto

Crie um arquivo `.md` em `src/content/projetos/`. O nome do arquivo vira o identificador e o endereço do projeto (`meu-projeto.md` → `/projetos/meu-projeto`). A home, a página própria, o sitemap e a página 404 passam a incluí-lo sozinhos; nenhum HTML precisa ser editado.

```yaml
---
titulo: "Nome do Projeto"
foco: "latência"              # rótulo curto exibido no card
pergunta: "Qual problema difícil este projeto responde?"
resumo: "Uma frase sobre o projeto: aparece no card da home e na descrição da página."
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

O schema está em `src/content.config.ts`. Um campo obrigatório faltando, um campo com nome errado ou uma URL inválida fazem o `npm run check` e o `npm run build` falharem.

## Estrutura do projeto

```
src/
├── content/projetos/      # um .md por projeto
├── content.config.ts      # schema dos projetos
├── components/            # seções da home, card de projeto, botão de tema
├── layouts/Base.astro     # <head>, SEO, tema, fontes, moldura das páginas
├── pages/                 # home, /projetos/[slug] e 404
├── styles/                # tokens.css (cores e fontes) e global.css
└── consts.ts              # nome, e-mail e links usados em mais de um lugar
public/                    # currículo, imagem de compartilhamento, favicon, robots.txt, _headers
wrangler.jsonc             # configuração do Worker
linkinator.config.mjs      # verificação de links quebrados
```

## Decisões técnicas

**Site estático, não aplicação.** O Astro gera HTML no build e não envia JavaScript por padrão. No navegador rodam só o botão de tema e o script de métricas. Um framework de interface traria estado no cliente e dependências sem nenhum ganho para um site que não muda entre uma visita e outra.

**Content collections com schema.** Cada projeto é um arquivo Markdown validado no build (`astro:content` e Zod, com `strictObject`). Um erro de digitação no frontmatter quebra o build e não chega ao site no ar. Escrever os projetos direto no HTML faria de cada projeto novo uma edição de marcação.

**Fontes servidas pelo próprio site.** Bricolage Grotesque, IBM Plex Sans e IBM Plex Mono vêm dos pacotes `@fontsource` e saem no build com hash no nome, em cache por um ano (`public/_headers`). Sem o Google Fonts, não há conexão a outro domínio antes de o texto aparecer, nem o IP do visitante enviado a terceiros.

**Workers em vez de Pages.** A Cloudflare recomenda Workers para projetos novos, e o Pages está em manutenção. Com *static assets*, o Worker só serve os arquivos de `dist/`, sem código de servidor. O Workers Builds publica a cada push na `main` usando o acesso do app do GitHub, sem token de API guardado no repositório ou nos secrets.

**Endereços sem barra final.** O build gera `projetos/x.html` (`build.format: 'file'`) e a Cloudflare serve esse arquivo em `/projetos/x`, redirecionando `/projetos/x/` e `/projetos/x.html`. Assim o endereço público coincide com o canonical, sem redirecionamento a cada acesso.

**Por que o `.dev` só funciona com HTTPS.** Todo o TLD `.dev` está na lista de pré-carregamento HSTS dos navegadores: eles recusam abrir qualquer `.dev` por HTTP, sem nem tentar. A Cloudflare emite o certificado ao conectar o domínio, e até lá o site simplesmente não abre. É esperado nos primeiros minutos, não erro de configuração.

## Deploy

Cada push na `main` dispara o Workers Builds, que roda `npm run build` e publica `dist/` com `npx wrangler deploy`.

Configurado no painel da Cloudflare (fora do repositório):

- **Domínio:** `joaoalcantara.dev` registrado no Cloudflare Registrar, com renovação automática, e ligado ao Worker como *Custom Domain*. O endereço provisório `*.workers.dev` está desligado no `wrangler.jsonc`.
- **`www`:** registro `AAAA www 100::` com proxy ligado e uma *Redirect Rule* (`https://www.*` → `https://${1}`, 301, preservando a query string). O registro só existe para o `www` passar pela Cloudflare e a regra redirecionar.
- **HTTPS:** *Always Use HTTPS* ligado, para clientes que não usam a lista HSTS, como o `curl`.
- **E-mail:** Email Routing encaminhando `contato@joaoalcantara.dev` para o Gmail (registros MX, SPF e DKIM criados pela Cloudflare).
- **Métricas:** Web Analytics em modo de instalação manual. O script está em `src/layouts/Base.astro`, e o token (público) em `src/consts.ts`.

---

## Autor

**João Vitor Alcântara Corrêa**
[joaoalcantara.dev](https://joaoalcantara.dev) · [GitHub](https://github.com/alcantarajv) · [LinkedIn](https://linkedin.com/in/joaovalcantara)
