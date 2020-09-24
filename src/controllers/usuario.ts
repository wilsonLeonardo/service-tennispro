import cep from 'cep-promise';
import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { successMessage, failMessage } from '~/helpers/handleResponse';
import { genToken } from '~/services/token';
import { Role } from '~/utils/constants';

export default {
  async create(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const step1 = req.body.Step1;

      const dataLimitePlano = new Date();

      if (step1.plano === 1)
        dataLimitePlano.setFullYear(dataLimitePlano.getFullYear() + 1);
      else if (step1.plano === 2)
        dataLimitePlano.setMonth(dataLimitePlano.getMonth() + 6);
      else if (step1.plano === 3)
        dataLimitePlano.setMonth(dataLimitePlano.getMonth() + 1);

      const usuarioJson = {
        login: step1.email,
        senha: step1.senha,
        usuarioPerfilID: Role.Usuario,
      };
      const usuario = await req.models.Usuario.create(usuarioJson, {
        transaction: t,
      });

      let dataNascimento = null;
      if (step1.nascimento) {
        const dataFormatada = `${step1.nascimento.substring(
          3,
          6
        )}${step1.nascimento.substring(0, 3)}${step1.nascimento.substring(6)}`;

        dataNascimento = new Date(dataFormatada);
      }

      const pessoaJson = {
        nome: step1.nome,
        sexo:
        step1.sexo === '1' //eslint-disable-line
            ? 'Masculino'
            : step1.sexo === '2'
            ? 'Feminino'
            : null,
        dataNascimento,
        email: step1.email,
        usuarioID: usuario.id,
        planoId: step1.plano,
        nivelId: step1.nivel,
        dataLimitePlano,
      };

      const pessoa = await req.models.Pessoa.create(pessoaJson, {
        transaction: t,
      });

      const myCep = await cep(step1.cep);

      const enderecoJson = {
        cep: myCep.cep,
        estado: myCep.state,
        bairro: myCep.neighborhood,
        cidade: myCep.city,
        pessoaID: pessoa.id,
      };

      await req.models.Endereco.create(enderecoJson, {
        transaction: t,
      });

      const clubeJson = {
        clubeID: step1.clube,
        pessoaID: pessoa.id,
      };

      await req.models.PessoaClubes.create(clubeJson, {
        transaction: t,
      });

      await t.commit();

      const token = genToken(usuario);

      return res.send(
        successMessage(
          await req.models.Usuario.findByPk(usuario.id, {
            include: [
              {
                model: req.models.Pessoa,
                include: [
                  req.models.Telefone,
                  req.models.Endereco,
                  {
                    model: req.models.PessoaClubes,
                    include: ['clube'],
                  },
                ],
              },
              {
                model: req.models.UsuarioPerfil,
              },
            ],
          }),
          { message: 'Usuário cadastrado com sucesso', token },
          HttpStatus.CREATED
        )
      );
    } catch (error) {
      await t.rollback();

      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao cadastrar usuário',
            error
          )
        );
    }
  },
  async update(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { id } = req.user.pessoa;
      const { data, clube } = req.body;

      if (clube) {
        const pessoaID = req.user.pessoa.id;

        const all = await req.models.PessoaClubes.findAll({
          where: { pessoaID },
        });

        all.forEach(async x => {
          if (clube.map(y => y.clube.id).indexOf(x.clubeID) === -1) {
            await x.destroy({ transaction: t });
          }
        });
        clube.forEach(async x => {
          const exist = await req.models.PessoaClubes.findOne({
            where: { clubeID: x.clube.id, pessoaID },
            include: ['clube'],
          });

          if (!exist) {
            const clubeJson = {
              clubeID: x.clube.id,
              pessoaID,
            };

            await req.models.PessoaClubes.create(clubeJson, {
              transaction: t,
            });
          }
        });
      }

      const pessoa = await req.models.Pessoa.findByPk(id, { transaction: t });
      const endereco = await req.models.Endereco.findOne({
        where: { pessoaID: pessoa.id },
      });

      pessoa.nome = data.nome;
      pessoa.professorPreco = data.preco || pessoa.professorPreco;

      const myCep = await cep(data.cep);

      endereco.cep = myCep.cep;
      endereco.cidade = myCep.city;
      endereco.estado = myCep.state;
      endereco.bairro = myCep.neighborhood;

      await endereco.save({ transaction: t });
      await pessoa.save({ transaction: t });

      await t.commit();

      return res.send(
        successMessage({ message: 'Dados atualizados com sucesso' })
      );
    } catch (error) {
      await t.rollback();
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Erro ao atualizar usuário'));
    }
  },
  async updateClube(req: Request, res: Response) {
    const t = await req.database.transaction();
    try {
      const { id } = req.user.clube;
      const { data } = req.body;
      const clube = await req.models.Clube.findByPk(id, { transaction: t });
      const endereco = await req.models.EnderecoClube.findOne({
        where: { clubeID: clube.id },
      });
      const telefone = await req.models.TelefoneClube.findOne({
        where: { clubeID: clube.id },
      });

      clube.nome = data.nome;
      clube.quadras = data.quadras || 0;
      clube.mensalidade = data.mensalidade;
      clube.aluguel = data.aluguel;

      const myCep = await cep(data.cep);

      endereco.cep = myCep.cep;
      endereco.cidade = myCep.city;
      endereco.estado = myCep.state;
      endereco.bairro = myCep.neighborhood;

      telefone.telefone = data.telefone;

      await endereco.save({ transaction: t });
      await clube.save({ transaction: t });
      await telefone.save({ transaction: t });

      await t.commit();

      return res.send(
        successMessage({ message: 'Dados atualizados com sucesso' })
      );
    } catch (error) {
      await t.rollback();
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Erro ao atualizar usuário'));
    }
  },
  async profile(req: Request, res: Response) {
    try {
      if (req.user && req.user.id) {
        const user = await req.models.Usuario.findByPk(req.user.id, {
          attributes: [
            'id',
            'login',
            'active',
            'imageFileName',
            'usuarioPerfilID',
            'createdAt',
            'updatedAt',
            'deletedAt',
          ],
          include: [
            {
              model: req.models.Pessoa,
              include: [
                req.models.Telefone,
                req.models.Endereco,
                {
                  model: req.models.PessoaClubes,
                  include: ['clube'],
                },
              ],
            },
            {
              model: req.models.UsuarioPerfil,
            },
            {
              model: req.models.Clube,
              include: [req.models.TelefoneClube, req.models.EnderecoClube],
            },
          ],
        });
        return res.send(successMessage(user));
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(
          failMessage(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'Falha ao encontrar usuário'
          )
        );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Falha ao retornar perfil'));
    }
  },
  async setAvatar(req: Request, res: Response) {
    try {
      const user = await req.models.Usuario.findByPk(req.user.id);
      if (!user) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(failMessage(HttpStatus.BAD_REQUEST, 'Usuário não encontrado'));
      }

      if (req.file === undefined) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send(
            failMessage(
              HttpStatus.BAD_REQUEST,
              'Não é possível definir uma imagem inexistente'
            )
          );
      }

      user.imageFileName = (req.file as any).location;
      const newUser = await user.save();
      return res.send(successMessage(newUser));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Falha ao alterar avatar'));
    }
  },
  async meusCampeonatos(req: Request, res: Response) {
    try {
      const campeonatos = await req.models.PessoaCampeonatos.findAll({
        where: { pessoaId: req.user.pessoa.id },
        include: [
          {
            model: req.models.ClubeCampeonato,
            where: { statusId: 1 },
            include: [
              {
                model: req.models.Clube,
                include: ['endereco'],
              },
              {
                model: req.models.ClubeCampeonatoNiveis,
                include: ['nivel'],
              },
            ],
          },
        ],
      });

      return res.send(successMessage(campeonatos));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar campeonatos encerrados',
            error
          )
        );
    }
  },
  async meusCampeonatosConcluidos(req: Request, res: Response) {
    try {
      const campeonatos = await req.models.PessoaCampeonatos.findAll({
        where: { pessoaId: req.user.pessoa.id },
        include: [
          {
            model: req.models.ClubeCampeonato,
            where: { statusId: 2 },
            include: [
              {
                model: req.models.Clube,
                include: ['endereco'],
              },
              {
                model: req.models.ClubeCampeonatoNiveis,
                include: ['nivel'],
              },
            ],
          },
        ],
      });

      return res.send(successMessage(campeonatos));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(
            HttpStatus.BAD_REQUEST,
            'Erro ao encontrar campeonatos encerrados',
            error
          )
        );
    }
  },
  async findByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const user = await req.models.Usuario.findOne({
        where: { login: email },
      });

      return user
        ? res.send(successMessage(user))
        : res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send(
              failMessage(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Usuário não encontrado'
              )
            );
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          failMessage(HttpStatus.BAD_REQUEST, 'Falha ao buscar usuário', error)
        );
    }
  },
  async deviceIdentifier(req: Request, res: Response) {
    try {
      const { device } = req.params;

      const user = await req.models.Usuario.findByPk(req.user.id);

      user.deviceIdentifier = device;

      await user.save();

      return res.send(successMessage('Device id atualizado com sucesso'));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(failMessage(HttpStatus.BAD_REQUEST, 'Falha ao encontrar token'));
    }
  },
};
