---
titulo: "Reserva de Quadras"
foco: "concorrência"
pergunta: "O que acontece se duas pessoas clicarem em “reservar” na mesma quadra, no mesmo horário, no mesmo instante?"
resumo: "API REST de reserva de quadras com controle de concorrência no PostgreSQL."
stack: ["Java 21", "Spring Boot 4", "Spring Security", "JWT", "PostgreSQL", "Testcontainers"]
links:
  aoVivo: "https://reserva-quadras.onrender.com"
  docs: "https://reserva-quadras.onrender.com/swagger-ui.html"
  codigo: "https://github.com/alcantarajv/reserva-quadras"
ordem: 2
publicado: true
---

A resposta intuitiva — consultar se está livre e então gravar — não resolve. Existe uma janela entre a consulta e a gravação, e dentro dela a outra requisição também consultou, também viu livre, e também vai gravar.

Lock otimista não serve, porque o conflito é entre linhas diferentes que se sobrepõem no tempo, não entre duas versões da mesma linha. Lock pessimista na quadra resolve, mas serializa até as reservas que não conflitam entre si. A garantia foi para o único lugar sem janela de corrida:

```sql
-- reservas não podem se sobrepor na mesma quadra
ALTER TABLE reservas ADD CONSTRAINT reservas_sem_sobreposicao
  EXCLUDE USING gist (
    quadra_id WITH =,
    tstzrange(inicio, fim, '[)') WITH &&
  ) WHERE (status <> 'CANCELADA');
```

Para não parar na afirmação, há um teste que dispara várias threads disputando o mesmo horário e verifica que exatamente uma reserva vence.
