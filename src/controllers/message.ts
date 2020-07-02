/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import moment from 'moment';

import { successMessage, failMessage } from '~/helpers/handleResponse';
import {
  push,
  findByKey,
  notify,
  clearNotification,
} from '~/services/firebase';
import { notification } from '~/services/push';
import { Role } from '~/utils/constants';

import { Find, findAllByUser } from '../services/message';

export default {
  async create(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { id } = req.user.pessoa;
      const { pessoaId } = req.body;

      let message = await Find(id, pessoaId, req);
      if (!message) {
        const mensagemJson = {
          pessoa1: id,
          pessoa2: pessoaId,
        };
        message = await req.models.Mensagens.create(mensagemJson, {
          transaction: t,
        });

        await message.save({ transaction: t });
      }

      await t.commit();

      const mensagem = await Find(id, pessoaId, req);

      const data = {
        id: mensagem.id,
        name:
          mensagem.pessoa1 === id ? mensagem.pess2.nome : mensagem.pess1.nome,
        avatar:
          mensagem.pessoa1 === id
            ? mensagem.pess2.usuario.imageFileName
            : mensagem.pess1.usuario.imageFileName,
        professor:
          mensagem.pessoa1 === id
            ? mensagem.pess2.usuario.usuarioPerfilID === Role.Professor
            : mensagem.pess1.usuario.usuarioPerfilID === Role.Professor,
      };

      return res.send(successMessage(data));
    } catch (error) {
      await t.rollback();
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao criar mensagem', error)
        );
    }
  },
  async update(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { id } = req.params;
      const { content } = req.body;

      const mensagem = await req.models.Mensagens.findByPk(id, {
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
        transaction: t,
      });

      mensagem.ultimaMensagem = content;

      const isAuthor = mensagem.pess1.id === req.user.pessoa.id;

      if (isAuthor) {
        mensagem.pendentePor = 'pessoa1';
        notification.post('notifications', {
          app_id: 'c4401282-dd28-4cec-ae9f-e244d5c12758',
          contents: { en: content },
          headings: { en: mensagem.pess1.nome },
          include_external_user_ids: [mensagem.pess2.usuario.deviceIdentifier],
          android_group: mensagem.id,
          data: {
            id: mensagem.id,
            title: mensagem.pess1.nome,
            avatar: mensagem.pess1.usuario.imageFileName,
            professor:
              mensagem.pess1.usuario.usuarioPerfilID === Role.Professor,
          },
        });

        notify(mensagem.pessoa2, 'mensagem');
      } else {
        mensagem.pendentePor = 'pessoa2';
        notification.post('notifications', {
          app_id: 'c4401282-dd28-4cec-ae9f-e244d5c12758',
          contents: { en: content },
          headings: { en: mensagem.pess2.nome },
          include_external_user_ids: [mensagem.pess1.usuario.deviceIdentifier],
          android_group: mensagem.id,
          data: {
            id: mensagem.id,
            title: mensagem.pess2.nome,
            avatar: mensagem.pess2.usuario.imageFileName,
            professor:
              mensagem.pess2.usuario.usuarioPerfilID === Role.Professor,
          },
        });
        notify(mensagem.pessoa1, 'mensagem');
      }

      await mensagem.save({ transaction: t });
      await t.commit();

      const data = {
        userId: req.user.pessoa.id,
        time: moment(mensagem.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        content,
      };

      push(`messages/${mensagem.id}`, data);

      return res.send(successMessage(mensagem));
    } catch (error) {
      await t.rollback();
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao enviar mensagem', error)
        );
    }
  },
  async getMessageView(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const mensagem = await req.models.Mensagens.findByPk(id, {
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

      const messageList = findByKey(`messages/${id}`);

      const receiptMessage = mensagem.pess2.id === req.user.pessoa.id;

      const data = {
        id: receiptMessage ? mensagem.pess1.id : mensagem.pess2.id,
        name: receiptMessage ? mensagem.pess1.nome : mensagem.pess2.nome,
        messages: messageList,
      };

      return res.send(successMessage(data));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro buscar mensagem', error)
        );
    }
  },
  async updateStatus(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { id } = req.params;

      const mensagem = await req.models.Mensagens.findByPk(id, {
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
        transaction: t,
      });

      const pessoa1 = mensagem.pess1.id === req.user.pessoa.id;
      const pessoa2 = mensagem.pess2.id === req.user.pessoa.id;

      if (pessoa2 && mensagem.pendentePor === 'pessoa1') {
        mensagem.pendentePor = '';
        await mensagem.save({ transaction: t });
      }

      if (pessoa1 && mensagem.pendentePor === 'pessoa2') {
        mensagem.pendentePor = '';
        await mensagem.save({ transaction: t });
      }
      await t.commit();
      return res.send(successMessage('Atualizado com sucesso'));
    } catch (error) {
      await t.rollback();
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro ao atualizar status', error)
        );
    }
  },
  async messages(req: Request, res: Response) {
    try {
      clearNotification(req.user.pessoa.id, 'mensagem');
      const message = await findAllByUser(req.user.pessoa.id, req);

      return res.send(successMessage(message));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Erro buscar mensagem', error)
        );
    }
  },
};
