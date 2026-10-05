const mongoose = require('mongoose');
const Veiculo = require('../models/Veiculo');

function formatValidationError(error) {
  const campos = {};

  for (const [campo, detalhe] of Object.entries(error.errors || {})) {
    campos[campo] = detalhe.message;
  }

  return campos;
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function listarVeiculos(req, res) {
  try {
    const veiculos = await Veiculo.find().sort({ createdAt: -1 });
    return res.status(200).json(veiculos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar veículos.' });
  }
}

async function buscarVeiculo(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ erro: 'ID de veículo inválido.' });
    }

    const veiculo = await Veiculo.findById(req.params.id);

    if (!veiculo) {
      return res.status(404).json({ erro: 'Veículo não encontrado.' });
    }

    return res.status(200).json(veiculo);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar veículo.' });
  }
}

async function criarVeiculo(req, res) {
  try {
    const novoVeiculo = new Veiculo(req.body);
    const veiculoSalvo = await novoVeiculo.save();

    return res.status(201).json(veiculoSalvo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        erro: 'Dados inválidos.',
        campos: formatValidationError(error)
      });
    }

    return res.status(500).json({ erro: 'Erro ao cadastrar veículo.' });
  }
}

async function atualizarVeiculo(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ erro: 'ID de veículo inválido.' });
    }

    const veiculoAtualizado = await Veiculo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!veiculoAtualizado) {
      return res.status(404).json({ erro: 'Veículo não encontrado.' });
    }

    return res.status(200).json(veiculoAtualizado);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        erro: 'Dados inválidos.',
        campos: formatValidationError(error)
      });
    }

    return res.status(500).json({ erro: 'Erro ao atualizar veículo.' });
  }
}

async function excluirVeiculo(req, res) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ erro: 'ID de veículo inválido.' });
    }

    const veiculoExcluido = await Veiculo.findByIdAndDelete(req.params.id);

    if (!veiculoExcluido) {
      return res.status(404).json({ erro: 'Veículo não encontrado.' });
    }

    return res.status(200).json({
      mensagem: 'Veículo removido com sucesso.',
      id: veiculoExcluido._id
    });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao remover veículo.' });
  }
}

module.exports = {
  listarVeiculos,
  buscarVeiculo,
  criarVeiculo,
  atualizarVeiculo,
  excluirVeiculo
};
