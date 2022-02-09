console.log('coding is ready');
// import { data } from './data';
import { isValid, formatMoney } from './utils';
import './styles.css';
import avion from 'avion';

// we need to add an event that will let us know when the data is finished loading
const dataLoaded = new CustomEvent('onDataLoaded');
window.addEventListener('onDataLoaded', () => {
  console.log('onDataLoaded has been dispatched');
  runSampleCode();
});

let data = [];

const state = {
  items: data,
  currentItem: {
    name: '',
    size: '',
    price: 0,
    category: '',
  },
  priceSortDirection: 'top',
  nameSortDirection: 'top',
  sizeSortDirection: 'top',
  categorySortDirection: 'top',
  sortType: 'price',
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
      window.dispatchEvent(dataLoaded);
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

const compare = (a, b) => {
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

const sortData = () => {
  const sortedData = [...filteredData].sort(compare);
  filteredData = sortedData;
  buildTable();
};

const handleSortClick = (e) => {
  const elementId = e.target.id;
  const caret = document.getElementById(elementId);
  caret.classList.remove('top');
  caret.classList.remove('down');

  if (elementId.substring(0, 4) == 'pric') {
    state.sortType = 'price';
    if (state.priceSortDirection == 'down') {
      state.priceSortDirection = 'top';
      caret.classList.add('top');
    } else {
      state.priceSortDirection = 'down';
      caret.classList.add('down');
    }
  } else if (elementId.substring(0, 4) == 'name') {
    state.sortType = 'name';
    if (state.nameSortDirection == 'down') {
      state.nameSortDirection = 'top';
      caret.classList.add('top');
    } else {
      state.nameSortDirection = 'down';
      caret.classList.add('down');
    }
  } else if (elementId.substring(0, 4) == 'size') {
    state.sortType = 'size';
    if (state.sizeSortDirection == 'down') {
      state.sizeSortDirection = 'top';
      caret.classList.add('top');
    } else {
      state.sizeSortDirection = 'down';
      caret.classList.add('down');
    }
  } else if (elementId.substring(0, 4) == 'cate') {
    state.sortType = 'category';
    if (state.categorySortDirection == 'down') {
      state.categorySortDirection = 'top';
      caret.classList.add('top');
    } else {
      state.categorySortDirection = 'down';
      caret.classList.add('down');
    }
  }

  sortData();
  caret.removeEventListener('click', handleSortClick);
};

const assignCaretEvent = () => {
  const caret = document.getElementById('price-caret');
  caret.addEventListener('click', handleSortClick);
  const descriptionCaret = document.getElementById('name-caret');
  descriptionCaret.addEventListener('click', handleSortClick);
  const sizeCaret = document.getElementById('size-caret');
  sizeCaret.addEventListener('click', handleSortClick);
  const categoryCaret = document.getElementById('category-caret');
  categoryCaret.addEventListener('click', handleSortClick);
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
  html += `<tr>`;
  html += `<th class="header-sort"><span>Products</span><span id="name-caret" class="chevron ${state.nameSortDirection}"></span></th>`;
  html += `<th><span style="width: 80%;">Size</span><span style="width: 20%; float: right; text-align: right; margin-right: 8px" id="size-caret" class="chevron ${state.sizeSortDirection}"></span></th>`;
  html += `<th class="header-sort"><span>Price</span><span id="price-caret" class="chevron ${state.priceSortDirection}"></span></th>`;
  html += `<th><span style="width: 80%;">Category</span><span style="width: 20%; float: right; text-align: right; margin-right: 8px;" id="category-caret" class="chevron ${state.categorySortDirection}"></span></th><th>Delete</th></tr>`;
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
  assignCaretEvent();
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

function runSampleCode() {
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
}
