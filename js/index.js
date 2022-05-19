const url = './data/db.json';
const fragment = document.createDocumentFragment();
const productLayoutEl = document.getElementById('productLayout');
const productDetailsContainer = document.createElement('div');
const productNameEl = document.getElementById('productName');
const priceEl = document.getElementById('productPrice');
const variantTitle = document.getElementById('productVariant');
const zipCodeEl = document.getElementById('zipCode');
const productDetailsEl = document.getElementById('productDetails');
const chooseColorEl = document.getElementById('chooseColor');
const assemblyrequirementEl = document.getElementById('assemblyrequirement');
const quantityEl = document.getElementById('quantity');
const cartBtnEl = document.getElementById('cartBtn');
const checkAvailabilityBtn = document.getElementById('zipCodeBtn');
const zipInputEl = document.getElementById('zipInput');
const plusBtnEl = document.getElementById('plusBtn');
const minusBtnEl = document.getElementById('minusBtn');
const unitsEl = document.getElementById('units');
const stockAvailability = document.getElementById('stockAvailability');

let unitsAvailable,
   deliveryLocation = '',
   selectedVariant;

// SHOULD NOT be able to process anything if zipcode is Null
/// need to get the delivery location CALI or OTHER?
// i get the array of Cali
//i get the array of Others

//When I choose a variant color- need to capture inventory count

/* SET ATTRIBUTES */
productDetailsContainer.setAttribute('class', 'productDetails');

/* Example of API call to “placeholder.url/products/Leather+Sofa” */
// const fetchData = async () => {
//    try {
//       const response = await fetch('placeholder.url/products/Leather+Sofa', { method: 'GET'})
//       const data = await response.json();
//    } catch (error) {
//       console.error(error);
//       block of code
//    }
// };

/* API CALL */
async function fetchData() {
   const response = await fetch(url);
   const data = await response.json();

   const layout = () => {
      productNameEl.textContent = `${data.productName}`;
      fragment.append(productNameEl);
      productDetailsContainer.append(priceEl);
      productDetailsContainer.append(chooseColorEl);
      assemblyrequirementEl.textContent = `** Assembly required`;
      stockAvailability.textContent = `Enter zip code to check delivery availability`;

      cartBtnEl.addEventListener('mouseover', () => {
         if (deliveryLocation.length === 0) {
            zipInputEl.focus();
            stockAvailability.style.color = 'red';
            stockAvailability.style.fontWeight = '600';
         }
      });
      cartBtnEl.addEventListener('mouseout', () => {
         if (deliveryLocation.length === 0) {
            stockAvailability.style.color = '#545050';
            stockAvailability.style.fontWeight = '500';
         }
      });

      cartBtnEl.addEventListener('click', function () {
         if (deliveryLocation.length !== 0) {
            alert(`${unitsEl.value} item(s) added to cart`);
            unitsEl.value = 1;
         }
      });

      function isEmpty() {
         if (!zipInputEl.value) return;
         stockAvailability.style.fontWeight = 'bolder';
         if (unitsAvailable !== 0 && deliveryLocation.length > 0) {
            stockAvailability.textContent = 'In Stock';
            stockAvailability.style.color = 'green';
            cartBtnEl.classList.remove('disabledBtn');
            cartBtnEl.classList.add('cartBtn');
            cartBtnEl.removeAttribute('disabled');
            minusBtnEl.removeAttribute('disabled');
            plusBtnEl.removeAttribute('disabled');
         } else {
            stockAvailability.textContent = 'Out of Stock';
            stockAvailability.style.color = 'red';
            cartBtnEl.classList.add('disabledBtn');
            cartBtnEl.classList.remove('cartBtn');
            cartBtnEl.setAttribute('disabled', 'disabled');
            minusBtnEl.setAttribute('disabled', 'disabled');
            plusBtnEl.setAttribute('disabled', 'disabled');
         }
      }

      /* Function check availability based on warehouse location */

      checkAvailabilityBtn.addEventListener('click', function () {
         if (!zipInputEl.value) return alert('Must have a zip code');
         if (zipInputEl.value >= '90000' && zipInputEl.value <= '96699') {
            deliveryLocation = 'caliWarehouse';
         } else {
            deliveryLocation = 'otherWarehouse';
         }
         unitsAvailable = selectedVariant.inventory[deliveryLocation];
         isEmpty();
      });

      /* Decrement Unit */
      minusBtnEl.addEventListener('click', (e) => {
         e.preventDefault();
         if (unitsEl.value > 1) {
            Number(unitsEl.value--);
         }
      });
      /* Increment Unit */
      plusBtnEl.addEventListener('click', function (e) {
         e.preventDefault();
         if (Number(unitsEl.value) < unitsAvailable) {
            Number(unitsEl.value++);
         }
      });

      /* MAP OVER THE VARIANTS */
      const colorBtn = [];
      const variants = data.variants.map((variant, idx) => {
         // * Create Dynamic button and used Color Hexacode provided from API *//
         colorBtn[idx] = document.createElement('button');
         colorBtn[idx].style.backgroundColor = variant.colorHex;
         colorBtn[idx].setAttribute('id', `${variant.title}${idx}`);
         colorBtn[idx].setAttribute('class', 'colorBtn');

         colorBtn[idx].addEventListener('click', function onClick(e) {
            e.preventDefault();
            variantTitle.textContent = variant.title;
            priceEl.textContent = `$${variant.price}`;
            unitsAvailable = variant.inventory[deliveryLocation];
            unitsEl.value = 1;
            selectedVariant = variant;
            colorBtn.map((btn, i) => {
               if (btn.classList.contains('selected')) {
                  if (idx === i) return;
                  colorBtn[i].classList.remove('selected');
               } else {
                  if (idx === i) colorBtn[i].classList.add('selected');
                  return;
               }
            });

            /* Iterate over details array and Check conditions */

            productDetailsEl.innerHTML = variant.details
               .map(
                  (item) =>
                     `<ul>
                  <li>${item}</li>
               </ul>`
               )
               .join('');
            assemblyrequirementEl.textContent = `${
               variant.assembly
                  ? '** Assembly required'
                  : '** Assembly NOT required'
            }`;
            isEmpty();
         });
         fragment.append(productDetailsContainer);
         productDetailsContainer.append(colorBtn[idx]);
      });

      productDetailsContainer.append(
         variantTitle,
         zipCodeEl,
         stockAvailability,
         productDetailsEl,
         assemblyrequirementEl,
         quantityEl,
         cartBtnEl
      );

      productLayoutEl.append(fragment);
   };
   layout();
   document.getElementById('Purple0').click();
}

fetchData();
