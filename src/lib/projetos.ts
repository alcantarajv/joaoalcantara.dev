import { getCollection } from 'astro:content';

/** Projetos com `publicado: true`, na ordem definida pelo campo `ordem`. */
export async function projetosPublicados() {
	const projetos = await getCollection('projetos', ({ data }) => data.publicado);
	return projetos.sort((a, b) => a.data.ordem - b.data.ordem);
}
