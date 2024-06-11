import {
  formRef,
  formContainerRef,
  formItemsRef,
  formFieldsRef
} from './consts'

export default (editor, opt = {}) => {
  const c = opt
  const bm = editor.BlockManager
  const formPfx = c.formClsPfx || 'form'
  const style = c.defaultStyle
    ? `
    <style>
      .${formPfx} {
        background-color: #f9f9f9;
        color: #333;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
  
      .${formPfx}-container {
        display: flex;
        flex-direction: column;
      }
  
      .${formPfx}-field {
        margin-bottom: 20px;
      }
  
      .${formPfx}-label {
        margin-bottom: 5px;
        font-weight: bold;
        font-size: 1rem;
      }

      .${formPfx}-required:after {
        content: '*';
        color: red;
        margin-left: 5px;
      }
  
      .${formPfx}-input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
        box-sizing: border-box;
        font-size: 1rem;
      }
  
      .${formPfx}-input:focus {
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0,123,255,0.5);
        outline: none;
      }
  
      .${formPfx}-submit {
        padding: 10px 15px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }
  
      .${formPfx}-submit:hover {
        background-color: #0056b3;
      }

      .${formPfx}-select, .${formPfx}-radio {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
        box-sizing: border-box;
        font-size: 1rem;
      }

      .${formPfx}-radio-label {
        display: inline-block;
        margin-right: 10px;
      }

      .${formPfx}-radio-group {
        display: flex;
        align-items: center;
      }

      .${formPfx}-section-header {
        font-size: 1.2rem;
        font-weight: bold;
        margin: 20px 0 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
      }

      .${formPfx}-separator {
        height: 1px;
        background-color: #ddd;
        margin: 20px 0;
      }

      .${formPfx}-card-options {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .${formPfx}-card-option {
        width: 50px;
        height: auto;
      }

    </style>
    `
    : ''

  if (c.blocks.indexOf(formRef) >= 0) {
    console.log('Adding form block...') // Add this line
    bm.add(formRef, {
      label: `
          <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path class="gjs-block-svg-path" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-2h-2v2zm-4 0h2v-2H8v2zm0-4h8v-2H8v2zm0-4h8V7H8v2z"></path>
          </svg>
          <div class="gjs-block-label">${c.labelFormBlock}</div>`,
      category: c.labelFormCategory,
      content: `
          <form class="${formPfx}" data-gjs-droppable="false" data-gjs-custom-name="${
        c.labelForm
      }" data-gjs="${formRef}">
            <div class="${formPfx}-container" data-gjs-droppable="false" data-gjs-draggable="false"
              data-gjs-removable="false" data-gjs-copyable="false" data-gjs-highlightable="false"
              data-gjs-custom-name="${c.labelFormContainer}">
              
              <div class="${formPfx}-section-header">Booking Details</div>

              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="title">Title</label>
                <select class="${formPfx}-select" id="title" name="title" required>
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                </select>
              </div>

              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="name">Name</label>
                <input class="${formPfx}-input" type="text" id="name" name="name" required>
              </div>
  
              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="email">Email</label>
                <input class="${formPfx}-input" type="email" id="email" name="email" required>
              </div>
  
              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="phone">Phone</label>
                <input class="${formPfx}-input" type="tel" id="phone" name="phone" required>
              </div>
  
              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="gender">Gender</label>
                <div class="${formPfx}-radio-group">
                  <label class="${formPfx}-radio-label">
                    <input type="radio" name="gender" value="male" required> Male
                  </label>
                  <label class="${formPfx}-radio-label">
                    <input type="radio" name="gender" value="female" required> Female
                  </label>
                </div>
              </div>
  
              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="dob">Date of Birth</label>
                <div class="${formPfx}-radio-group">
                  <select class="${formPfx}-select" id="dob-day" name="dob-day" required>
                    <option value="">Day</option>
                    ${[...Array(31)]
                      .map(
                        (_, i) => `<option value="${i + 1}">${i + 1}</option>`
                      )
                      .join('')}
                  </select>
                  <select class="${formPfx}-select" id="dob-month" name="dob-month" required>
                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select class="${formPfx}-select" id="dob-year" name="dob-year" required>
                    <option value="">Year</option>
                    ${[...Array(100)]
                      .map(
                        (_, i) =>
                          `<option value="${new Date().getFullYear() - i}">${
                            new Date().getFullYear() - i
                          }</option>`
                      )
                      .join('')}
                  </select>
                </div>
              </div>

              <div class="${formPfx}-separator"></div>

              <div class="${formPfx}-section-header">Payment Details</div>
  
              <div class="${formPfx}-card-options">
                <img src="https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mc_dla_symbol_92.png" class="${formPfx}-card-option" alt="Mastercard">
                <img src="https://w7.pngwing.com/pngs/58/14/png-transparent-amex-card-credit-logo-logos-logos-and-brands-icon.png" class="${formPfx}-card-option" alt="American Express">
                <img src="https://e7.pngegg.com/pngimages/882/375/png-clipart-wikipedia-logo-visa-graphics-credit-card-the-african-grassland-blue-text.png" class="${formPfx}-card-option" alt="Visa">
              </div>
  
              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="cc-name">Name on Card</label>
                <input class="${formPfx}-input" type="text" id="cc-name" name="cc-name" required>
              </div>
  
              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="cc-number">Credit Card Number</label>
                <input class="${formPfx}-input" type="text" id="cc-number" name="cc-number" required>
              </div>
  
              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="cc-expiry">Expiration Date</label>
                <div class="${formPfx}-radio-group">
                  <select class="${formPfx}-select" id="cc-expiry-month" name="cc-expiry-month" required>
                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select class="${formPfx}-select" id="cc-expiry-year" name="cc-expiry-year" required>
                    <option value="">Year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>
  
              <div class="${formPfx}-field" data-gjs="${formItemsRef}">
                <label class="${formPfx}-label ${formPfx}-required" for="cc-cvc">Security Code</label>
                <input class="${formPfx}-input" type="text" id="cc-cvc" name="cc-cvc" required>
              </div>
  
              <button type="submit" class="${formPfx}-submit">Submit</button>
  
            </div>
          </form>
          ${style}
        `
    })
  }
}
