import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada arquivo .md em src/content/projetos/ é um projeto. O nome do arquivo vira o id
// (usado na âncora da home e, na Etapa 5, na URL /projetos/<id>).
//
// strictObject: um campo com nome errado (ex.: "aovivo") quebra o build em vez de ser
// ignorado em silêncio.
const projetos = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
	schema: z.strictObject({
		titulo: z.string().min(1),
		foco: z.string().min(1), // rótulo curto exibido no card e na sequência dos projetos
		pergunta: z.string().min(1), // o problema que o projeto responde
		resumo: z.string().min(1), // uma frase: meta description e compartilhamento
		stack: z.array(z.string().min(1)).min(1),
		links: z.strictObject({
			aoVivo: z.url().optional(), // sem ele, o card não mostra o selo "No ar"
			docs: z.url().optional(), // documentação da API (Swagger), se houver
			codigo: z.url(),
		}),
		ordem: z.number().int(), // posição na home, do menor para o maior
		publicado: z.boolean().default(true), // false tira o projeto do site sem apagar o arquivo
	}),
});

export const collections = { projetos };
