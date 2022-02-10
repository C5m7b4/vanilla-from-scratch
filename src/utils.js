import { filteredData, state, buildTable, setFilteredData } from './index';

export const isValid = (v) => {
  if (v !== 'undefined' && v !== null) return true;
  return false;
};

export const formatMoney = (input) => {
  input = input.toString();
  const pos = input.indexOf('.');
  const left = input.substring(0, pos);
  let right = input.substring(pos + 1);
  if (right.length == 1) {
    right += '0';
  }
  const result = `${left}.${right}`;
  return Number(result).toFixed(2);
};

export const getTotal = () => {
  return filteredData.reduce((acc, cur) => {
    return acc + +cur.price;
  }, 0);
};

export const clearForm = () => {
  Object.keys(state.currentItem).map((key) => {
    if (key != 'id') {
      document.getElementById(key).value = '';
    }
  });
};

export const compare = (a, b) => {
  const fieldA = a[state.sortType];
  const fieldB = b[state.sortType];

  let descriptor = 'priceSortDirection';
  if (state.sortType == 'name') {
    descriptor = 'nameSortDirection';
  } else if (state.sortType == 'size') {
    descriptor = 'sizeSortDirection';
  } else if (state.sortType == 'category') {
    descriptor = 'categorySortDirection';
  }

  let comparison = 0;
  if (fieldA > fieldB) {
    if (state[descriptor] == 'down') {
      comparison = 1;
    } else {
      comparison = -1;
    }
  } else if (fieldA < fieldB) {
    if (state[descriptor] == 'down') {
      comparison = -1;
    } else {
      comparison = 1;
    }
  }
  return comparison;
};

export const sortData = () => {
  const sortedData = [...filteredData].sort(compare);
  setFilteredData(sortedData);
  buildTable();
};
