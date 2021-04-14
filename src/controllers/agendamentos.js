//***************************************************************************//
//             Configuração dos Controllers da API Agendamentos.             //
//***************************************************************************//

// Import do schema de agendamentos:
const agendamentos = require('../models/agendamentos');
const agendamentosSchema = require('../models/agendamentos');

// Import do schema de pessoas:
const pessoasSchema = require('../models/pessoas');

// Import do scheme de unidades:
const unidadesSchema = require('../models/unidades');


exports.adicionarAgendamento = (req, res) => {
    let pDtHoraAgendamento = req.body.dthora_agendamento;
    let pIdPessoa = req.body.pessoa_id;
    let pIdUnidade = req.body.unidade_id;

    // Tema algum agendamento no mesmo dia e horário?
    agendamentosSchema.countDocuments({
        dthora_agendamento: pDtHoraAgendamento
    }, (err, count) => {
        if (err || count > 0) {
            console.log("Horário de agendamento já selecionado..");
            res.json({
                status: "erro",
                message: "Horário de agendamento já selecionado.."
            })
        } else {
            // Existe pessoa com o ID informado?
            pessoasSchema.findById(pIdPessoa, (err, pessoa) => {
                if (err || !pessoa) {
                    console.log("O ID informado não existe.");
                    res.json({
                        status: "erro",
                        message: "O ID informado não existe."
                    })
                } else {
                    // Existe unidade com o ID informado?
                    unidadesSchema.findById(pIdUnidade, (err, unidade) => {
                        if (err || !unidade) {
                            console.log("Não existe unidade com o ID informado.");
                            res.json({
                                status: "erro",
                                message: "Não existe unidade com o ID informado."
                            });
                        } else {
                            // Se sim vai inserir o agendamento:
                            let novoAgendamento = new agendamentosSchema();
                            novoAgendamento.pessoa_id = req.body.pessoa_id;
                            novoAgendamento.unidade_id = req.body.unidade_id;
                            novoAgendamento.dthora_agendamento = req.body.dthora_agendamento;
                            novoAgendamento.necessidades_especiais_agendamento = req.body.necessidades_especiais_agendamento;
                            novoAgendamento.observacoes_agendamento = req.body.observacoes_agendamento;
                            novoAgendamento.save((err) => {
                                if (err) {
                                    console.log("Erro! Não foi possível inserir o agendamento.");
                                    res.json({
                                        status: "erro",
                                        message: "Erro! Não foi possível inserir o agendamento.",
                                        erro: err
                                    });
                                } else {
                                    console.log("Agendamento inserido!")
                                    res.json({
                                        status: "ok",
                                        message: "Agendamento inserido!"
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
         
//***************Lista todos os agendamentos***************
exports.listarAgendamentos = (req, res) => {
    agendamentosSchema.find(function(err, agendamentos) {
        if (err) {
            console.log("Não foi possível listar os agendamentos!");
            res.json({
                status: "erro",
                message: "Não foi possível listar os agendamentos!"
            });
        } else {
            res.json({
                status: "ok",
                agendamentos: agendamentos
            });
        }
    });
}

//***************Lista um agendamento por ID***************
exports.listarAgendamentoPorId = (req, res) => {
    let id_agendamento = req.params.id;

    agendamentosSchema.findById(id_agendamento, function(err, agendamento) {
        if (err || !agendamento) {
            console.log(`Agendamento com o ID ${id_agendamento} não encontrado.`);
            res.json({
                status: "erro",
                message: `Agendamento com o ID ${id_agendamento} não encontrado.`
            });
        } else {
            res.json({
                status: "ok",
                agendamento: agendamento
            });
        }
    });
}

//***************Listar agendamentos por pessoa (busca feita pelo ID da pessoa)***************
exports.listarAgendamentoPorPessoa = (req, res) => {
    let id_pessoa = req.params.pessoa_id;

    pessoasSchema.findById(id_pessoa, (err, pessoa) => {
        if (err || !pessoa) {
            console.log("Não foi possível encontrar a pessoa com o ID informado.");
            res.json({
                status: "erro",
                message: "Não foi possível encontrar a pessoa com o ID informado."
            });
        } else {
            agendamentosSchema.find({pessoa_id: id_pessoa}, (err, agendamentos) => {
                if (err || !agendamentos) {
                    console.log("Não há agendamentos para a pessoa informada.");
                    res.json({
                        status: "erro",
                        message: "Não há agendamentos para a pessoa informada."
                    });
                } else {
                    console.log("Agendamentos listados.");
                    res.json({
                        status: "ok",
                        message: `Agendamentos para a pessoa: ${id_pessoa}`,
                        agendamentos: agendamentos
                    });
                }
            });
        }
    })
}

//***************Lista agendamentos por unidade (busca feita pelo ID da unidade)***************
exports.listarAgendamentoPorUnidade = (req, res) => {
    let id_unidade = req.params.unidade_id;

    unidadesSchema.findById(id_unidade, (err, unidade) => {
        if (err || !unidade) {
            console.log("Não foi possível encontrar a unidade com o ID informado.");
            res.json({
                status: "erro",
                message: "Não foi possível encontrar a unidade com o ID informado."
            });
        } else {
            agendamentosSchema.find({unidade_id: id_unidade}, (err, agendamentos) => {
                if (err || !agendamentos) {
                    console.log("Não há agendamentos para esta unidade.");
                    res.json({
                        status: "erro",
                        message: "Não há agendamentos para esta unidade."
                    });
                } else {
                    console.log("Agendamentos listados.");
                    res.json({
                        status: "ok",
                        message: `Agendamentos para a unidade: ${id_unidade}`,
                        agendamentos: agendamentos
                    });
                }
            });
        }
    })
}

// ***************Faz a atualização de um agendamento (busca feita por ID)***************
// ***************Valida se alterações no ID é válida.***************
exports.atualizarAgendamento = (req, res) => {
    let id_agendamento = req.params.id;

    agendamentosSchema.findById(id_agendamento, (err, agendamento) => {
        if (err || !agendamento) {
            console.log(`Não foi possível listar o agendamento com o ID ${id_agendamento} para atualização.`);
            res.json({
                status: "erro",
                message: `Não foi possível listar o agendamento com o ID ${id_agendamento} para atualização.`
            });
        } else {
            pessoasSchema.findById(req.body.pessoa_id, function(err, pessoa){
                if (err || !pessoa) {
                    console.log("Não existe pessoa com o ID informado.");
                    res.json({
                        status: "erro",
                        message: "Não existe pessoa com o ID informado."
                    });
                } else {
                    unidadesSchema.findById(req.body.unidade_id, function(err, unidade){
                        if (err || !unidade) {
                            console.log("Não existe unidade com o ID informado.");
                            res.json({
                                status: "erro",
                                message: "Não existe unidade com o ID informado."
                            });
                        } else {
                            agendamento.pessoa_id = req.body.pessoa_id;
                            agendamento.unidade_id = req.body.unidade_id;
                            agendamento.data_hora_agendamento = req.body.data_hora_agendamento;
                            agendamento.necessidades_especiais_agendamento = req.body.necessidades_especiais_agendamento;
                            agendamento.observacoes_agendamento = req.body.observacoes_agendamento;
                            agendamento.save((err) => {
                                if (err) {
                                    console.log(`Erro ao atualizar o agendamento de ID ${id_agendamento}.`);
                                    res.json({
                                        status: "erro",
                                        message: `Erro ao atualizar o agendamento de ID ${id_agendamento}.`,
                                        erro: err
                                    });
                                } else {
                                    console.log(`Agendamento com o ID ${id_agendamento} atualizado com sucesso!`);
                                    res.json({
                                        status: "ok",
                                        message: `Agendamento com o ID ${id_agendamento} atualizado com sucesso!`
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// ***************Remover um agendamento do banco com busca feita por ID:***************
exports.removerAgendamento = (req, res) => {
    let id_agendamento = req.params.id;

    agendamentosSchema.findById(id_agendamento, (err, agendamento) => {
        if (err || !agendamento) {
            console.log(`Agendamento com o ID ${id_agendamento} não encontrado.`);
            res.json({
                status: "erro",
                message: `Agendamento com o ${id_agendamento} não encontrado.`
            });
            return;
        } else {
            agendamentosSchema.deleteOne({
                _id: id_agendamento
            }, (err) => {
                if (err) {
                    console.log("Erro ao remover o agendamento.");
                    res.json({
                        status: "erro",
                        message: "Erro ao remover o agendamento."
                    });
                } else {
                    console.log("Agendamento removido com sucesso!")
                    res.json({
                        status: "ok",
                        message: "Agendamento removido com sucesso!"
                    });
                }
            });
        }
    });
}