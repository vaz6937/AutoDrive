const express = require('express');

const {
  listarVeiculos,
  buscarVeiculo,
  criarVeiculo,
  atualizarVeiculo,
  excluirVeiculo
} = require('../controllers/vehicleController');

const router = express.Router();

router.get('/', listarVeiculos);
router.get('/:id', buscarVeiculo);
router.post('/', criarVeiculo);
router.put('/:id', atualizarVeiculo);
router.delete('/:id', excluirVeiculo);

module.exports = router;
