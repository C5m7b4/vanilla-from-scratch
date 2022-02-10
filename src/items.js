import { filteredData } from './index';

const getCheapestItem = () => {
  return filteredData.reduce((acc, cur) => {
    if (acc.price < cur.price) {
      return acc;
    } else {
      return cur;
    }
  }, 9999);
};

export const displayCheapestItem = () => {
  const parent = document.getElementById('stats');
  const divName = 'cheapest-div';
  const existing = document.getElementById(divName);
  if (existing) {
    parent.removeChild(existing);
  }
  const cheapest = getCheapestItem();
  const div = document.createElement('div');
  div.id = divName;
  div.innerHTML = `The cheapest item is ${cheapest.name} and it is ${cheapest.price}`;
  parent.appendChild(div);
};

const mostExpensive = () => {
  return filteredData.reduce((acc, cur) => {
    if (acc.price > cur.price) {
      return acc;
    } else {
      return cur;
    }
  }, 0);
};

export const displayMostExpensive = () => {
  const parent = document.getElementById('stats');
  const divName = 'most-expensive';
  const existing = document.getElementById(divName);
  if (existing) {
    parent.removeChild(existing);
  }
  const highest = mostExpensive();
  const div = document.createElement('div');
  div.id = divName;
  div.innerHTML = `The most expensive item is ${highest.name} and it is ${highest.price}`;
  parent.appendChild(div);
};
