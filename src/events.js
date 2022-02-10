import {
  state,
  setFilteredData,
  buildTable,
  filteredData,
  getOurData,
} from './index';
import { saveEdits } from './api';
import { sortData } from './utils';

export const deleteItem = (id) => {
  const itemIndex = state.items.findIndex((i) => i.id === id);
  if (itemIndex >= 0) {
    const copiedItems = Array.from(state.items);
    copiedItems.splice(itemIndex, 1);
    state.items = copiedItems;
    setFilteredData(copiedItems);
    buildTable();
  }
};

export const buildDeleteLinks = () => {
  const deletes = document.querySelectorAll('td[data-delete]');
  for (let del of deletes) {
    del.addEventListener('click', (e) => {
      deleteItem(+e.currentTarget.id.substring(3));
    });
  }
};

export const buildEditLinks = () => {
  const edits = document.querySelectorAll('td[data-edit]');
  for (let ed of edits) {
    ed.addEventListener('click', (e) => {
      editItem(+e.currentTarget.id.substring(4));
    });
  }
};

export const editItem = (id) => {
  if (state.isEditing) {
    removeEditing();
  }
  addSaveIcon(id);
  state.isEditing = true;
  state.editingId = id;
  const row = document.getElementById('row-' + id);
  const product = getItem(id);
  const descriptor = row.cells[0];
  // handle the product name
  descriptor.innerHTML = '';
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'nameid';
  input.value = product.name;
  descriptor.appendChild(input);

  // handle the product size
  const size = row.cells[1];
  size.innerHTML = '';
  const sizeInput = document.createElement('input');
  sizeInput.id = 'sizeid';
  sizeInput.type = 'text';
  sizeInput.value = product.size;
  size.appendChild(sizeInput);

  // handle the price
  const price = row.cells[2];
  price.innerHTML = '';
  const priceInput = document.createElement('input');
  priceInput.id = 'priceid';
  priceInput.type = 'number';
  priceInput.value = product.price;
  priceInput.step = 0.05;
  price.appendChild(priceInput);

  const category = row.cells[3];
  category.innerHTML = '';
  const categorySelect = document.createElement('select');
  categorySelect.id = 'categoryid';
  state.categories.map((c) => {
    categorySelect.options.add(new Option(c.category, c.id));
  });

  category.appendChild(categorySelect);
};

const getItem = (id) => {
  return filteredData.find((i) => i.id == id);
};

const removeEditing = () => {
  const row = document.getElementById('row-' + state.editingId);
  const product = getItem(state.editingId);
  row.cells[0].innerHTML = product.name;
  row.cells[1].innerHTML = product.size;
  row.cells[2].innerHTML = product.price;
  row.cells[3].innerHTML = product.category;
};

const addSaveIcon = (id) => {
  const row = document.getElementById('row-' + id);
  const cell = row.cells[5];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg.setAttribute('viewBox', '0 0 500 500');
  svg.setAttribute('height', '30px');
  svg.setAttribute('width', '30px');
  svg.setAttribute('cursor', 'pointer');
  svg.id = 'disk';

  path.setAttribute(
    'd',
    'M440.125,0H0v512h512V71.875L440.125,0z M281.6,31.347h31.347v94.041H281.6V31.347z M136.359,31.347h113.894v125.388 h94.041V31.347h32.392v156.735H136.359V31.347z M417.959,480.653H94.041V344.816h323.918V480.653z M417.959,313.469H94.041 v-31.347h323.918V313.469z M480.653,480.653h-31.347V250.775H62.694v229.878H31.347V31.347h73.665v188.082h303.02V31.347h19.108 l53.512,53.512V480.653z'
  );
  path.setAttribute('fill', '#000000');
  svg.appendChild(path);
  cell.innerHTML = '';
  cell.appendChild(svg);
  svg.addEventListener('click', handleEditSave);
};

const handleEditSave = () => {
  const disk = document.getElementById('disk');
  disk.removeEventListener('click', handleEditSave);
  const row = document.getElementById('row-' + state.editingId);
  state.currentItem.name = row.cells[0].firstChild.value;
  state.currentItem.size = row.cells[1].firstChild.value;
  state.currentItem.price = row.cells[2].firstChild.value;
  state.currentItem.category = row.cells[3].firstChild.value;
  const product = getItem(state.editingId);
  state.currentItem.id = product.id;

  saveEdits()
    .then((res) => {
      const j = res.data;
      if (j.error === 0) {
        console.log('successfully updated item');
        // reset the state after the edit completes
        state.isEditing = false;
        state.editingId = 0;
        getOurData();
      } else {
        console.log(j.msg);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const assignCaretEvent = () => {
  const caret = document.getElementById('price-caret');
  caret.addEventListener('click', handleSortClick);
  const descriptionCaret = document.getElementById('name-caret');
  descriptionCaret.addEventListener('click', handleSortClick);
  const sizeCaret = document.getElementById('size-caret');
  sizeCaret.addEventListener('click', handleSortClick);
  const categoryCaret = document.getElementById('category-caret');
  categoryCaret.addEventListener('click', handleSortClick);
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
