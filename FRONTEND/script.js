// A JSON adat, amit küldünk a szervernek
// const requestData = {
//   "width": 5.2,
//   "length": 2.4,
//   "furnitures": [
//       { "name": "agy", "width": 1.3, "length": 2 },
//       { "name": "szekreny", "width": 1.7, "length": 0.6 },
//       { "name": "szonyeg", "width": 0.8, "length": 1.8 },
//       { "name": "ejjeli szekreny", "width": 0.5, "length": 0.5 },
//       { "name": "szonyeg", "width": 1.2, "length": 0.4 },
//       { "name": "szek", "width": 0.5, "length": 0.8 },
//       { "name": "szek", "width": 0.5, "length": 0.7 },
//       { "name": "komod", "width": 1.3, "length": 0.8 }
//   ]
// };

const furnituresContainer = document.getElementById('furnituresContainer');
const roomForm = document.getElementById('roomForm');

function addFurniture() {
  const furnitureIndex = furnituresContainer.children.length;

  const furnitureDiv = document.createElement('div');
  furnitureDiv.className = 'furniture-item';
  furnitureDiv.innerHTML = `
    <label>Név:</label><br>
    <input type="text" name="name" required placeholder="Ágy"><br>
    <label>Szélesség (m):</label><br>
    <input type="number" step="0.01" name="width" required placeholder="4.3 m"><br>
    <label>Hosszúság (m):</label><br>
    <input type="number" step="0.01" name="length" required placeholder="5.2 m"><br>
    <button type="button" onclick="removeFurniture(this)" class="mt-3 btn btn-danger">Eltávolítás</button>
  `;
  
  furnituresContainer.appendChild(furnitureDiv);
}

function removeFurniture(button) {
  button.parentElement.remove();
}

roomForm.addEventListener('submit', function(event) {
  document.getElementById("matrix-table").innerHTML = ""
  event.preventDefault();

  const width = parseFloat(document.getElementById('roomWidth').value);
  const length = parseFloat(document.getElementById('roomLength').value);

  const furnitureElements = furnituresContainer.children;
  const furnitures = [];

  for (let furniture of furnitureElements) {
    const name = furniture.querySelector('input[name="name"]').value;
    const furnitureWidth = parseFloat(furniture.querySelector('input[name="width"]').value);
    const furnitureLength = parseFloat(furniture.querySelector('input[name="length"]').value);

    furnitures.push({
      name: name,
      width: furnitureWidth,
      length: furnitureLength
    });
  }

  const requestData = {
    width: width,
    length: length,
    furnitures: furnitures
  };

  sendRequest(requestData);
});


function sendRequest(requestData) {
  fetch('https://localhost:7241/RoomApi', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
      createMatrix(data, requestData)
  })
  .catch(error => {
      console.error('Hiba történt a kérés során:', error);
  });
}

function createMatrix(room, requestData) {
  const table = document.getElementById('matrix-table');
  const columns = room[0].length;
  const rows = room.length;
  
  for (let row = 0; row < rows; row++) {
    const tr = document.createElement('tr');
    for (let col = 0; col < columns; col++) {
        const td = document.createElement('td');
        td.textContent = room[row][col];
        td.id = `${row}-${col}`;
        tr.appendChild(td); 
    }
    table.appendChild(tr);
  }

  let x = 0
  let y = 0
  let number = room[0][0]
  let counter = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (room[row][col] !== number) {
        if (number !== -1 && number !== 0) {
          setColspan(x, y, counter);
        }
        x = row
        y = col
        number = room[row][col]
        counter = 0
      }
      if (room[row][col] === number) {
        counter++
      }
    }
  }

  const children = table.children; 
  const elementsByNumber = {};

  for (let i = 0; i < children.length; i++) {
    for (let j = 0; j < children[i].children.length; j++) {
      const cell = children[i].children[j];
      const number = cell.innerHTML.trim();

      if (!isNaN(number) && number !== "") {
        const numKey = Number(number);
        if (!elementsByNumber[numKey]) {
            elementsByNumber[numKey] = [];
        }
        elementsByNumber[numKey].push(cell);
      }
    }
  }

  for (let key of Object.keys(elementsByNumber)) {
    if (key !== "0" && key !== "-1") {
      let id = elementsByNumber[key][0].id.split("-")
      setRowspan(id[0], id[1], elementsByNumber[key].length, elementsByNumber[key])
    }
  }

  for (let i = 0; i < children.length; i++) {
    for (let j = 0; j < children[i].children.length; j++) {
      let id = children[i].children[j].id.split("-")
      let element = children[i].children[j]
      element.innerHTML = requestData.furnitures[room[id[0]][id[1]]-1]?.name || -1
      element.style.backgroundColor = element.innerHTML.trim() === "-1" ? "white" : getRandomColor();
      element.style.color = "white"
    }
  }
}

function setColspan(row, col, colspan) {
  const cell = document.getElementById(`${row}-${col}`);
  if (cell) {
    cell.setAttribute('colspan', colspan);
  }
  for (let i = col+1; i < col+colspan; i++) {
    document.getElementById(`${row}-${i}`).remove()
  }
}

function setRowspan(row, col, rowspan, items) {
  const cell = document.getElementById(`${row}-${col}`);
  if (cell) {
      cell.setAttribute('rowspan', rowspan);
  }
  for (let i = 1; i < items.length; i++) {
    items[i].remove()
  }
}

function getRandomColor() {
  const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  return randomHex;
}