import { beer, hotDog, fruit } from './icons';

export const types = [
  { id: 1, name: 'Pivo', icon: beer },
  { id: 2, name: 'Hot dog', icon: hotDog },
  { id: 3, name: 'Ovoce', icon: fruit },
];

export const validType = (id: number) => Number.isInteger(id) && id > 0 && id < 4;

export const stocks = new Map<number, number>();

export const setInitialStocks = () => {
  stocks.set(1, 80);
  stocks.set(2, 50);
  stocks.set(3, 60);
};

setInitialStocks();
