console.log('coding is ready');
// import { data } from './data';
import { isValid, formatMoney } from './utils';
import './styles.css';
import avion from 'avion';

let data = [];

const state = {
  items: data,
  currentItem: {
    name: '',
    size: '',
    price: 0,
    category: '',
  },
};

async function updateData() {
  let json = await avion({
    method: 'POST',
    cors: true,
    headers: {
      'Content-Type': 'application/json',
    },
    url: 'http://localhost:3000',
    data: {
      name: state.currentItem.name,
      size: state.currentItem.size,
      price: state.currentItem.price,
      category: state.currentItem.category,
    },
  });
  return json;
}

async function getData() {
  let json = await avion({
    method: 'GET',
    cors: true,
    headers: {
      'Content-Type': 'application/json',
    },
    url: 'http://localhost:3000',
  });
  return json;
}

getData()
  .then((res) => {
    const j = res.data;
    if (j.error === 0) {
      data = j.data;
      filteredData = j.data;
      state.items = j.data;
      buildTable();
    } else {
      console.log(j.msg);
    }
  })
  .catch((err) => {
    console.log(err);
  });

let filteredData = data;

const getTotal = () => {
  return filteredData.reduce((acc, cur) => {
    return acc + +cur.price;
  }, 0);
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

const clearForm = () => {
  Object.keys(state.currentItem).map((key) => {
    document.getElementById(key).value = '';
  });
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

const addSvg = () => {
  state.items.forEach((i) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.setAttribute('viewbox', '0 0 24 24');
    svg.setAttribute('height', '24px');
    svg.setAttribute('width', '24px');

    path.setAttribute(
      'd',
      'M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z'
    );
    //path.setAttribute('fill', 'none');
    svg.appendChild(path);
    const div = document.getElementById('trash-' + i.id);
    div.appendChild(svg);
  });
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

const createItemCategory = () => {
  const categories = data.unique('category');
  let html = `<select id="category"><option value="0">Select a Category</option>`;
  categories.map((c) => {
    html += `<option value="${c}">${c}</option>`;
  });
  html += '</select';
  document.getElementById('item-category').innerHTML = html;
  const newSelect = document.getElementById('category');
  newSelect.addEventListener('change', changeState);
};
createItemCategory();

const buildTable = () => {
  let html = `<table style="width: 90%; margin: 20px auto; color: #000">`;
  html +=
    '<tr><th>Products</th><th>Size</th><th>Price</th><th>Category</th><th>Delete</th></tr>';
  filteredData.map((item) => {
    const { name, id, price, category, size } = item;
    html += `<tr><td>${name}</td><td>${size}</td><td>${formatMoney(
      price
    )}</td><td>${category}</td><td id="tr-${id}" style="cursor: pointer;" data-delete="${id}"><div style="text-align: center;" id="trash-${id}"></div></td></tr>`;
  });
  html += `<tr><td colspan="2"></td><td>${formatMoney(
    getTotal()
  )}</td><td colspan="2"></td></tr>`;
  html += '</table>';
  document.getElementById('items').innerHTML = html;
  buildDeleteLinks();
  displayCheapestItem();
  displayMostExpensive();
  addSvg();
  buildFilterBox();
  createItemCategory();
};

buildTable();

const handleFilterChange = (e) => {
  if (e.target.value == '0') {
    filteredData = state.items;
  } else {
    filteredData = state.items.filter((d) => d.category == e.target.value);
  }
  buildTable();
};

buildFilterBox();

buildDeleteLinks();

const deleteItem = (id) => {
  const itemIndex = state.items.findIndex((i) => i.id === id);
  if (itemIndex >= 0) {
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

const saveItem = () => {
  const copiedItems = [...state.items, state.currentItem];
  state.items = copiedItems;
  filteredData = copiedItems;
  buildTable();
  clearForm();
  updateData()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const saveButton = document.getElementById('save-item');
saveButton.addEventListener('click', saveItem);
