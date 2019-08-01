import { asString, param } from 'router/router';

const indexRoute: string[] = [];
const umbrellaRoute = [ 'umbrella', param('umbrellaId') ];
const userRoute = [ ...umbrellaRoute, 'user', param('userId') ];

console.log(asString(indexRoute));
console.log(asString(userRoute, { umbrellaId: '123', userId: '456' }));
