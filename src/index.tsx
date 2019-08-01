import { asString, switchRoute, param, branch } from 'router/router';

const INDEX: string[] = [];
const UMBRELLA = [ 'umbrella', param('umbrellaId') ];
const USER = [ ...UMBRELLA, 'user', param('userId') ];

console.log(asString(INDEX));
console.log(asString(USER, { umbrellaId: '123', userId: '456' }));

const branches = [
  branch(USER, params => params.userId),
  branch(UMBRELLA, params => params.umbrellaId),
  branch(INDEX, () => 'index'),
];
console.log(switchRoute('/umbrella/123/user/456', branches));
console.log(switchRoute('/umbrella/123', branches));
console.log(switchRoute('/', branches));
