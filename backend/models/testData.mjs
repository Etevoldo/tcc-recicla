'use strict';

import { db } from "./init_models.mjs"

insertTestData();

export async function insertTestData() {
    try {
        await db.sequelize.sync({force: true});
        await insertTestBuyers();
        await insertTestProducts();
        await insertTestOffers();
        await insertTestAddresses();
    } catch (error) {
        console.log(error);
    }
}

async function insertTestOffers() {
    await db.offer.bulkCreate([
        {
            "price": 640,
            "ProductId": 2,
            "BuyerId": 2
        },
        {
            "price": 330,
            "ProductId": 2,
            "BuyerId": 3
        },
        {
            "price": 330,
            "ProductId": 2,
            "BuyerId": 4
        },
        {
            "price": 330,
            "ProductId": 3,
            "BuyerId": 4
        },
        {
            "price": 330,
            "ProductId": 4,
            "BuyerId": 3
        },
        {
            "price": 340,
            "ProductId": 5,
            "BuyerId": 2
        },
        {
            "price": 330,
            "ProductId": 5,
            "BuyerId": 3
        },
        {
            "price": 330,
            "ProductId": 7,
            "BuyerId": 1
        },
        {
            "price": 330,
            "ProductId": 7,
            "BuyerId": 4
        },
        {
            "price": 300,
            "ProductId": 9,
            "BuyerId": 1
        }
    ]);
}

async function insertTestBuyers() {
    await db.buyer.bulkCreate([
        {
            "id": 1,
            "name": "Myrtle Haley",
            "cpf": "8026595433552329",
            "email": "Demond_Balistreri68@example.net",
            "phoneNumber": "(812) 246-9203",
            "cep": "76874174",
            "address": "54022 Shanahan Oval",
            "addressNumber": "8278909788630461"
        },
        {
            "id": 2,
            "name": "Ira Collier",
            "cpf": "8426360666894051",
            "email": "Marlon_Pfeffer35@example.com",
            "phoneNumber": "1-636-911-3796 x76804",
            "cep": "76906609",
            "address": "19512 Cliff Road",
            "addressNumber": "4665874895106071"
        },
        {
            "id": 3,
            "name": "Iris Beahan",
            "cpf": "5647202919552205",
            "email": "Alverta_Ritchie28@example.org",
            "phoneNumber": "1-980-910-4154 x8507",
            "cep": "76963512",
            "address": "60577 Bramble Close",
            "addressNumber": "5013777372895936"
        },
        {
            "id": 4,
            "name": "Edgar Tremblay",
            "cpf": "7802380918642573",
            "email": "German_Waelchi@example.org",
            "phoneNumber": "(645) 295-5575",
            "cep": "76875899",
            "address": "55257 Kaitlin Neck",
            "addressNumber": "8369704823805205"
        },
        {
            "id": 5,
            "name": "Jeffery Schoen",
            "cpf": "3946181639138744",
            "email": "Buford.Rolfson@example.com",
            "phoneNumber": "1-314-895-7371 x14058",
            "cep": "65065500",
            "address": "310 Henry Street",
            "addressNumber": "2698730051880542"
        },
        {
            "id": 6,
            "name": "Lula Watsica",
            "cpf": "6741829644882273",
            "email": "Kavon.Heathcote60@example.com",
            "phoneNumber": "879-642-1766 x96593",
            "cep": "65911190",
            "address": "8170 Urban Row",
            "addressNumber": "2711313366146131"
        },
        {
            "id": 7,
            "name": "Lena Heidenreich",
            "cpf": "7368921898135275",
            "email": "Salvador32@example.net",
            "phoneNumber": "354.201.9495 x81483",
            "cep": "65047030",
            "address": "5886 Reynolds Grove",
            "addressNumber": "4030325656514579"
        },
        {
            "id": 52,
            "name": "Natalie Lakin",
            "cpf": "1622185815702237",
            "email": "Kelsie58@example.net",
            "phoneNumber": "(831) 420-8538",
            "cep": "65047030",
            "address": "688 Jasmin Key",
            "addressNumber": "4501567061264404"
        }
    ]);
}

async function insertTestProducts() {
    await db.product.bulkCreate([
        {
            "id": 2,
            "name": "Papelão",
            "recicling_code": "AZUL"
        },
        {
            "id": 3,
            "name": "Garrafa de vidro",
            "recicling_code": "VERDE"
        },
        {
            "id": 4,
            "name": "Latinha de alumínio",
            "recicling_code": "AMARELO"
        },
        {
            "id": 5,
            "name": "Cerragem",
            "recicling_code": "PRETO"
        },
        {
            "id": 6,
            "name": "Bagaço de Cana",
            "recicling_code": "MARROM"
        },
        {
            "id": 7,
            "name": "Garrafa de refrigerante",
            "recicling_code": "PET"
        },
        {
            "id": 8,
            "name": "Galão de plástico usado",
            "recicling_code": "PEAD"
        },
        {
            "id": 9,
            "name": "Cano velho",
            "recicling_code": "PVC"
        },
        {
            "id": 10,
            "name": "Tampinha e/ou Lacre de Garrafa PET",
            "recicling_code": "PEBD"
        },
        {
            "id": 11,
            "name": "Baldes velhos",
            "recicling_code": "PP"
        },
        {
            "id": 12,
            "name": "Face-shield vencido",
            "recicling_code": "PS"
        },
        {
            "id": 13,
            "name": "Carderno usado",
            "recicling_code": "AZUL"
        },
        {
            "id": 53,
            "name": "Papel Machê",
            "recicling_code": "AZUL"
        },
    ]);
}

async function insertTestAddresses() {
    await db.address.bulkCreate([
		{
			"cep": "65047030",
			"latitude": -2.5587351,
			"longitude": -44.2368089
		},
		{
			"cep": "65065500",
			"latitude": -2.4887483,
			"longitude": -44.233146
		},
		{
			"cep": "65911190",
			"latitude": -5.5128827,
			"longitude": -47.4897919
		},
		{
			"cep": "76870416",
			"latitude": -9.9332992,
			"longitude": -63.0164922
		},
		{
			"cep": "76873004",
			"latitude": -9.922642,
			"longitude": -63.0285216
		},
		{
			"cep": "76874174",
			"latitude": -9.8916286,
			"longitude": -63.0294187
		},
		{
			"cep": "76875899",
			"latitude": -9.9208265,
			"longitude": -63.0319423
		},
		{
			"cep": "76876344",
			"latitude": -9.9311433,
			"longitude": -63.0334847
		},
		{
			"cep": "76906609",
			"latitude": -10.8558274,
			"longitude": -61.9517223
		},
		{
			"cep": "76963512",
			"latitude": -11.4267484,
			"longitude": -61.4453186
		}
    ]);
}