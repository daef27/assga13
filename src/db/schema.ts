// src/db/schema.ts
import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

// Tabela de Usuários (Integrada com Firebase Auth UID)
export const users = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  nome: text('nome'),
  role: text('role').default('associado').notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

// Tabela de Arquivos & Uploads (Caminhos em disco / metadados seguros)
export const arquivos = pgTable('arquivos', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id').references(() => users.id),
  nomeArquivo: text('nome_arquivo').notNull(),
  caminho: text('caminho').notNull(),
  tamanho: integer('tamanho'),
  tipoMime: text('tipo_mime'),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

// Tabela de Associados
export const associadosTable = pgTable('associados', {
  id: serial('id').primaryKey(),
  matricula: text('matricula').notNull().unique(),
  nome: text('nome').notNull(),
  cpf: text('cpf').notNull().unique(),
  rg: text('rg'),
  dataNascimento: text('data_nascimento').notNull(),
  genero: text('genero').notNull(),
  email: text('email').notNull(),
  telefone: text('telefone').notNull(),
  cep: text('cep'),
  endereco: text('endereco'),
  numero: text('numero'),
  bairro: text('bairro'),
  cidade: text('cidade').notNull(),
  estado: text('estado').notNull(),
  categoria: text('categoria').notNull(),
  modalidadePrincipal: text('modalidade_principal').notNull(),
  status: text('status').default('Ativo').notNull(),
  dataAssociacao: text('data_associacao').notNull(),
  validadeCarteirinha: text('validade_carteirinha').notNull(),
  fotoUrl: text('foto_url'),
  possuiPerdaAuditiva: boolean('possui_perda_auditiva').default(true),
  grauPerda: text('grau_perda'),
  comunicacaoPreferencial: text('comunicacao_preferencial').default('LIBRAS'),
});

// Tabela de Mensalidades
export const mensalidadesTable = pgTable('mensalidades', {
  id: serial('id').primaryKey(),
  associadoId: integer('associado_id').references(() => associadosTable.id).notNull(),
  mesReferencia: integer('mes_referencia').notNull(),
  anoReferencia: integer('ano_referencia').notNull(),
  valor: numeric('valor', { precision: 10, scale: 2 }).notNull(),
  dataPagamento: text('data_pagamento').notNull(),
  status: text('status').default('Pago').notNull(),
  formaPagamento: text('forma_pagamento').default('PIX').notNull(),
  comprovanteUrl: text('comprovante_url'),
  observacoes: text('observacoes'),
});

// Tabela de Eventos
export const eventosTable = pgTable('eventos', {
  id: serial('id').primaryKey(),
  titulo: text('titulo').notNull(),
  tipo: text('tipo').notNull(),
  dataInicio: text('data_inicio').notNull(),
  local: text('local').notNull(),
  descricao: text('descricao').notNull(),
  imagemUrl: text('imagem_url'),
  librasDisponivel: boolean('libras_disponivel').default(true),
  destaque: boolean('destaque').default(false),
  ativo: boolean('ativo').default(true),
});

// Tabela de Parceiros do Rodapé
export const parceirosTable = pgTable('parceiros', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  tipo: text('tipo').notNull(),
  logoUrl: text('logo_url').notNull(),
  linkUrl: text('link_url'),
  descricao: text('descricao'),
  ordem: integer('ordem').default(1).notNull(),
  ativo: boolean('ativo').default(true).notNull(),
});

// Tabela de Voluntários
export const voluntariosTable = pgTable('voluntarios', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull(),
  telefone: text('telefone').notNull(),
  idade: text('idade'),
  mensagem: text('mensagem').notNull(),
  dataCadastro: text('data_cadastro').notNull(),
  status: text('status').default('Novo').notNull(),
});

// Tabela de Contatos (Fale Conosco)
export const contatosTable = pgTable('contatos', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull(),
  telefone: text('telefone').notNull(),
  mensagem: text('mensagem').notNull(),
  dataEnvio: text('data_envio').notNull(),
  status: text('status').default('Pendente').notNull(),
});

// Relações Drizzle
export const usersRelations = relations(users, ({ many }) => ({
  arquivos: many(arquivos),
}));

export const arquivosRelations = relations(arquivos, ({ one }) => ({
  usuario: one(users, {
    fields: [arquivos.usuarioId],
    references: [users.id],
  }),
}));

export const associadosRelations = relations(associadosTable, ({ many }) => ({
  mensalidades: many(mensalidadesTable),
}));

export const mensalidadesRelations = relations(mensalidadesTable, ({ one }) => ({
  associado: one(associadosTable, {
    fields: [mensalidadesTable.associadoId],
    references: [associadosTable.id],
  }),
}));
