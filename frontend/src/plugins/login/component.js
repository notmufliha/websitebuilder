export default (editor, opts = {}) => {
  const domc = editor.DomComponents;

  domc.addType("login-form-component", {
    isComponent: (el) =>
      el.tagName === "FORM" && el.classList.contains("search-form"),
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "divstudent" },
        components: [
          {
            tagName: "link",
            attributes: {
              rel: "stylesheet",
              href: "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css",
            },
          },
          {
            tagName: "script",
            attributes: {
              src: "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
            },
          },
          {
            tagName: "script",
            attributes: {
              src: "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js",
            },
          },
          {
            tagName: "script",
            content: `$(document).ready(function () {
              $("#select1, #select2").select2();
            });`,
          },
          {
            tagName: "form",
            classes: ["search-form"],
            components: [
              {
                tagName: "div",
                classes: ["form-row"],
                components: [
                  {
                    tagName: "div", // Enclosing div
                    style: { "margin-right": "10px !important" },
                    components: [
                      {
                        tagName: "select",
                        attributes: { id: "select1", name: "from", required: true },
                        style: { width: "150px", "margin-right": "10px !important" },
                        components: [
                          {
                            tagName: "option",
                            attributes: { value: "" },
                            components: "From",
                          },
                          {
                            tagName: "option",
                            attributes: { value: "NYC" },
                            components: "New York",
                          },
                          {
                            tagName: "option",
                            attributes: { value: "LAX" },
                            components: "Los Angeles",
                          },
                        ],

                      },
                    ],
                  },
                  {
                    tagName: "div", // Enclosing div
                    style: { "margin-right": "10px !important" },
                    components: [
                      {
                        tagName: "select",
                        attributes: { id: "select2", name: "to", required: true },
                        style: { width: "150px", "margin-right": "10px !important" },
                        components: [
                          {
                            tagName: "option",
                            attributes: { value: "" },
                            components: "To",
                          },
                          {
                            tagName: "option",
                            attributes: { value: "NYC" },
                            components: "New York",
                          },
                          {
                            tagName: "option",
                            attributes: { value: "LAX" },
                            components: "Los Angeles",
                          },
                        ],

                      },
                    ],
                  },
                  {
                    tagName: "input",
                    attributes: { type: "text", name: "departure", required: true },
                    style: { width: "150px", "margin-right": "10px" },
                  },
                  {
                    tagName: "input",
                    attributes: { type: "text", name: "arrival", required: true },
                    style: { width: "150px", "margin-right": "10px" },
                  },
                  {
                    tagName: "select",
                    attributes: { name: "pax" },
                    style: { width: "150px", "margin-right": "10px" },
                    components: [
                      {
                        tagName: "option",
                        attributes: { value: "1" },
                        components: "1",
                      },
                      {
                        tagName: "option",
                        attributes: { value: "2" },
                        components: "2",
                      },
                      {
                        tagName: "option",
                        attributes: { value: "3" },
                        components: "3",
                      },
                      {
                        tagName: "option",
                        attributes: { value: "4" },
                        components: "4",
                      },
                    ],
                  },
                  {
                    tagName: "button",
                    type: "submit",
                    components: "Search",
                    style: { width: "100px" },
                  },
                ],
                style: {
                  display: "flex",
                  "justify-content": "center",
                  "margin-top": "20px",
                },
              },
            ],
          },
        ],
        script: function () {
          const form = this;
          let initialHighlightDone = false;
          async function changeTableContent(chosenDate, from, to) {
            try {
              const response = await fetch("http://localhost:8080/data");
              const dummyData = await response.json(); // Parse JSON directly

              const departureTable = document.getElementById("content-table");

              // Remove existing rows not matching chosenDate
              for (let i = departureTable.rows.length - 1; i > 0; i--) {
                const row = departureTable.rows[i];
                if (row.getAttribute("data-date") !== chosenDate) {
                  row.remove();
                }
              }

              // Check if a row with the same data already exists
              let rowExists = false;
              departureTable.querySelectorAll('tr[data-date="' + chosenDate + '"]').forEach(existingRow => {
                const departure = existingRow.querySelector('td:nth-child(2)').textContent.trim();
                const arrival = existingRow.querySelector('td:nth-child(3)').textContent.trim();
                dummyData.forEach(data => {
                  if (data.date === chosenDate && data.from === from && data.to === to &&
                    data.departure === departure && data.arrival === arrival) {
                    rowExists = true;
                    return;
                  }
                });
              });

              // If the row doesn't exist, add it to the table
              if (!rowExists) {
                dummyData.forEach(data => {
                  if (data.date === chosenDate && data.from === from && data.to === to) {
                    const newRow = `
              <tr data-date="${chosenDate}">
                <td>${data.trainService}</td>
                <td>${data.departure}</td>
                <td>${data.arrival}</td>
                <td>${data.duration}</td>
                <td>${data.availableSeats}</td>
                <td>${data.minFare}</td>
                <td><button class="book-ticket">Book Ticket</button></td>
              </tr>
            `;
                    departureTable.innerHTML += newRow;
                  }
                });
              }

              addBookTicketEventListeners();
            } catch (error) {
              console.error("Error loading data:", error);
            }
          }

          function addBookTicketEventListeners() {
            const bookTicketButtons = document.querySelectorAll('.book-ticket');
            bookTicketButtons.forEach(button => {
              button.addEventListener('click', function () {
                const row = this.closest('tr');
                const rowData = {
                  trainService: row.cells[0].textContent,
                  departure: row.cells[1].textContent,
                  arrival: row.cells[2].textContent,
                  duration: row.cells[3].textContent,
                  availableSeats: row.cells[4].textContent,
                  minFare: row.cells[5].textContent
                };
                localStorage.setItem('selectedTicket', JSON.stringify(rowData));
                window.location.href = 'smth.html';
              });
            });
          }
          form.onsubmit = function (e) {
            e.preventDefault();
            const from = form.querySelector('[name="from"]').value;
            const to = form.querySelector('[name="to"]').value;
            console.log(form.querySelector('[name="departure"]').value)
            const departure = new Date(form.querySelector('[name="departure"]').value);
            console.log(departure)
            const arrival = new Date(form.querySelector('[name="arrival"]').value);
            const pax = form.querySelector('[name="pax"]').value;
            const styleTag = document.createElement("style");
            styleTag.textContent = `
                table {
                  font-family: arial, sans-serif;
                  border-collapse: collapse;
                  width: 100%;
                }
                td, th {
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
                }
                tr:nth-child(even) {
                  background-color: #dddddd;
                }
                .date-table-container {
                  width: 100%;
                  overflow-x: auto;
                }
                .date-table {
                  display: flex;
                  border: 1px solid #dddddd;
                  padding: 5px;
                  justify-content: space-between;
                }
                .date-item {
                  cursor: pointer;
                  flex: 1;
                  text-align: center;
                }
                .selected {
                  background-color: lightblue;
                }
              `;
            document.head.appendChild(styleTag);
            var studentDiv = document.querySelector("div.divstudent");
            var departureDiv = document.querySelector(".date-table-container");
            if (!studentDiv.querySelector(".date-table-container")) {
              departureDiv = document.createElement("div");
              departureDiv.classList.add("date-table-container");
              departureDiv.innerHTML = `
                  <div class="date-table-container" id="dateTableContainer">
                    <div id='dataHeader' style="text-align: center;">
                      <h1 style="text-align: center;">${from} to ${to}</h1>
                    </div>
                    <div class="date-table" id="dateTable">
                    </div>
                  </div>
                  <table id="content-table">
                    <tr>
                      <th>Train service</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Duration</th>
                      <th>Available seats</th>
                      <th>Min. fare</th>
                    </tr>
                  </table>
                `;
              studentDiv.appendChild(departureDiv);
            } else {
              const previousFrom = departureDiv.querySelector('h1').innerText.split(' to ')[0];
              const previousTo = departureDiv.querySelector('h1').innerText.split(' to ')[1];
              if (previousFrom !== from || previousTo !== to) {
                departureDiv.querySelector('h1').innerText = `${from} to ${to}`;
              }
            }
            let currentBaseDate = departure;
            function getDatesRow(chosenDate) {
              const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              let dataItems = [];
              for (let i = -3; i <= 3; i++) {
                const date = new Date(chosenDate);
                date.setDate(chosenDate.getDate() + i);
                const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
                dataItems.push(formattedDate);
              }
              return dataItems;
            }
            function renderDateItems(baseDate) {
              var dateTable = document.getElementById("dateTable");
              dateTable.innerHTML = "";
              let dateItems = getDatesRow(baseDate);
              const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
              const formattedDepartureDate = `${months[departure.getMonth()]} ${departure.getDate()}, ${departure.getFullYear()}`;
              for (let i = 0; i < dateItems.length; i++) {
                let dateItem = document.createElement("div");
                dateItem.className = "date-item";
                dateItem.textContent = dateItems[i];
                dateTable.appendChild(dateItem);
                if (dateItems[i] === formattedDepartureDate) {
                  changeTableContent(dateItem.textContent, from, to);
                  dateItem.classList.add("selected");
                }
                dateItem.addEventListener("click", function () {
                  let selectedDateItems = document.querySelectorAll(".date-item.selected");
                  selectedDateItems.forEach(function (item) {
                    item.classList.remove("selected");
                  });
                  this.classList.add("selected");
                  changeTableContent(this.textContent, from, to);
                });
                if (i === 0) {
                  dateItem.classList.add("nav-button");
                  dateItem.addEventListener("click", loadPreviousDates);
                } else if (i === dateItems.length - 1) {
                  dateItem.classList.add("nav-button");
                  dateItem.addEventListener("click", loadNextDates);
                }
              }
            }
            function loadPreviousDates() {
              currentBaseDate.setDate(currentBaseDate.getDate() - 4);
              renderDateItems(currentBaseDate);
            }
            function loadNextDates() {
              currentBaseDate.setDate(currentBaseDate.getDate() + 4);
              renderDateItems(currentBaseDate);
            }
            renderDateItems(currentBaseDate);
          };
        },
      },
    },
  });
};

// export default (editor, opts = {}) => {
//     const domc = editor.DomComponents;

//     domc.addType('login-form-component', {
//       isComponent: el => el.tagName === 'FORM' && el.classList.contains('search-form'),
//       model: {
//         defaults: {
//           tagName: 'form',
//           classes: ['search-form'],
//           components: [
//             {
//               tagName: 'div',
//               components: [
//                 {
//                   tagName: 'select',
//                   attributes: { name: 'from' },
//                   components: [], // Will be populated dynamically
//                 },
//                 {
//                   tagName: 'button',
//                   components: 'Add Option',
//                   attributes: { type: 'button', 'data-action': 'add-from-option', style: 'display:none;' }
//                 }
//               ]
//             },
//             {
//               tagName: 'div',
//               components: [
//                 {
//                   tagName: 'select',
//                   attributes: { name: 'to' },
//                   components: [], // Will be populated dynamically
//                 },
//                 {
//                   tagName: 'button',
//                   components: 'Add Option',
//                   attributes: { type: 'button', 'data-action': 'add-to-option', style: 'display:none;' }
//                 }
//               ]
//             },
//             {
//               tagName: 'input',
//               attributes: { type: 'date', name: 'departure' },
//             },
//             {
//               tagName: 'input',
//               attributes: { type: 'date', name: 'arrival' },
//             },
//             {
//               tagName: 'select',
//               attributes: { name: 'pax' },
//               components: [
//                 { tagName: 'option', attributes: { value: '1' }, components: '1' },
//                 { tagName: 'option', attributes: { value: '2' }, components: '2' },
//                 { tagName: 'option', attributes: { value: '3' }, components: '3' },
//                 { tagName: 'option', attributes: { value: '4' }, components: '4' },
//               ],
//             },
//             {
//               tagName: 'button',
//               type: 'submit',
//               components: 'Search',
//             },
//           ],
//           script: function() {
//             const form = this;

//             const loadOptions = (selectName, defaultOptions) => {
//               const storedOptions = JSON.parse(localStorage.getItem(selectName)) || defaultOptions;
//               const select = form.querySelector(`select[name="${selectName}"]`);
//               select.innerHTML = ''; // Clear existing options
//               storedOptions.forEach(option => {
//                 const newOption = document.createElement('option');
//                 newOption.value = option.value;
//                 newOption.text = option.text;
//                 select.appendChild(newOption);
//               });
//             };

//             const saveOptions = (selectName) => {
//               const select = form.querySelector(`select[name="${selectName}"]`);
//               const options = Array.from(select.options).map(option => ({
//                 value: option.value,
//                 text: option.text,
//               }));
//               localStorage.setItem(selectName, JSON.stringify(options));
//               updateModel(select);
//             };

//             form.onsubmit = function(e) {
//               e.preventDefault();
//               alert(
//                 'Search for: ' +
//                 form.querySelector('[name="from"]').value + ' to ' +
//                 form.querySelector('[name="to"]').value +
//                 ' departing on ' + form.querySelector('[name="departure"]').value +
//                 ' arriving on ' + form.querySelector('[name="arrival"]').value +
//                 ' with ' + form.querySelector('[name="pax"]').value + ' passengers'
//               );
//             };

//             // Add option functionality
//             form.querySelectorAll('[data-action="add-from-option"]').forEach(button => {
//               button.onclick = function() {
//                 const select = form.querySelector('select[name="from"]');
//                 const newValue = prompt('Enter new option value:');
//                 const newText = prompt('Enter new option text:');
//                 if (newValue && newText) {
//                   const newOption = document.createElement('option');
//                   newOption.value = newValue;
//                   newOption.text = newText;
//                   select.appendChild(newOption);
//                   saveOptions('from');
//                 }
//               };
//             });

//             form.querySelectorAll('[data-action="add-to-option"]').forEach(button => {
//               button.onclick = function() {
//                 const select = form.querySelector('select[name="to"]');
//                 const newValue = prompt('Enter new option value:');
//                 const newText = prompt('Enter new option text:');
//                 if (newValue && newText) {
//                   const newOption = document.createElement('option');
//                   newOption.value = newValue;
//                   newOption.text = newText;
//                   select.appendChild(newOption);
//                   saveOptions('to');
//                 }
//               };
//             });

//             // Make options editable
//             form.querySelectorAll('select').forEach(select => {
//               select.addEventListener('dblclick', function(event) {
//                 const option = event.target;
//                 if (option.tagName === 'OPTION') {
//                   const newText = prompt('Edit option text:', option.text);
//                   if (newText) {
//                     option.text = newText;
//                     saveOptions(select.name);
//                   }
//                 }
//               });
//             });

//             // Load options from storage or defaults
//             loadOptions('from', [
//               { value: '', text: 'From' },
//               { value: 'NYC', text: 'New York' },
//               { value: 'LAX', text: 'Los Angeles' },
//             ]);
//             loadOptions('to', [
//               { value: '', text: 'To' },
//               { value: 'NYC', text: 'New York' },
//               { value: 'LAX', text: 'Los Angeles' },
//             ]);

//             // Update component model
//             const updateModel = (select) => {
//                 const editor = select.closest('.gjs-editor').gjsEditor; // Get the editor instance
//                 const model = editor.getSelected();
//                 console.log(model)
//                 const selectComponent = model.find(`[name="${select.name}"]`)[0];
//                 console.log(selectComponent)
//                 if (selectComponent) {
//                   const components = Array.from(select.options).map(option => ({
//                     tagName: 'option',
//                     attributes: { value: option.value },
//                     components: option.text,
//                   }));
//                   selectComponent.components(components);
//                 }
//               };

//           },
//         },
//       },
//       view: {
//         onRender() {
//           const comps = this.model.get('components');
//           if (!comps.length) {
//             this.model.add([
//               {
//                 tagName: 'div',
//                 components: [
//                   {
//                     tagName: 'select',
//                     attributes: { name: 'from' },
//                     components: [], // Will be populated dynamically
//                   },
//                   {
//                     tagName: 'button',
//                     components: 'Add Option',
//                     attributes: { type: 'button', 'data-action': 'add-from-option', style: 'display:none;' }
//                   }
//                 ]
//               },
//               {
//                 tagName: 'div',
//                 components: [
//                   {
//                     tagName: 'select',
//                     attributes: { name: 'to' },
//                     components: [], // Will be populated dynamically
//                   },
//                   {
//                     tagName: 'button',
//                     components: 'Add Option',
//                     attributes: { type: 'button', 'data-action': 'add-to-option', style: 'display:none;' }
//                   }
//                 ]
//               },
//               {
//                 tagName: 'input',
//                 attributes: { type: 'date', name: 'departure' },
//               },
//               {
//                 tagName: 'input',
//                 attributes: { type: 'date', name: 'arrival' },
//               },
//               {
//                 tagName: 'select',
//                 attributes: { name: 'pax' },
//                 components: [
//                   { tagName: 'option', attributes: { value: '1' }, components: '1' },
//                   { tagName: 'option', attributes: { value: '2' }, components: '2' },
//                   { tagName: 'option', attributes: { value: '3' }, components: '3' },
//                   { tagName: 'option', attributes: { value: '4' }, components: '4' },
//                 ],
//               },
//               {
//                 tagName: 'button',
//                 type: 'submit',
//                 components: 'Search',
//               },
//             ]);
//           }

//           // Show add option buttons only in development mode
//           editor.on('load', () => {
//             this.el.querySelectorAll('[data-action="add-from-option"]').forEach(button => button.style.display = 'inline-block');
//             this.el.querySelectorAll('[data-action="add-to-option"]').forEach(button => button.style.display = 'inline-block');
//           });

//           // Hide add option buttons in view mode
//           editor.on('run:preview', () => {
//             this.el.querySelectorAll('[data-action="add-from-option"]').forEach(button => button.style.display = 'none');
//             this.el.querySelectorAll('[data-action="add-to-option"]').forEach(button => button.style.display = 'none');
//           });

//           editor.on('stop:preview', () => {
//             this.el.querySelectorAll('[data-action="add-from-option"]').forEach(button => button.style.display = 'inline-block');
//             this.el.querySelectorAll('[data-action="add-to-option"]').foreEach(button => button.style.display = 'inline-block');
//         });
//         },
//         },
//         });
//         }

// export default (editor, opts = {}) => {
//     const domc = editor.DomComponents;

//     domc.addType('login-form-component', {
//         isComponent: el => el.tagName === 'FORM' && el.classList.contains('search-form'),
//         model: {
//             defaults: {
//                 tagName: 'form',
//                 classes: ['search-form'],
//                 components: [
//                     {
//                         tagName: 'select',
//                         attributes: { name: 'from' },
//                         components: [
//                             { tagName: 'option', attributes: { value: '' }, components: 'From' },
//                             { tagName: 'option', attributes: { value: 'NYC' }, components: 'New York' },
//                             { tagName: 'option', attributes: { value: 'LAX' }, components: 'Los Angeles' },
//                         ],
//                     },
//                     {
//                         tagName: 'select',
//                         attributes: { name: 'to' },
//                         components: [
//                             { tagName: 'option', attributes: { value: '' }, components: 'To' },
//                             { tagName: 'option', attributes: { value: 'NYC' }, components: 'New York' },
//                             { tagName: 'option', attributes: { value: 'LAX' }, components: 'Los Angeles' },
//                         ],
//                     },
//                     {
//                         tagName: 'input',
//                         attributes: { type: 'date', name: 'departure' },
//                     },
//                     {
//                         tagName: 'input',
//                         attributes: { type: 'date', name: 'arrival' },
//                     },
//                     {
//                         tagName: 'select',
//                         attributes: { name: 'pax' },
//                         components: [
//                             { tagName: 'option', attributes: { value: '1' }, components: '1' },
//                             { tagName: 'option', attributes: { value: '2' }, components: '2' },
//                             { tagName: 'option', attributes: { value: '3' }, components: '3' },
//                             { tagName: 'option', attributes: { value: '4' }, components: '4' },
//                         ],
//                     },
//                     {
//                         tagName: 'button',
//                         type: 'submit',
//                         components: 'Search',
//                     },
//                 ],
//                 script: function () {
//                     const form = this;
//                     form.onsubmit = function (e) {
//                         e.preventDefault();
//                         alert(
//                             'Search for: ' +
//                             form.querySelector('[name="from"]').value + ' to ' +
//                             form.querySelector('[name="to"]').value +
//                             ' departing on ' + form.querySelector('[name="departure"]').value +
//                             ' arriving on ' + form.querySelector('[name="arrival"]').value +
//                             ' with ' + form.querySelector('[name="pax"]').value + ' passengers'
//                         );
//                     };
//                 },
//             },
//         },
//         view: {
//             onRender() {
//                 const comps = this.model.get('components');
//                 if (!comps.length) {
//                     this.model.add([
//                         {
//                             tagName: 'select',
//                             attributes: { name: 'from' },
//                             components: [
//                                 { tagName: 'option', attributes: { value: '' }, components: 'From' },
//                                 { tagName: 'option', attributes: { value: 'NYC' }, components: 'New York' },
//                                 { tagName: 'option', attributes: { value: 'LAX' }, components: 'Los Angeles' },
//                             ],
//                         },
//                         {
//                             tagName: 'select',
//                             attributes: { name: 'to' },
//                             components: [
//                                 { tagName: 'option', attributes: { value: '' }, components: 'To' },
//                                 { tagName: 'option', attributes: { value: 'NYC' }, components: 'New York' },
//                                 { tagName: 'option', attributes: { value: 'LAX' }, components: 'Los Angeles' },
//                             ],
//                         },
//                         {
//                             tagName: 'input',
//                             attributes: { type: 'date', name: 'departure' },
//                         },
//                         {
//                             tagName: 'input',
//                             attributes: { type: 'date', name: 'arrival' },
//                         },
//                         {
//                             tagName: 'select',
//                             attributes: { name: 'pax' },
//                             components: [
//                                 { tagName: 'option', attributes: { value: '1' }, components: '1' },
//                                 { tagName: 'option', attributes: { value: '2' }, components: '2' },
//                                 { tagName: 'option', attributes: { value: '3' }, components: '3' },
//                                 { tagName: 'option', attributes: { value: '4' }, components: '4' },
//                             ],
//                         },
//                         {
//                             tagName: 'button',
//                             type: 'submit',
//                             components: 'Search',
//                         },
//                     ]);
//                 }
//             },
//         },
//     });
// };

// export default (editor, opts = {}) => {
//     const domc = editor.DomComponents;
//     domc.addType('login-form-component', {
//       isComponent: el => el.tagName === 'FORM' && el.classList.contains('login-form'),
//       model: {
//         defaults: {
//           tagName: 'form',
//           classes: ['login-form'],
//           components: [
//             {
//               tagName: 'input',
//               type: 'text',
//               attributes: { placeholder: 'Username', name: 'username' },
//             },
//             {
//               tagName: 'input',
//               type: 'password',
//               attributes: { placeholder: 'Password', name: 'password' },
//             },
//             {
//               tagName: 'button',
//               type: 'submit',
//               components: 'Login',
//             },
//           ],
//           script: function() {
//             const form = this;
//             form.onsubmit = function(e) {
//               e.preventDefault();
//               alert('Submitted: ' + form.querySelector('[name="username"]').value);
//             };
//           },
//         },
//       },
//       view: {
//         onRender() {
//           const comps = this.model.get('components');
//           if (!comps.length) {
//             this.model.add([
//               { type: 'text', components: 'Username:' },
//               { tagName: 'input', attributes: { type: 'text', name: 'username' } },
//               { type: 'text', components: 'Password:' },
//               { tagName: 'input', attributes: { type: 'password', name: 'password' } },
//               { tagName: 'button', attributes: { type: 'submit' }, components: 'Login' },
//             ]);
//           }
//         },
//       },
//     });
//    };
