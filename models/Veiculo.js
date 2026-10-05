const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const urlValida = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const veiculoSchema = new mongoose.Schema(
  {
    marca: {
      type: String,
      required: [true, 'Marca é obrigatória.'],
      trim: true,
      minlength: [2, 'Marca deve possuir pelo menos 2 caracteres.']
    },
    modelo: {
      type: String,
      required: [true, 'Modelo é obrigatório.'],
      trim: true,
      minlength: [1, 'Modelo é obrigatório.']
    },
    ano: {
      type: Number,
      required: [true, 'Ano é obrigatório.'],
      min: [1900, 'Ano deve ser no mínimo 1900.'],
      max: [currentYear, `Ano não pode ser maior que ${currentYear}.`],
      validate: {
        validator: Number.isInteger,
        message: 'Ano deve ser um número inteiro.'
      }
    },
    preco: {
      type: Number,
      required: [true, 'Preço é obrigatório.'],
      min: [0.01, 'Preço deve ser maior que zero.']
    },
    cor: {
      type: String,
      required: [true, 'Cor é obrigatória.'],
      trim: true,
      minlength: [2, 'Cor deve possuir pelo menos 2 caracteres.']
    },
    descricao: {
      type: String,
      trim: true,
      default: ''
    },
    imagemUrl: {
      type: String,
      required: [true, 'URL da imagem é obrigatória.'],
      trim: true,
      validate: {
        validator: urlValida,
        message: 'imagemUrl deve ser uma URL válida iniciada por http:// ou https://.'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Veiculo', veiculoSchema);
