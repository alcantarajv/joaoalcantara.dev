# joaoalcantara.dev

Site pessoal de João Vitor Alcântara Corrêa, desenvolvedor backend (Java e Spring Boot).

Reúne os projetos de portfólio, as formas de contato e o currículo em PDF. Endereço: **https://joaoalcantara.dev** (em construção).

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
npm run preview   # serve o conteúdo de dist/ localmente
```

Como adicionar um projeto e as decisões técnicas entram neste README conforme o site for construído.
