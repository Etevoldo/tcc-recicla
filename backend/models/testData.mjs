'use strict';

import bcrypt from 'bcryptjs'
import { db } from "./init_models.mjs"

insertTestData();

export async function insertTestData() {
    try {
        await db.sequelize.sync({force: true});
        await insertTestBuyers();
        await insertTestUsers();
        await insertTestProductsAndOffers();
        await insertTestAddresses();
    } catch (error) {
        console.log(error);
    }
}

async function insertTestUsers() {
    const passwordHash = await bcrypt.hash('comprador123', 10)
    const adminHash = await bcrypt.hash('admin123', 10)
    const buyers = await db.buyer.findAll({ order: [['id', 'ASC']] })

    await db.user.create({
        name: 'Administrador',
        email: 'admin@recicla.com',
        passwordHash: adminHash,
        role: 'ADMIN',
        BuyerId: null,
        mustChangePassword: false,
    })

    await db.user.bulkCreate(
        buyers.map((buyer) => ({
            name: buyer.name,
            email: String(buyer.email).toLowerCase(),
            passwordHash,
            role: 'BUYER',
            BuyerId: buyer.id,
            mustChangePassword: false,
        }))
    )
}

async function insertTestBuyers() {
    await db.buyer.bulkCreate([
        // Região Sudeste
        { id: 1, name: "Ana Silva", cpf: "11122233344", email: "ana.silva@email.com", phoneNumber: "(11) 98765-4321", cep: "05424020", address: "Rua Exemplo, 123", addressNumber: "100" },
        { id: 2, name: "Bruno Costa", cpf: "22233344455", email: "bruno.costa@email.com", phoneNumber: "(21) 97654-3210", cep: "20021120", address: "Av. Exemplo, 456", addressNumber: "200" },
        { id: 3, name: "Carla Souza", cpf: "33344455566", email: "carla.souza@email.com", phoneNumber: "(31) 96543-2109", cep: "31270000", address: "Rua Exemplo, 789", addressNumber: "300" },
        { id: 4, name: "Daniel Lima", cpf: "44455566677", email: "daniel.lima@email.com", phoneNumber: "(11) 95432-1098", cep: "05424020", address: "Rua Exemplo, 101", addressNumber: "400" },
        // Região Nordeste
        { id: 5, name: "Eduarda Santos", cpf: "55566677788", email: "eduarda.santos@email.com", phoneNumber: "(71) 94321-0987", cep: "40170115", address: "Av. Exemplo, 202", addressNumber: "500" },
        { id: 6, name: "Felipe Almeida", cpf: "66677788899", email: "felipe.almeida@email.com", phoneNumber: "(81) 93210-9876", cep: "50690000", address: "Rua Exemplo, 303", addressNumber: "600" },
        { id: 7, name: "Gabriela Rocha", cpf: "77788899900", email: "gabriela.rocha@email.com", phoneNumber: "(85) 92109-8765", cep: "60862750", address: "Av. Exemplo, 404", addressNumber: "700" },
        { id: 8, name: "Heitor Fernandes", cpf: "88899900011", email: "heitor.fernandes@email.com", phoneNumber: "(84) 91098-7654", cep: "59020400", address: "Rua Exemplo, 505", addressNumber: "800" },
        { id: 9, name: "Isabela Martins", cpf: "99900011122", email: "isabela.martins@email.com", phoneNumber: "(83) 90987-6543", cep: "58010100", address: "Av. Exemplo, 606", addressNumber: "900" },
        { id: 10, name: "João Pereira", cpf: "00011122233", email: "joao.pereira@email.com", phoneNumber: "(82) 99876-5432", cep: "57020200", address: "Rua Exemplo, 707", addressNumber: "1000" },
        // Região Norte
        { id: 11, name: "Kelly Nascimento", cpf: "11223344556", email: "kelly.nascimento@email.com", phoneNumber: "(92) 98765-4321", cep: "69010110", address: "Av. Exemplo, 808", addressNumber: "1100" },
        { id: 12, name: "Lucas Barbosa", cpf: "22334455667", email: "lucas.barbosa@email.com", phoneNumber: "(91) 97654-3210", cep: "66075110", address: "Rua Exemplo, 909", addressNumber: "1200" },
        { id: 13, name: "Mariana Araújo", cpf: "33445566778", email: "mariana.araujo@email.com", phoneNumber: "(69) 96543-2109", cep: "76801126", address: "Av. Exemplo, 1010", addressNumber: "1300" },
        // Região Centro-Oeste
        { id: 14, name: "Nicolas Ribeiro", cpf: "44556677889", email: "nicolas.ribeiro@email.com", phoneNumber: "(61) 95432-1098", cep: "70910900", address: "Rua Exemplo, 1111", addressNumber: "1400" },
        { id: 15, name: "Olívia Carvalho", cpf: "55667788990", email: "olivia.carvalho@email.com", phoneNumber: "(62) 94321-0987", cep: "74690900", address: "Av. Exemplo, 1212", addressNumber: "1500" },
        { id: 16, name: "Paulo Gomes", cpf: "66778899001", email: "paulo.gomes@email.com", phoneNumber: "(65) 93210-9876", cep: "78060900", address: "Rua Exemplo, 1313", addressNumber: "1600" },
        // Região Sul
        { id: 17, name: "Queren Dias", cpf: "77889900112", email: "queren.dias@email.com", phoneNumber: "(41) 92109-8765", cep: "80060150", address: "Av. Exemplo, 1414", addressNumber: "1700" },
        { id: 18, name: "Rafael Monteiro", cpf: "88990011223", email: "rafael.monteiro@email.com", phoneNumber: "(51) 91098-7654", cep: "91501970", address: "Rua Exemplo, 1515", addressNumber: "1800" },
        { id: 19, name: "Sofia Cardoso", cpf: "99001122334", email: "sofia.cardoso@email.com", phoneNumber: "(48) 90987-6543", cep: "88040900", address: "Av. Exemplo, 1616", addressNumber: "1900" },
        // Compradores SEM OFERTAS (para testes de borda)
        { id: 20, name: "Tomás Vieira", cpf: "00112233445", email: "tomas.vieira@email.com", phoneNumber: "(11) 99876-5432", cep: "05424020", address: "Rua Exemplo, 1717", addressNumber: "2000" },
        { id: 21, name: "Vitória Lopes", cpf: "11223344556", email: "vitoria.lopes@email.com", phoneNumber: "(21) 98765-4321", cep: "20021120", address: "Av. Exemplo, 1818", addressNumber: "2100" },
    ]);
}

async function insertTestProductsAndOffers() {
    const catalog = [
        { name: "Garrafa PET", recicling_code: "PET" },
        { name: "Papelão", recicling_code: "AZUL" },
        { name: "Garrafa de Vidro", recicling_code: "VERDE" },
        { name: "Lata de Alumínio", recicling_code: "AMARELO" },
        { name: "Cerragem", recicling_code: "PRETO" },
        { name: "Bagaço de Cana", recicling_code: "MARROM" },
        { name: "Galão de Plástico", recicling_code: "PEAD" },
        { name: "Cano PVC", recicling_code: "PVC" },
        { name: "Tampinha de Garrafa", recicling_code: "PEBD" },
        { name: "Balde Velho", recicling_code: "PP" },
        { name: "Face-shield", recicling_code: "PS" },
        { name: "Caderno Usado", recicling_code: "AZUL" },
    ]
    const offerSeeds = [
        { catalog: 0, buyerId: 1, price: 150 },
        { catalog: 0, buyerId: 2, price: 145 },
        { catalog: 0, buyerId: 5, price: 160 },
        { catalog: 0, buyerId: 11, price: 155 },
        { catalog: 1, buyerId: 2, price: 80 },
        { catalog: 1, buyerId: 3, price: 75 },
        { catalog: 1, buyerId: 14, price: 85 },
        { catalog: 2, buyerId: 4, price: 50 },
        { catalog: 2, buyerId: 6, price: 55 },
        { catalog: 3, buyerId: 1, price: 300 },
        { catalog: 3, buyerId: 3, price: 305 },
        { catalog: 3, buyerId: 7, price: 298 },
        { catalog: 3, buyerId: 9, price: 310 },
        { catalog: 3, buyerId: 17, price: 295 },
        { catalog: 4, buyerId: 8, price: 20 },
        { catalog: 5, buyerId: 10, price: 30 },
        { catalog: 5, buyerId: 12, price: 35 },
        { catalog: 6, buyerId: 13, price: 100 },
        { catalog: 7, buyerId: 15, price: 200 },
        { catalog: 7, buyerId: 16, price: 210 },
        { catalog: 7, buyerId: 18, price: 195 },
        { catalog: 8, buyerId: 19, price: 10 },
        { catalog: 9, buyerId: 20, price: 120 },
        { catalog: 9, buyerId: 21, price: 125 },
        { catalog: 10, buyerId: 2, price: 70 },
        { catalog: 11, buyerId: 4, price: 40 },
        { catalog: 11, buyerId: 6, price: 45 },
    ]
    const leftovers = [
        { name: "Papel Machê", recicling_code: "AZUL", ownerId: 1, price: 40 },
        { name: "Vidro Temperado", recicling_code: "VERDE", ownerId: 3, price: 55 },
        { name: "Latinha Amassada", recicling_code: "AMARELO", ownerId: 7, price: 280 },
        { name: "Serragem Fina", recicling_code: "PRETO", ownerId: 8, price: 25 },
        { name: "Palha de Cana", recicling_code: "MARROM", ownerId: 10, price: 30 },
    ]

    const products = []
    const offers = []
    let id = 1
    for (const seed of offerSeeds) {
        const item = catalog[seed.catalog]
        products.push({
            id,
            name: item.name,
            recicling_code: item.recicling_code,
            ownerId: seed.buyerId,
        })
        offers.push({ price: seed.price, ProductId: id, BuyerId: seed.buyerId })
        id += 1
    }
    for (const item of leftovers) {
        products.push({
            id,
            name: item.name,
            recicling_code: item.recicling_code,
            ownerId: item.ownerId,
        })
        offers.push({ price: item.price, ProductId: id, BuyerId: item.ownerId })
        id += 1
    }

    await db.product.bulkCreate(products)
    await db.offer.bulkCreate(offers)
}

async function insertTestAddresses() {
    await db.address.bulkCreate([
        // São Paulo - SP
        { cep: "05424020", latitude: -23.5369, longitude: -46.67431 },
        // Rio de Janeiro - RJ
        { cep: "20021120", latitude: -22.9046147, longitude: -43.2146583 },
        // Belo Horizonte - MG
        { cep: "31270000", latitude: -19.8559785, longitude: -43.9555987 },
        // Salvador - BA
        { cep: "40170115", latitude: -13.0059755, longitude: -38.5097308 },
        // Recife - PE
        { cep: "50690000", latitude: -8.0192, longitude: -34.936 },
        // Fortaleza - CE (coordenadas aproximadas)
        { cep: "60862750", latitude: -3.49, longitude: -38.5 },
        // Natal - RN (coordenadas aproximadas)
        { cep: "59020400", latitude: -5.784, longitude: -35.2 },
        // João Pessoa - PB (coordenadas aproximadas)
        { cep: "58010100", latitude: -7.120, longitude: -34.885 },
        // Maceió - AL (coordenadas aproximadas)
        { cep: "57020200", latitude: -9.663, longitude: -35.739 },
        // Manaus - AM
        { cep: "69010110", latitude: -3.1289, longitude: -60.0244 },
        // Belém - PA
        { cep: "66075110", latitude: -1.4667669, longitude: -48.4576425 },
        // Porto Velho - RO
        { cep: "76801126", latitude: -8.765, longitude: -63.9 },
        // Brasília - DF
        { cep: "70910900", latitude: -15.7634499, longitude: -47.8910319 },
        // Goiânia - GO
        { cep: "74690900", latitude: -16.6056791, longitude: -49.2613125 },
        // Cuiabá - MT
        { cep: "78060900", latitude: -15.60805, longitude: -56.0658 },
        // Curitiba - PR
        { cep: "80060150", latitude: -25.427797, longitude: -49.260855 },
        // Porto Alegre - RS
        { cep: "91501970", latitude: -30.068, longitude: -51.120404 },
        // Florianópolis - SC
        { cep: "88040900", latitude: -27.585779, longitude: -48.523951 },
    ]);
}