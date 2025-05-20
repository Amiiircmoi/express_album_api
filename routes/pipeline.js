// random.js
// Route Express pour GET /random/user
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.get('/random/user', async (req, res) => {
    try {
        // Lancer tous les appels en parallèle
        const [
            userRes,
            phoneRes,
            ibanRes,
            cardRes,
            addressRes,
            quoteRes,
            jokeRes,
        ] = await Promise.all([
            // RandomUser.me – utilisateur
            axios.get('https://randomuser.me/api/'),

            // Randommer.io – téléphone
            axios.get('https://randommer.io/api/Phone/Generate', {
                params: { CountryCode: 'FR', Quantity: 1 },
                headers: { 'X-Api-Key': process.env.RANDOMMER_API_KEY }
            }),

            // Randommer.io – IBAN
            axios.get('https://randommer.io/api/Finance/Iban/FR', {
                headers: { 'X-Api-Key': process.env.RANDOMMER_API_KEY }
            }),

            // Randommer.io – carte bancaire
            axios.get('https://randommer.io/api/Card', {
                params: { type: 'visa' },
                headers: { 'X-Api-Key': process.env.RANDOMMER_API_KEY }
            }),

            // Randommer.io – adresse aléatoire
            axios.get('https://randommer.io/api/Misc/Random-Address', {
                params: { culture: 'fr', number: 1 },
                headers: { 'X-Api-Key': process.env.RANDOMMER_API_KEY }
            }),

            // dummyjson – citation aléatoire
            axios.get('https://dummyjson.com/quotes/random'),

            // officialJokeApi – blague aléatoire
            axios.get('https://official-joke-api.appspot.com/random_joke'),
        ]);

        const randomUser = userRes.data.results[0];

        const extractedUser = {
            gender: randomUser.gender,
            email: randomUser.email,
            name: `${randomUser.name.first} ${randomUser.name.last}`,
            age: randomUser.dob.age,
            phone: phoneRes.data[0],
            iban: ibanRes.data,
            credit_card: {
                card_number: cardRes.data.cardNumber,
                card_type: cardRes.data.type,
                expiration_date: cardRes.data.date,
                cvv: cardRes.data.cvv,
                pin: cardRes.data.pin,
            },
            address: addressRes.data[0],
            quote: quoteRes.data.quote,
            joke: jokeRes.data.setup + ' ' + jokeRes.data.punchline,
        };

        return res.json(extractedUser);
    } catch (error) {
        console.error('Erreur lors de la récupération des données aléatoires :', error);
        res.status(500).json({ error: 'Impossible de récupérer les données aléatoires' });
    }
});

module.exports = router;
