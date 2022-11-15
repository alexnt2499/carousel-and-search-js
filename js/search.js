let searchContent = document.querySelector(".search-content");
let searchInput = document.getElementById("search-input");
let sortBtn = document.querySelector(".sort-btn");
let addressBtn = document.querySelector(".address-btn");

let listPeople = [];
let listSearch = [];
let listGroupAddress = [];

function onSearchInputChange() {
  let keyword = searchInput.value;
  listSearch = listPeople.filter((value) => {
    let sumString = `${value.name}${value.address}${value.category}`;
    return sumString.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
  });
  renderListItem();
}

(function () {
  fetch("./../data/people.json").then((response) => {
    response.json().then((value) => {
      listPeople = value;
      listSearch = value;
      renderListItem();
    });
  });
})();

function renderListItem() {
  searchContent.innerHTML = null;
  listSearch.forEach((element) => {
    searchContent.innerHTML += `<div class="people-box">
        <img src="https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg" width="50px" height="50px" alt="avatar" style="border-radius: 50%; object-fit: cover;">
        <div class="info">
            <p class="name">${element.name}</p>
            <p class="address">${element.address}</p>
            <p class="category">${element.category}</p>
        </div>
    </div>`;
  });
}

function renderListItemGroup() {
  searchContent.innerHTML = null;
  listGroupAddress.forEach((element) => {
    searchContent.innerHTML += `<div class="group-title" id="${element.title}"><span class="group-title-text">${element.title}</span></div>`;
    let title = document.getElementById(element.title);
    element.group.forEach((element) => {
      title.innerHTML += `<div class="people-box">
          <img src="https://lwlies.com/wp-content/uploads/2017/04/avatar-2009-1108x0-c-default.jpg" width="50px" height="50px" alt="avatar" style="border-radius: 50%; object-fit: cover;">
          <div class="info">
              <p class="name">${element.name}</p>
              <p class="address">${element.address}</p>
              <p class="category">${element.category}</p>
          </div>
      </div>`;
  })
  
  });
}

function sortAZ() {
  listSearch.sort(function (a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  renderListItem();
}

function refreshSearch() {
  searchInput.value = "";
  listSearch = [...listPeople];
  renderListItem();
}

function groupFollowAddress() {
  let listGroup = [];
  for (let i = 0; i < listSearch.length; i++) {
    const element = listSearch[i];
    listGroup.push(genAddress(element.address.split(" ")));
  }

  let clearGroup = clearGroupAddress(listGroup.map((value) => value.sumString));
  groupItem(clearGroup);
}

function genAddress(arrAddress) {
  let result = [];
  let sumString = "";
  for (let i = 0; i < arrAddress.length; i++) {
    if (containsString(arrAddress[i].toLowerCase())) {
      result.push(arrAddress[i]);
      sumString += arrAddress[i] + " ";
    }
  }
  return {
    sumString: sumString.replace("St", "").trim(),
    result,
  };
}

function containsString(str) {
  return /[a-z]/.test(str);
}

function clearGroupAddress(listGroup) {
  listGroup.sort(function (a, b) {
    if (a.length < b.length) return -1;
    if (a.length > b.length) return 1;
    return 0;
  });
  let groupTitle = "";
  for (let i = 0; i < listGroup.length; i++) {
    const element = listGroup[i].trim();
    if (groupTitle.toLowerCase().indexOf(element.toLowerCase()) == -1) {
      groupTitle += element + ":";
    }
  }
  return groupTitle
    .split(":")
    .filter((value) => value)
    .map((value) => ({
      title: value,
      group: [],
    }));
}

function groupItem(groupTitle) {
  let groupTitleTemp = [...groupTitle];
  for (let i = 0; i < groupTitleTemp.length; i++) {
    const elementTitle = groupTitleTemp[i];
    for (let j = 0; j < listSearch.length; j++) {
      const elementSearch = listSearch[j];
      if (elementSearch.address.indexOf(elementTitle.title) != -1) {
        elementTitle.group.push(listSearch[j]);
      }
    }
  }

  listGroupAddress = groupTitleTemp;
  renderListItemGroup();
}
