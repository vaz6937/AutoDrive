describe('Testes do Sistema de Venda de Veículos', () => {
  const imagemTeste = 'https://placehold.co/800x450?text=Toyota+Corolla';

  it('CT-E2E-01 - Deve carregar a página inicial e listar veículos', () => {
    cy.visit('/');
    cy.contains('Sistema de Gestão e Venda de Veículos').should('be.visible');
    cy.get('#lista-veiculos').should('exist');
    cy.get('#contador').should('be.visible');
  });

  it('CT-E2E-02 - Deve cadastrar um novo veículo e exibi-lo na lista', () => {
    const modelo = `Corolla Cypress ${Date.now()}`;

    cy.visit('/');

    cy.get('#marca').type('Toyota');
    cy.get('#modelo').type(modelo);
    cy.get('#ano').type('2022');
    cy.get('#preco').type('120000');
    cy.get('#cor').type('Prata');
    cy.get('#imagemUrl').type(imagemTeste);
    cy.get('#descricao').type('Veículo criado pelo teste E2E.');

    cy.get('#btn-cadastrar').click();

    cy.contains('Veículo cadastrado com sucesso!').should('be.visible');
    cy.contains('Toyota').should('be.visible');
    cy.contains(modelo).should('be.visible');

    cy.contains(modelo)
      .closest('.vehicle-card')
      .find('.btn-excluir')
      .click();

    cy.on('window:confirm', () => true);
  });

  it('CT-E2E-03 - Deve editar um veículo existente e depois excluí-lo', () => {
    const modeloInicial = `Honda E2E ${Date.now()}`;
    const modeloAtualizado = `${modeloInicial} Editado`;

    cy.request('POST', '/api/veiculos', {
      marca: 'Honda',
      modelo: modeloInicial,
      ano: 2021,
      preco: 110000,
      cor: 'Preto',
      descricao: 'Veículo criado para teste.',
      imagemUrl: imagemTeste
    }).then((response) => {
      expect(response.status).to.eq(201);

      cy.visit('/');

      cy.contains(modeloInicial)
        .closest('.vehicle-card')
        .find('.btn-editar')
        .click();

      cy.get('#modelo').clear().type(modeloAtualizado);
      cy.get('#btn-cadastrar').click();

      cy.contains('Veículo atualizado com sucesso!').should('be.visible');
      cy.contains(modeloAtualizado).should('be.visible');

      cy.contains(modeloAtualizado)
        .closest('.vehicle-card')
        .find('.btn-excluir')
        .click();

      cy.on('window:confirm', () => true);
      cy.contains(modeloAtualizado).should('not.exist');
    });
  });
});

describe('Testes de Integração da API', () => {
  const imagemTeste = 'https://placehold.co/800x450?text=Cypress';

  it('CT-API-01 - Deve criar veículo válido com status 201', () => {
    const modelo = `Civic API ${Date.now()}`;

    cy.request('POST', '/api/veiculos', {
      marca: 'Honda',
      modelo,
      ano: 2021,
      preco: 110000,
      cor: 'Preto',
      imagemUrl: imagemTeste
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.modelo).to.eq(modelo);

      cy.request('DELETE', `/api/veiculos/${response.body._id}`)
        .its('status')
        .should('eq', 200);
    });
  });

  it('CT-API-02 - Deve rejeitar veículo sem campos obrigatórios com status 400', () => {
    cy.request({
      method: 'POST',
      url: '/api/veiculos',
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('erro', 'Dados inválidos.');
      expect(response.body.campos).to.have.property('marca');
      expect(response.body.campos).to.have.property('modelo');
      expect(response.body.campos).to.have.property('ano');
      expect(response.body.campos).to.have.property('preco');
      expect(response.body.campos).to.have.property('cor');
      expect(response.body.campos).to.have.property('imagemUrl');
    });
  });

  it('CT-API-03 - Deve listar veículos com status 200 e retornar um array', () => {
    cy.request('GET', '/api/veiculos').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('CT-API-04 - Deve atualizar e excluir um veículo', () => {
    cy.request('POST', '/api/veiculos', {
      marca: 'Ford',
      modelo: `Mustang API ${Date.now()}`,
      ano: 2020,
      preco: 250000,
      cor: 'Azul',
      imagemUrl: imagemTeste
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(201);

      const id = createResponse.body._id;

      cy.request('PUT', `/api/veiculos/${id}`, {
        cor: 'Vermelho',
        preco: 260000
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.cor).to.eq('Vermelho');
        expect(updateResponse.body.preco).to.eq(260000);
      });

      cy.request('GET', `/api/veiculos/${id}`)
        .its('status')
        .should('eq', 200);

      cy.request('DELETE', `/api/veiculos/${id}`)
        .then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
          expect(deleteResponse.body).to.have.property('mensagem', 'Veículo removido com sucesso.');
        });
    });
  });
});
