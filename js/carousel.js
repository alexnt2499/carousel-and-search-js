"use strict";

let sliderContainer = document.querySelector(".container");
let innerSlider = document.querySelector(".inner-container");
let dotContainer = document.querySelector(".dot-container");

let pressed = false;
let startX;
let scrollLeft;
let listItem = [];
let listDot = [];
let numberOfItemInDot = 4;
let scrollToInterval;

const end = () => {
  pressed = false;
}

const start = (e) => {
  pressed = true;
  startX = e.pageX || e.touches[0].pageX - sliderContainer.offsetLeft;
  scrollLeft = sliderContainer.scrollLeft;
}

const move = (e) => {
  if (!pressed) return;

  e.preventDefault();
  const x = e.pageX || e.touches[0].pageX - sliderContainer.offsetLeft;
  const dist = (x - startX);
  sliderContainer.scrollLeft = scrollLeft - dist;
}

(function () {
  fetch("./../data/items.json").then((response) => {
    response.json().then((value) => {
      listItem = value;
      renderItem();
      initListDot();
    });
  });

  sliderContainer.addEventListener('mousedown', start);
  sliderContainer.addEventListener('touchstart', start);

  sliderContainer.addEventListener('mousemove', move);
  sliderContainer.addEventListener('touchmove', move);

  sliderContainer.addEventListener('mouseleave', end);
  sliderContainer.addEventListener('mouseup', end);
  sliderContainer.addEventListener('touchend', end);
})();



function renderItem() {
  listItem.forEach((value, index) => {
    innerSlider.innerHTML += `<div class="${value.class}" id="${
      value.id
    }"><p> ${index + 1} </p></div>`;
  });
}

function renderDot(value, index) {
  dotContainer.innerHTML += `<div onclick={onClickDot('${index * 4}')} class="${
    value.class
  }" id="${value.id}"></div>`;
  if (value.id == "dot1")
    document.getElementById(value.id).style.backgroundColor = "black";
}

function initListDot() {
  let nDot = Math.ceil(listItem.length / numberOfItemInDot);
  for (let i = 0; i < nDot; i++) {
    let dotValue = {
      id: `dot${i + 1}`,
      class: "dot",
      itemDepend: [],
    };

    listDot.push(dotValue);
    renderDot(dotValue, i);
  }
  putItemDependToDot();
}

function putItemDependToDot() {
  for (let i = 0; i < listItem.length; i++) {
    let dotIndex = getIndexDot(i);
    listDot[dotIndex].itemDepend.push(i);
  }
}

function getIndexDot(indexItem) {
  return Math.floor(indexItem / numberOfItemInDot);
}

function getElementOffsetXByIndex(index) {
  return document.getElementById(listItem[index].id).offsetLeft;
}

function onSelectedDot() {
  let outer = sliderContainer.getBoundingClientRect();
  let listLeft = [];
  listItem.forEach((element, index) => {
    let item = document.getElementById(element.id).getBoundingClientRect();
    let dotIndex = getIndexDot(index);
    if (item.left >= outer.left && item.left < outer.right) {
      listLeft.push(item.left)
      renderDotActive(dotIndex);
    }
    if(listLeft[0] === 0) renderDotActive(0);
  });
}

function renderDotActive(dotIndex) {
  for (let j = 0; j < listDot.length; j++) {
    if (dotIndex == j)
      document.getElementById(listDot[j].id).style.backgroundColor = "black";
    else
      document.getElementById(listDot[j].id).style.backgroundColor =
      "transparent";
  }
}

function onClickDot(index) {
  let item = document
    .getElementById(listItem[listDot[getIndexDot(index)].itemDepend[0]].id);

  item.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest"
  })
}



function onScroll() {
  onSelectedDot();
}