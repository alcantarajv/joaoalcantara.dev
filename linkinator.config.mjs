// Verificação de links quebrados (npm run links), rodada depois do build no CI e localmente.
// O linkinator sobe um servidor em dist/, abre a home e segue todos os links do site.

export default {
	recurse: true, // segue os links internos e verifica cada página encontrada
	cleanUrls: true, // /projetos/x resolve para x.html, como no Cloudflare
	checkFragments: true, // /#projetos só passa se existir id="projetos" na página

	// As aplicações no Render hibernam e levam até um minuto e meio para acordar; enquanto isso
	// respondem 503. Tenta de novo algumas vezes e, se continuar 503, avisa sem reprovar:
	// 503 é "indisponível agora", não link quebrado. Um 404 (endereço errado) continua reprovando.
	timeout: 90_000,
	retryErrors: true,
	retryErrorsCount: 3,
	statusCodes: { 503: 'warn' },

	skip: [
		// O próprio domínio aparece no canonical e no Open Graph. Os links internos já são
		// verificados no servidor local; testar o domínio no ar validaria a versão anterior do site.
		'^https://joaoalcantara\\.dev',
		// O LinkedIn responde 999 a qualquer acesso automatizado, mesmo com o perfil no ar.
		'linkedin\\.com',
	],
};
