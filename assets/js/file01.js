"use strict";
import {fetchProducts} from "./functions.js";

const renderProducts = () => {
    fetchProducts('/products.json')
    .then(result => { 
        if (result.success){
        let container = document.getElementById('products-container');

        container.innerHTML = '';

        let products = result.body;

        products.forEach(product => {
          let productHTML = `
            <div class="portfolio col-12 sm:col-6 lg:col-4" data-filter="[PRODUCT.CATEGORY]" >
              <article class="group">
                <div
                  class="relative overflow-hidden w-full aspect-[4/3] rounded-xl"
                >
                  <img
                    src="[PRODUCT.IMGURL]"
                    alt="[PRODUCT.TITLE]"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="pt-4">
                  <h4 class="mb-2">
                    <a
                      href="javascript:void(0)"
                      class="text-[1.5rem] leading-tight text-inherit"
                      >[PRODUCT.TITLE]</a
                    >
                  </h4>
                  <h6>$[PRODUCT.PRICE]</h6>
                </div>
              </article>
            </div>`;
            productHTML = productHTML.replaceAll('[PRODUCT.IMGURL]', product.image);
            productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', product.price);
            productHTML = productHTML.replaceAll('[PRODUCT.TITLE]', product.name);
            productHTML = productHTML.replaceAll('[PRODUCT.PRODUCTURL]', product.productURL);
            productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY]', product.category);

            // Concatenar al contenedor
            container.innerHTML += productHTML;
        });

      } else {
        alert('Error al obtener los productos: ' + result.message);
      }
    })
    .catch(error => {
      // En caso de fallo de red o error inesperado
      alert('Error de conexión: ' + error.message);
    });
};

(() => {
  renderProducts();
})();