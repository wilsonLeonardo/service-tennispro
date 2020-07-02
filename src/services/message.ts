import { Request } from 'express';
import { Op } from 'sequelize';

import { Role } from '~/utils/constants';

export async function Find(pessoa1: number, pessoa2: number, req: Request) {
  let mensagem = await req.models.Mensagens.findOne({
    where: { [Op.and]: [{ pessoa1 }, { pessoa2 }] },
    include: [
      {
        model: req.models.Pessoa,
        as: 'pess1',
        include: [req.models.Usuario],
      },
      {
        model: req.models.Pessoa,
        as: 'pess2',
        include: [req.models.Usuario],
      },
    ],
  });

  if (!mensagem) {
    mensagem = await req.models.Mensagens.findOne({
      where: { [Op.and]: [{ pessoa2: pessoa1 }, { pessoa1: pessoa2 }] },
      include: [
        {
          model: req.models.Pessoa,
          as: 'pess1',
          include: [req.models.Usuario],
        },
        {
          model: req.models.Pessoa,
          as: 'pess2',
          include: [req.models.Usuario],
        },
      ],
    });
  }
  return mensagem;
}

export async function receiptMessages(userId: number, req: Request) {
  const message = await req.models.Mensagens.findAll({
    where: { pessoa1: userId },
    include: [
      {
        model: req.models.Pessoa,
        as: 'pess2',
        include: [req.models.Usuario],
      },
    ],
    order: [['updatedAt', 'DESC']],
  });

  const data = [];
  message.forEach(messages => {
    data.push({
      id: messages.id,
      avatar: messages.pess2.usuario.imageFileName,
      name: messages.pess2.nome,
      lastMessage: messages.ultimaMensagem,
      updatedAt: messages.updatedAt,
      pending: messages.pendentePor === 'pessoa2',
      professor:
        messages.pessoa1 === req.user.pessoa.id
          ? messages.pess2.usuario.usuarioPerfilID === Role.Professor
          : messages.pess1.usuario.usuarioPerfilID === Role.Professor,
    });
  });

  return data;
}

export async function sentMessages(userId: number, req: Request) {
  const message = await req.models.Mensagens.findAll({
    where: { pessoa2: userId },
    include: [
      {
        model: req.models.Pessoa,
        as: 'pess1',
        include: [req.models.Usuario],
      },
    ],
    order: [['updatedAt', 'DESC']],
  });

  const data = [];
  message.forEach(messages => {
    data.push({
      id: messages.id,
      avatar: messages.pess1.usuario.imageFileName,
      name: messages.pess1.nome,
      lastMessage: messages.ultimaMensagem,
      updatedAt: messages.updatedAt,
      pending: messages.pendentePor === 'pessoa1',
      professor:
        messages.pessoa1 === req.user.pessoa.id
          ? messages.pess2.usuario.usuarioPerfilID === Role.Professor
          : messages.pess1.usuario.usuarioPerfilID === Role.Professor,
    });
  });

  return data;
}

export async function findAllByUser(userId: number, req: Request) {
  const mensagens = sentMessages(userId, req);

  (await receiptMessages(userId, req)).forEach(async message => {
    (await mensagens).push(message);
  });

  return mensagens;
}
