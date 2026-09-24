---
titulo: "Encurtador de Links"
foco: "latência"
pergunta: "Como servir o redirecionamento, que é o endpoint de maior tráfego, sem que cada acesso custe uma ida ao banco?"
resumo: "API REST de encurtamento de links com redirecionamento de baixa latência, cache em Redis e registro assíncrono de cliques."
stack: ["Java 21", "Spring Boot 4", "PostgreSQL", "Redis", "Flyway", "Docker", "GitHub Actions"]
links:
  aoVivo: "https://encurtador-links-rudi.onrender.com"
  codigo: "https://github.com/alcantarajv/encurtador-links"
ordem: 1
publicado: true
---

O redirecionamento é o caminho mais quente da aplicação: ele precisa responder em poucos milissegundos e ainda registrar dados de acesso. Servi as buscas por cache em Redis e joguei o registro de cliques para fora do fluxo da resposta, de forma assíncrona — a coleta de métricas não cobra nada do usuário que clicou.

O código curto é aleatório em Base62, e não o id do banco convertido. Converter o id nunca colide, mas torna os links enumeráveis: quem recebe o link `2` tenta o `3` e varre o acervo inteiro do serviço. O aleatório custa uma consulta a mais para checar colisão, e um índice único no banco fecha a janela de corrida que a checagem em Java deixa aberta.
