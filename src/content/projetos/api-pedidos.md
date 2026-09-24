---
titulo: "API de Pedidos e Pagamentos"
foco: "consistência"
pergunta: "O gateway de pagamento avisa duas vezes que o mesmo pedido foi pago. E se a fila cair logo depois do banco confirmar?"
resumo: "API REST de pedidos com pagamento por gateway externo, webhooks idempotentes e padrão outbox com RabbitMQ."
stack: ["Java 21", "Spring Boot 4", "RabbitMQ", "Stripe", "PostgreSQL", "Testcontainers", "WireMock"]
links:
  aoVivo: "https://api-pedidos-yi5d.onrender.com"
  docs: "https://api-pedidos-yi5d.onrender.com/swagger-ui.html"
  codigo: "https://github.com/alcantarajv/api-pedidos"
ordem: 3
publicado: true
---

Webhooks de pagamento são entregues “pelo menos uma vez” — a repetição faz parte do contrato, não é falha. Cada evento recebido tem o id registrado numa tabela com restrição de unicidade, na mesma transação que aplica o efeito. A segunda entrega colide ali e é descartada; em teste, doze entregas simultâneas do mesmo evento produzem um único efeito.

O segundo problema é que gravar o pedido e publicar o evento na fila são operações em sistemas diferentes, sem transação comum — qualquer ordem pode deixar um dos lados para trás. Com o padrão outbox, o evento é gravado numa tabela do próprio banco junto com o pedido, e um worker separado cuida da publicação:

<pre><span class="c">POST /webhooks/stripe</span>          <span class="c">-- assinatura verificada antes de tudo</span>
<span class="k">BEGIN</span>
  <span class="k">INSERT INTO</span> eventos_processados (evento_id)  <span class="c">-- 2ª entrega colide aqui</span>
  <span class="k">UPDATE</span> pedidos <span class="k">SET</span> status = <span class="c">'PAGO'</span>
  <span class="k">INSERT INTO</span> outbox (tipo, payload)         <span class="c">-- mesmo commit do pedido</span>
<span class="k">COMMIT</span>

<span class="c">worker:</span> lê outbox → publica no RabbitMQ → marca entregue
<span class="c">consumidor:</span> idempotente, porque a entrega é “pelo menos uma vez”</pre>

Troquei a promessa de “entrega exatamente uma vez”, que não existe entre sistemas distribuídos, por “pelo menos uma vez com consumidores idempotentes” — que é como integrações reais funcionam.
