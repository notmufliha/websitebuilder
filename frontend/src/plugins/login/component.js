export default (editor, opts = {}) => {
    const domc = editor.DomComponents;

    domc.addType('login-form-component', {
        isComponent: el => el.tagName === 'FORM' && el.classList.contains('search-form'),
        model: {
            defaults: {
                tagName: 'form',
                classes: ['search-form'],
                components: [
                    {
                        tagName: 'div',
                        classes: ['form-row'],
                        components: [
                            {
                                tagName: 'select',
                                attributes: { name: 'from' },
                                style: { 'width': '150px', 'margin-right': '10px' },
                                components: [
                                    { tagName: 'input', attributes: { value: '' }, components: 'From' },
                                    { tagName: 'option', attributes: { value: '' }, components: 'From' },
                                    { tagName: 'option', attributes: { value: 'NYC' }, components: 'New York' },
                                    { tagName: 'option', attributes: { value: 'LAX' }, components: 'Los Angeles' },
                                ],
                            },
                            {
                                tagName: 'select',
                                attributes: { name: 'to' },
                                style: { 'width': '150px', 'margin-right': '10px' },
                                components: [
                                    { tagName: 'option', attributes: { value: '' }, components: 'To' },
                                    { tagName: 'option', attributes: { value: 'NYC' }, components: 'New York' },
                                    { tagName: 'option', attributes: { value: 'LAX' }, components: 'Los Angeles' },
                                ],
                            },
                            {
                                tagName: 'input',
                                attributes: { type: 'date', name: 'departure' },
                                style: { 'width': '150px', 'margin-right': '10px' },
                            },
                            {
                                tagName: 'input',
                                attributes: { type: 'date', name: 'arrival' },
                                style: { 'width': '150px', 'margin-right': '10px' },
                            },
                            {
                                tagName: 'select',
                                attributes: { name: 'pax' },
                                style: { 'width': '150px', 'margin-right': '10px' },
                                components: [
                                    { tagName: 'option', attributes: { value: '1' }, components: '1' },
                                    { tagName: 'option', attributes: { value: '2' }, components: '2' },
                                    { tagName: 'option', attributes: { value: '3' }, components: '3' },
                                    { tagName: 'option', attributes: { value: '4' }, components: '4' },
                                ],
                            },
                            {
                                tagName: 'button',
                                type: 'submit',
                                components: 'Search',
                                style: { width: '100px' },
                            },
                        ],
                        style: { 'display': 'flex', 'justify-content': 'center', 'margin-top': '20px' },
                    },
                ],
                script: function () {
                    const form = this;
                    let initialHighlightDone = false;
                    function changeTableContent(date) {
                        var companies = document.querySelectorAll('#content-table tr:not(:first-child) td:first-child');
                        companies.forEach(function (company, index) {
                            company.textContent = "New Company " + (index + 1);
                        });
                    }

                    form.onsubmit = function (e) {
                        e.preventDefault();

                        const from = form.querySelector('[name="from"]').value;
                        const to = form.querySelector('[name="to"]').value;
                        const departure = new Date(form.querySelector('[name="departure"]').value);
                        const arrival = new Date(form.querySelector('[name="arrival"]').value);
                        const pax = form.querySelector('[name="pax"]').value;
                        const styleTag = document.createElement('style');
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

                        // Append style tag to the document head
                        document.head.appendChild(styleTag);

                        let departureDiv = document.querySelector('.date-table-container');
                        if (!departureDiv) {
                            departureDiv = document.createElement('div');
                            departureDiv.classList.add('date-table-container');
                            form.parentNode.appendChild(departureDiv);
                        }

                        departureDiv.innerHTML = `
                        <div class="date-table-container" id="dateTableContainer">
                        <div class="date-table" id="dateTable">
                        <h3>Departure</h3>
                          <!-- Date items will be dynamically inserted here -->
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
              <tr>
                <td>Express Thunderbolt</td>
                <td>8:00 AM</td>
                <td>12:30 PM</td>
                <td>4 hours 30 minutes</td>
                <td>120</td>
                <td>$50</td>
              </tr>
              <tr>
                <td>Rapid Rail Runner</td>
                <td>10:15 AM</td>
                <td>3:45 PM</td>
                <td>5 hours 30 minutes</td>
                <td>90</td>
                <td>$45</td>
              </tr>
              <tr>
                <td>Swift Streamliner</td>
                <td>1:30 PM</td>
                <td>6:00 PM</td>
                <td>4 hours 30 minutes</td>
                <td>100</td>
                <td>$55</td>
              </tr>
              <tr>
                <td>Express Eagle</td>
                <td>3:45 PM</td>
                <td>8:15 PM</td>
                <td>4 hours 30 minutes</td>
                <td>80</td>
                <td>$60</td>
              </tr>
              <tr>
                <td>Coastal Voyager</td>
                <td>6:00 PM</td>
                <td>10:30 PM</td>
                <td>4 hours 30 minutes</td>
                <td>110</td>
                <td>$48</td>
              </tr>
              <tr>
                <td>Super Sonic Express</td>
                <td>9:00 PM</td>
                <td>1:30 AM</td>
                <td>4 hours 30 minutes</td>
                <td>70</td>
                <td>$65</td>
              </tr>
              
                      </table>
          `;
                        form.parentNode.appendChild(departureDiv);

                        let startIndex = 0;
                        let endIndex = 3; // Show 4 date items initially
                        let currentBaseDate = departure;

                        function getDatesRow(chosenDate) {
                            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
                            dateTable.innerHTML = ""; // Clear previous date items

                            let dateItems = getDatesRow(baseDate);

                            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            const formattedDepartureDate = `${months[departure.getMonth()]} ${departure.getDate()}, ${departure.getFullYear()}`;
                            for (let i = 0; i < dateItems.length; i++) {
                                let dateItem = document.createElement("div");
                                dateItem.className = "date-item";
                                dateItem.textContent = dateItems[i];
                                dateTable.appendChild(dateItem);

                                // Highlight the initially selected departure date only once
                                if (!initialHighlightDone && dateItems[i] === formattedDepartureDate) {
                                    dateItem.classList.add('selected');
                                    initialHighlightDone = true;  // Set the flag to true after highlighting
                                }
                                // Add event listener to toggle highlighting and call changeTableContent
                                dateItem.addEventListener("click", function () {
                                    // Remove highlighting from previously selected date items
                                    let selectedDateItems = document.querySelectorAll('.date-item.selected');
                                    selectedDateItems.forEach(function (item) {
                                        item.classList.remove('selected');
                                    });


                                    // Add highlighting to the clicked date item
                                    this.classList.add('selected');

                                    // Call changeTableContent with the selected date
                                    changeTableContent(this.textContent);
                                });

                                // Add navigation to previous/next dates
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