// src/db/users.ts
import { db } from './index.ts';
import { users, arquivos } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, nome?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        nome: nome || '',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(nome ? { nome } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Falha ao registrar/obter usuário no Cloud SQL:', error);
    throw new Error('Falha ao processar cadastro de usuário no banco de dados.', { cause: error });
  }
}

export async function registrarArquivo(dados: {
  usuarioId?: number | null;
  nomeArquivo: string;
  caminho: string;
  tamanho?: number;
  tipoMime?: string;
}) {
  try {
    const result = await db.insert(arquivos)
      .values({
        usuarioId: dados.usuarioId || null,
        nomeArquivo: dados.nomeArquivo,
        caminho: dados.caminho,
        tamanho: dados.tamanho || null,
        tipoMime: dados.tipoMime || null,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Falha ao registrar arquivo no banco SQL:', error);
    throw new Error('Falha ao registrar metadados do arquivo no SQL.', { cause: error });
  }
}

export async function listarArquivos() {
  try {
    return await db.select().from(arquivos).orderBy(desc(arquivos.criadoEm));
  } catch (error) {
    console.error('Falha ao listar arquivos no SQL:', error);
    return [];
  }
}
