import { Client, cacheExchange, fetchExchange } from '@urql/core';

const client = new Client({
    url: 'http://localhost:1337/graphql',
    exchanges: [cacheExchange, fetchExchange],
});

export default client;
