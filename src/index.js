console.log('coding is ready');
import { data } from './data';
import { isValid } from './utils';
import './styles.css';

let filteredData = data;
console.log(filteredData);

const state = {
  items: data,
  currentItem: {
    name: '',
    size: '',
    price: 0,
    category: '',
  },
};

const getCheapestItem = () => {
  return filteredData.reduce((acc, cur) => {
    if (acc.price < cur.price) {
      return acc;
    } else {
      return cur;
    }
  }, 9999);
};

const displayCheapestItem = () => {
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

const displayMostExpensive = () => {
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

const buildDeleteLinks = () => {
  const deletes = document.querySelectorAll('td[data-delete]');
  for (let del of deletes) {
    del.addEventListener('click', (e) => {
      deleteItem(+e.currentTarget.id.substring(3));
    });
  }
};

const changeState = (element) => {
  const { id, value } = element.target;
  if (!isValid(value) || !isValid(id)) return;

  setValue(id, value);

  const result = {
    ...state,
    currentItem: {
      ...(state.currentItem[id] = value),
    },
  };
  console.log(result);
  return result;
};

const setValue = (id, value) => {
  if (isValid(value)) {
    document.getElementById(id).value = value;
  }
};

const inputs = document.getElementsByTagName('input');
for (let input of inputs) {
  input.addEventListener('change', changeState);
}

const buildTable = () => {
  let html = `<table style="width: 90%; margin: 20px auto; color: #000">`;
  html +=
    '<tr><th>Products</th><th>Size</th><th>Price</th><th>Category</th><th>Delete</th></tr>';
  filteredData.map((item) => {
    const { name, id, price, category, size } = item;
    html += `<tr><td>${name}</td><td>${size}</td><td>${price}</td><td>${category}</td><td id="tr-${id}" style="cursor: pointer;" data-delete="${id}">Delete</td></tr>`;
  });
  html += '</table>';
  document.getElementById('items').innerHTML = html;
  buildDeleteLinks();
  displayCheapestItem();
  displayMostExpensive();
};

buildTable();

Array.prototype.unique = function (field) {
  const newArray = [];
  this.forEach((record) => {
    const { [field]: targetField } = record;
    if (!newArray.includes(targetField)) {
      newArray.push(targetField);
    }
  });
  return newArray;
};

const handleFilterChange = (e) => {
  if (e.target.value == '0') {
    filteredData = state.items;
  } else {
    filteredData = state.items.filter((d) => d.category == e.target.value);
  }
  buildTable();
};

const buildFilterBox = () => {
  const categories = data.unique('category');
  let html =
    '<select id="category-filter"><option value="0">Select a category to filter by</option>';
  categories.map((c) => {
    html += `<option value="${c}">${c}</option>`;
  });
  html += '</select>';
  document.getElementById('filter').innerHTML = html;
  const newSelect = document.getElementById('category-filter');
  newSelect.addEventListener('change', handleFilterChange);
};
buildFilterBox();

buildDeleteLinks();

const deleteItem = (id) => {
  const itemIndex = state.items.findIndex((i) => i.id === id);
  if (itemIndex && itemIndex >= 0) {
    const copiedItems = Array.from(state.items);
    copiedItems.splice(itemIndex, 1);
    state.items = copiedItems;
    filteredData = copiedItems;
    buildTable();
  }
};

// lets add curry to the mix
const filterData = (property) => {
  return function (value) {
    return data.filter((i) => i[property] == value);
  };
};

const curriedFilter = filterData('category');
const fruits = curriedFilter('fruit');
const bevs = curriedFilter('beverages');
const candy = curriedFilter('candy');
console.log('fruits', fruits);
console.log('bevs', bevs);
console.log('candy', candy);

const findCategoryMostExpensiveItem = (array) => {
  return array.reduce((acc, cur) => {
    return acc.price > cur.price ? acc : cur;
  }, 0);
};

const compose =
  (...fns) =>
  (...args) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

const pipedFn = compose(
  findCategoryMostExpensiveItem,
  curriedFilter
)('beverages');
console.log(pipedFn);
