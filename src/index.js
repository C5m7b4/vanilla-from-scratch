console.log('coding is ready');
// import { data } from './data';
import { isValid, formatMoney, getTotal, clearForm } from './utils';
import './styles.css';
import { buildDeleteLinks, buildEditLinks, assignCaretEvent } from './events';
import { updateData, getData, getCategories } from './api';
import { displayCheapestItem, displayMostExpensive } from './items';
import { addSvg, addEdit } from './svg';

// we need to add an event that will let us know when the data is finished loading
const dataLoaded = new CustomEvent('onDataLoaded');
window.addEventListener('onDataLoaded', () => {
  console.log('onDataLoaded has been dispatched');
  runSampleCode();
});
const categoriesLoaded = new CustomEvent('onCategoriesLoaded');
window.addEventListener('onCategoriesLoaded', () => {
  runCategoryCode();
});

// create a toast container
const toastContainer = document.createElement('div');
toastContainer.id = 'toastContainer';
toastContainer.classList.add('toast-container');
document.body.appendChild(toastContainer);

let data = [];

export const state = {
  items: data,
  currentItem: {
    name: '',
    size: '',
    price: 0,
    category: '',
  },
  categories: [],
  priceSortDirection: 'top',
  nameSortDirection: 'top',
  sizeSortDirection: 'top',
  categorySortDirection: 'top',
  sortType: 'price',
  idEditing: false,
  editingId: 0,
};

export const getOurData = () => {
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
        createToast(j.msg, 'warning');
      }
    })
    .catch((err) => {
      createToast(err, 'Error');
    });
};

getOurData();

const getOurCategories = () => {
  getCategories()
    .then((res) => {
      const j = res.data;
      if (j.error === 0) {
        state.categories = j.data;
        window.dispatchEvent(categoriesLoaded);
      } else {
        createToast(j.msg, 'Warning');
      }
    })
    .catch((err) => {
      createToast(err, 'Error');
    });
};

getOurCategories();

export let filteredData = data;

export const setFilteredData = (data) => {
  filteredData = data;
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

export const buildTable = () => {
  let html = `<table style="width: 90%; margin: 20px auto; color: #000">`;
  html += `<tr>`;
  html += `<th class="header-sort"><span>Products</span><span id="name-caret" class="chevron ${state.nameSortDirection}"></span></th>`;
  html += `<th><span style="width: 80%;">Size</span><span style="width: 20%; float: right; text-align: right; margin-right: 8px" id="size-caret" class="chevron ${state.sizeSortDirection}"></span></th>`;
  html += `<th class="header-sort"><span>Price</span><span id="price-caret" class="chevron ${state.priceSortDirection}"></span></th>`;
  html += `<th><span style="width: 80%;">Category</span><span style="width: 20%; float: right; text-align: right; margin-right: 8px;" id="category-caret" class="chevron ${state.categorySortDirection}"></span></th>`;
  html += `<th>Delete</th><th>Edit</th></tr>`;
  filteredData.map((item) => {
    const { name, id, price, category, size } = item;
    html += `<tr id="row-${id}"><td>${name}</td><td>${size}</td><td>${formatMoney(
      price
    )}</td><td>${category}</td>`;
    html += `<td id="tr-${id}" data-delete="${id}"><div style="text-align: center;cursor: pointer;" id="trash-${id}"></div></td>`;
    html += `<td id="tre-${id}" data-edit="${id}"><div style="text-align: center; cursor: pointer;" id="edit-${id}"></div></td></tr>`;
  });
  html += `<tr><td colspan="2"></td><td>${formatMoney(
    getTotal()
  )}</td><td colspan="3"></td></tr>`;
  html += '</table>';
  document.getElementById('items').innerHTML = html;
  buildDeleteLinks();
  buildEditLinks();
  displayCheapestItem();
  displayMostExpensive();
  addSvg();
  //buildFilterBox();
  assignCaretEvent();
  addEdit();
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

buildEditLinks();

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
  createToast('running sample code');
  buildFilterBox();
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
  createToast([...fruits], 'fruits');
  createToast([...bevs], 'bevs');
  createToast([...candy], 'candy');

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

function runCategoryCode() {
  const createItemCategory = () => {
    let html = `<select id="category"><option value="0">Select a Category</option>`;
    state.categories.map((c) => {
      html += `<option value="${c.id}">${c.category}</option>`;
    });
    html += '</select';
    document.getElementById('item-category').innerHTML = html;
    const newSelect = document.getElementById('category');
    newSelect.addEventListener('change', changeState);
  };
  createItemCategory();
}

const createToast = (text, title = '', duration = 4000, type) => {
  const toastElem = document.createElement('div');
  toastElem.classList.add('toast');
  if (type) toastElem.classList.add(type);

  const titleElem = document.createElement('p');
  titleElem.classList.add('t-title');
  titleElem.innerHTML = title;
  toastElem.appendChild(titleElem);

  const textElem = document.createElement('p');
  textElem.classList.add('t-text');

  if (Array.isArray(text)) {
    const s = text
      .map((s) => {
        if (typeof s == 'object') {
          return s.name;
        } else {
          return s;
        }
      })
      .join(', ');
    textElem.innerHTML = s;
  } else {
    textElem.innerHTML = text;
  }
  toastElem.appendChild(textElem);

  const toastContainer = document.getElementById('toastContainer');
  toastContainer.appendChild(toastElem);

  setTimeout(() => {
    toastElem.classList.add('active');
  }, 1);

  setTimeout(() => {
    toastElem.classList.remove('active');
    setTimeout(() => {
      toastElem.remove();
    }, 350);
  }, duration);
};
