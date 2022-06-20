window.onload = init;

const BASE_URL = "https://swapi.dev/api/";
let collections = [];
let currentCollection;
let collectionName;
let nextPageUrl = "";
let prevPageUrl = "";

const nextPageBtn = document.getElementById("nextPageBtn-js");
const prevPageBtn = document.getElementById("prevPageBtn-js");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
nextPageBtn.addEventListener("click", nextPage);
prevPageBtn.addEventListener("click", prevPage);
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("searchBtn").click();
  }
});
//searchBtn.addEventListener("click", searchElement);

class Person {
  constructor(url, name, birth_year, height, mass, created) {
    this.url = url;
    this.name = name;
    this.birth_year = birth_year;
    this.height = height;
    this.mass = mass;
    this.created = created.slice(0, 10).split("-").reverse().join("-");
  }
}

class Planet {
  constructor(url, name, terrain, population, climate, created) {
    this.url = url;
    this.name = name;
    this.terrain = terrain;
    this.population = population;
    this.climate = climate;
    this.created = created.slice(0, 10).split("-").reverse().join("-");
  }
}

class Film {
  constructor(url, title, director, episode_id, release_date, created) {
    this.url = url;
    this.title = title;
    this.director = director;
    this.episode_id = episode_id;
    this.release_date = release_date;
    this.created = created.slice(0, 10).split("-").reverse().join("-");
  }
}

class Species {
  constructor(url, name, language, designation, classification, created) {
    this.url = url;
    this.name = name;
    this.language = language;
    this.designation = designation;
    this.classification = classification;
    this.created = created.slice(0, 10).split("-").reverse().join("-");
  }
}

class Vehicle {
  constructor(url, name, model, vehicle_class, crew, created) {
    this.url = url;
    this.name = name;
    this.model = model;
    this.vehicle_class = vehicle_class;
    this.crew = crew;
    this.created = created.slice(0, 10).split("-").reverse().join("-");
  }
}

class Starship {
  constructor(url, name, model, length, crew, created) {
    this.url = url;
    this.name = name;
    this.model = model;
    this.length = length;
    this.crew = crew;
    this.created = created.slice(0, 10).split("-").reverse().join("-");
  }
}

async function init() {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  console.log("data: ", data);

  Object.entries(data).map(([key, value]) => {
    collections.push(key);
  });

  createButtons();
}

function createButtons() {
  collections.forEach((collection) => {
    const button = document.createElement("button");
    document.getElementById("nav-buttons-js").appendChild(button);
    button.innerHTML = collection[0].toUpperCase() + collection.slice(1);
    button.className = "button";
    button.addEventListener("click", handleButtonClick);
  });
}

async function fetchCollection(collection, url) {
  fetchUrl = url ? url : `${BASE_URL}${collection}`;
  const response = await fetch(fetchUrl);
  currentCollection = await response.json();
  nextPageUrl = currentCollection.next;
  prevPageUrl = currentCollection.previous;
  console.log("currentCollection: ", currentCollection);
  console.log("fetchUrl: ", fetchUrl);
  console.log("nextPageUrl: ", nextPageUrl);
  console.log("prevPageUrl: ", prevPageUrl);
}

async function handleButtonClick(event) {
  collectionName = event.target.innerHTML.toLowerCase();
  await fetchCollection(collectionName);

  console.log("collectionName: ", collectionName);
  console.log("currentCollection: ", currentCollection);

  renderTable();
}

function getId(url) {
  return url.split("/").reverse().slice(1, 2).join();
}

function renderTable() {
  const tableHead = document.querySelector("thead");
  const tableBody = document.querySelector("tbody");

  let headers = [];

  switch (collectionName) {
    case "people":
      const peopleInstances = currentCollection.results.map(
        ({ url, name, birth_year, height, mass, created }) =>
          new Person(url, name, birth_year, height, mass, created)
      );
      console.log("peopleInstances: ", peopleInstances);
      for (key in peopleInstances[0]) {
        headers.push(key.toUpperCase());
      }
      headers[0] = "ID";
      headers.push("ACTIONS");

      tableHead.innerHTML = "<tr></tr>";
      tableBody.innerHTML = "";

      for (headerText of headers) {
        const headerElement = document.createElement("th");

        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
      }

      peopleInstances.forEach((person) => {
        const tr = document.createElement("tr");

        tr.setAttribute("data-id", `${person.url}`);
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Delete";
        removeBtn.className = "actions-button";
        removeBtn.id = "removeBtn-js";
        const showDetailsBtn = document.createElement("button");
        showDetailsBtn.innerText = "Details";
        showDetailsBtn.id = person.url;
        showDetailsBtn.className = "actions-button";
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");

        td1.innerHTML = getId(person.url);
        td2.innerHTML = person.name;
        td3.innerHTML = person.birth_year;
        td4.innerHTML = person.height;
        td5.innerHTML = person.mass;
        td6.innerHTML = person.created;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(removeBtn);
        tr.appendChild(showDetailsBtn);

        tableBody.appendChild(tr);
        removeBtn.addEventListener("click", deleteRow);
        showDetailsBtn.addEventListener("click", async () => {
          const tableHeadDetails = document.querySelector(".thead-details");
          const tableBodyDetails = document.querySelector(".tbody-details");

          //   const closeDetails = document.querySelector(".close-details")
          //   closeDetails.className = "button";
          //   closeDetails.innerText = "Close Details";
          //   document.querySelector(".footer").appendChild(closeDetails);

          //   closeDetails.addEventListener("click", () => {
          //     console.log("close details");
          //     document.querySelector(".table-details").classList.add("hide-element")
          //     closeDetails.classList.add("hide-element")
          //   });

          const response = await fetch(person.url);
          const data = await response.json();

          let headers = [];
          let rows = [];
          // const object = {};

          Object.entries(data).map(([key, value]) => {
            headers.push(key);
            rows.push(value);
          });

          //   headers.forEach((headerElement, i) => (result[headerElement] = rows[i]));
          //   console.log("Obiekt: ", result);

          tableHeadDetails.innerHTML = "<tr></tr>";
          tableBodyDetails.innerHTML = "<tr></tr>";

          for (headerText of headers) {
            const headerElement = document.createElement("th");

            headerElement.textContent = headerText;
            tableHeadDetails.querySelector("tr").appendChild(headerElement);
          }

          for (rowText of rows) {
            const rowElement = document.createElement("th");

            rowElement.textContent = rowText;
            tableBodyDetails.querySelector("tr").appendChild(rowElement);
          }
          console.log(headers, rows);
        });
      });
      break;

    case "planets":
      const planetsInstances = currentCollection.results.map(
        ({ url, name, terrain, population, climate, created }) =>
          new Planet(url, name, terrain, population, climate, created)
      );

      console.log("plametsInstances: ", planetsInstances);
      for (key in planetsInstances[0]) {
        headers.push(key.toUpperCase());
      }
      headers[0] = "ID";
      headers.push("ACTIONS");

      tableHead.innerHTML = "<tr></tr>";
      tableBody.innerHTML = "";

      for (headerText of headers) {
        const headerElement = document.createElement("th");

        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
      }

      planetsInstances.forEach((planet) => {
        const tr = document.createElement("tr");

        tr.setAttribute("data-id", `${planet.url}`);
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Delete";
        removeBtn.className = "actions-button";
        removeBtn.id = "removeBtn-js";
        const showDetailsBtn = document.createElement("button");
        showDetailsBtn.innerText = "Details";
        showDetailsBtn.id = planet.url;
        showDetailsBtn.className = "actions-button";

        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");

        td1.innerHTML = getId(planet.url);
        td2.innerHTML = planet.name;
        td3.innerHTML = planet.terrain;
        td4.innerHTML = planet.population;
        td5.innerHTML = planet.climate;
        td6.innerHTML = planet.created;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(removeBtn);
        tr.appendChild(showDetailsBtn);

        tableBody.appendChild(tr);

        removeBtn.addEventListener("click", deleteRow);
        showDetailsBtn.addEventListener("click", async () => {
          const tableHeadDetails = document.querySelector(".thead-details");
          const tableBodyDetails = document.querySelector(".tbody-details");

          const response = await fetch(planet.url);
          const data = await response.json();

          let headers = [];
          let rows = [];

          Object.entries(data).map(([key, value]) => {
            headers.push(key);
            rows.push(value);
          });

          tableHeadDetails.innerHTML = "<tr></tr>";
          tableBodyDetails.innerHTML = "<tr></tr>";

          for (headerText of headers) {
            const headerElement = document.createElement("th");

            headerElement.textContent = headerText;
            tableHeadDetails.querySelector("tr").appendChild(headerElement);
          }

          for (rowText of rows) {
            const rowElement = document.createElement("th");

            rowElement.textContent = rowText;
            tableBodyDetails.querySelector("tr").appendChild(rowElement);
          }
          console.log(headers, rows);
        });
      });
      break;
    case "films":
      const filmsInstances = currentCollection.results.map(
        ({ url, title, director, episode_id, release_date, created }) =>
          new Film(url, title, director, episode_id, release_date, created)
      );
      console.log("filmsInstances: ", filmsInstances);

      for (key in filmsInstances[0]) {
        headers.push(key.toUpperCase());
      }
      headers[0] = "ID";
      headers.push("ACTIONS");

      tableHead.innerHTML = "<tr></tr>";
      tableBody.innerHTML = "";

      for (headerText of headers) {
        const headerElement = document.createElement("th");

        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
      }

      filmsInstances.forEach((film) => {
        const tr = document.createElement("tr");

        tr.setAttribute("data-id", `${film.url}`);
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Delete";
        removeBtn.className = "actions-button";
        removeBtn.id = "removeBtn-js";
        const showDetailsBtn = document.createElement("button");
        showDetailsBtn.innerText = "Details";
        showDetailsBtn.id = film.url;
        showDetailsBtn.className = "actions-button";
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");

        td1.innerHTML = getId(film.url);
        td2.innerHTML = film.title;
        td3.innerHTML = film.director;
        td4.innerHTML = film.episode_id;
        td5.innerHTML = film.release_date;
        td6.innerHTML = film.created;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(removeBtn);
        tr.appendChild(showDetailsBtn);

        tableBody.appendChild(tr);

        removeBtn.addEventListener("click", deleteRow);
        showDetailsBtn.addEventListener("click", async () => {
          const tableHeadDetails = document.querySelector(".thead-details");
          const tableBodyDetails = document.querySelector(".tbody-details");

          const response = await fetch(film.url);
          const data = await response.json();

          let headers = [];
          let rows = [];

          Object.entries(data).map(([key, value]) => {
            headers.push(key);
            rows.push(value);
          });

          tableHeadDetails.innerHTML = "<tr></tr>";
          tableBodyDetails.innerHTML = "<tr></tr>";

          for (headerText of headers) {
            const headerElement = document.createElement("th");

            headerElement.textContent = headerText;
            tableHeadDetails.querySelector("tr").appendChild(headerElement);
          }

          for (rowText of rows) {
            const rowElement = document.createElement("th");

            rowElement.textContent = rowText;
            tableBodyDetails.querySelector("tr").appendChild(rowElement);
          }
          console.log(headers, rows);
        });
      });

      break;
    case "species":
      const speciesInstances = currentCollection.results.map(
        ({ url, name, language, designation, classification, created }) =>
          new Species(url, name, language, designation, classification, created)
      );
      console.log(speciesInstances);

      for (key in speciesInstances[0]) {
        headers.push(key.toUpperCase());
      }
      headers[0] = "ID";
      headers.push("ACTIONS");

      tableHead.innerHTML = "<tr></tr>";
      tableBody.innerHTML = "";

      for (headerText of headers) {
        const headerElement = document.createElement("th");

        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
      }

      speciesInstances.forEach((species) => {
        const tr = document.createElement("tr");

        tr.setAttribute("data-id", `${species.url}`);
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Delete";
        removeBtn.className = "actions-button";
        removeBtn.id = "removeBtn-js";
        const showDetailsBtn = document.createElement("button");
        showDetailsBtn.innerText = "Details";
        showDetailsBtn.id = species.url;
        showDetailsBtn.className = "actions-button";
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");

        td1.innerHTML = getId(species.url);
        td2.innerHTML = species.name;
        td3.innerHTML = species.language;
        td4.innerHTML = species.designation;
        td5.innerHTML = species.classification;
        td6.innerHTML = species.created;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(removeBtn);
        tr.appendChild(showDetailsBtn);

        tableBody.appendChild(tr);

        removeBtn.addEventListener("click", deleteRow);
        showDetailsBtn.addEventListener("click", async () => {
          const tableHeadDetails = document.querySelector(".thead-details");
          const tableBodyDetails = document.querySelector(".tbody-details");

          const response = await fetch(species.url);
          const data = await response.json();

          let headers = [];
          let rows = [];

          Object.entries(data).map(([key, value]) => {
            headers.push(key);
            rows.push(value);
          });

          tableHeadDetails.innerHTML = "<tr></tr>";
          tableBodyDetails.innerHTML = "<tr></tr>";

          for (headerText of headers) {
            const headerElement = document.createElement("th");

            headerElement.textContent = headerText;
            tableHeadDetails.querySelector("tr").appendChild(headerElement);
          }

          for (rowText of rows) {
            const rowElement = document.createElement("th");

            rowElement.textContent = rowText;
            tableBodyDetails.querySelector("tr").appendChild(rowElement);
          }
          console.log(headers, rows);
        });
      });
      break;
    case "vehicles":
      const vehiclesInstances = currentCollection.results.map(
        ({ url, name, model, vehicle_class, crew, created }) =>
          new Vehicle(url, name, model, vehicle_class, crew, created)
      );
      console.log(vehiclesInstances);

      for (key in vehiclesInstances[0]) {
        headers.push(key.toUpperCase());
      }
      headers[0] = "ID";
      headers.push("ACTIONS");

      tableHead.innerHTML = "<tr></tr>";
      tableBody.innerHTML = "";

      for (headerText of headers) {
        const headerElement = document.createElement("th");

        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
      }

      vehiclesInstances.forEach((vehicle) => {
        const tr = document.createElement("tr");

        tr.setAttribute("data-id", `${vehicle.url}`);
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Delete";
        removeBtn.className = "actions-button";
        removeBtn.id = "removeBtn-js";
        const showDetailsBtn = document.createElement("button");
        showDetailsBtn.innerText = "Details";
        showDetailsBtn.id = vehicle.url;
        showDetailsBtn.className = "actions-button";
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");

        td1.innerHTML = getId(vehicle.url);
        td2.innerHTML = vehicle.name;
        td3.innerHTML = vehicle.model;
        td4.innerHTML = vehicle.vehicle_class;
        td5.innerHTML = vehicle.crew;
        td6.innerHTML = vehicle.created;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(removeBtn);
        tr.appendChild(showDetailsBtn);

        tableBody.appendChild(tr);

        removeBtn.addEventListener("click", deleteRow);
        showDetailsBtn.addEventListener("click", async () => {
          const tableHeadDetails = document.querySelector(".thead-details");
          const tableBodyDetails = document.querySelector(".tbody-details");

          const response = await fetch(vehicle.url);
          const data = await response.json();

          let headers = [];
          let rows = [];

          Object.entries(data).map(([key, value]) => {
            headers.push(key);
            rows.push(value);
          });

          tableHeadDetails.innerHTML = "<tr></tr>";
          tableBodyDetails.innerHTML = "<tr></tr>";

          for (headerText of headers) {
            const headerElement = document.createElement("th");

            headerElement.textContent = headerText;
            tableHeadDetails.querySelector("tr").appendChild(headerElement);
          }

          for (rowText of rows) {
            const rowElement = document.createElement("th");

            rowElement.textContent = rowText;
            tableBodyDetails.querySelector("tr").appendChild(rowElement);
          }
          console.log(headers, rows);
        });
      });
      break;
    case "starships":
      const starshipsInstances = currentCollection.results.map(
        ({ url, name, model, length, crew, created }) =>
          new Starship(url, name, model, length, crew, created)
      );
      console.log(starshipsInstances);

      for (key in starshipsInstances[0]) {
        headers.push(key.toUpperCase());
      }
      headers[0] = "ID";
      headers.push("ACTIONS");

      tableHead.innerHTML = "<tr></tr>";
      tableBody.innerHTML = "";

      for (headerText of headers) {
        const headerElement = document.createElement("th");

        headerElement.textContent = headerText;
        tableHead.querySelector("tr").appendChild(headerElement);
      }

      starshipsInstances.forEach((starship) => {
        const tr = document.createElement("tr");

        tr.setAttribute("data-id", `${starship.url}`);
        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Delete";
        removeBtn.className = "actions-button";
        removeBtn.id = "removeBtn-js";
        const showDetailsBtn = document.createElement("button");
        showDetailsBtn.innerText = "Details";
        showDetailsBtn.id = starship.url;
        showDetailsBtn.className = "actions-button";
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const td4 = document.createElement("td");
        const td5 = document.createElement("td");
        const td6 = document.createElement("td");

        td1.innerHTML = getId(starship.url);
        td2.innerHTML = starship.name;
        td3.innerHTML = starship.model;
        td4.innerHTML = starship.length;
        td5.innerHTML = starship.crew;
        td6.innerHTML = starship.created;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(removeBtn);
        tr.appendChild(showDetailsBtn);

        tableBody.appendChild(tr);

        removeBtn.addEventListener("click", deleteRow);
        showDetailsBtn.addEventListener("click", async () => {
          const tableHeadDetails = document.querySelector(".thead-details");
          const tableBodyDetails = document.querySelector(".tbody-details");

          const response = await fetch(starship.url);
          const data = await response.json();

          let headers = [];
          let rows = [];

          Object.entries(data).map(([key, value]) => {
            headers.push(key);
            rows.push(value);
          });

          tableHeadDetails.innerHTML = "<tr></tr>";
          tableBodyDetails.innerHTML = "<tr></tr>";

          for (headerText of headers) {
            const headerElement = document.createElement("th");

            headerElement.textContent = headerText;
            tableHeadDetails.querySelector("tr").appendChild(headerElement);
          }

          for (rowText of rows) {
            const rowElement = document.createElement("th");

            rowElement.textContent = rowText;
            tableBodyDetails.querySelector("tr").appendChild(rowElement);
          }
          console.log(headers, rows);
        });
      });
      break;
  }
}

async function nextPage() {
  if (nextPageUrl) {
    await fetchCollection(collectionName, nextPageUrl);
  }

  renderTable();
}

async function prevPage() {
  if (prevPageUrl) {
    await fetchCollection(collectionName, prevPageUrl);
  }

  renderTable();
}

async function searchElement() {
  const searchInputValue = document.getElementById("searchInput").value;
  let element = `?search=${searchInputValue}`;
  const response = await fetch(`${BASE_URL}${collectionName}${element}`);
  currentCollection = await response.json();

  renderTable();
}

function deleteRow(event) {
  swal({
    title: "Are you sure?",
    icon: "warning",
    buttons: ["NO", "YES"],
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      const btn = event.target;
      btn.closest("tr").remove();
    } else {
      return;
    }
  });
}
