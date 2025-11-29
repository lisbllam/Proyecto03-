"use strict";
import {fetchProducts} from "./functions.js";
import {saveVote, getVotes} from "./firebase.js";

const renderProducts = () => {
    fetchProducts('/products.json')
    .then(result => { 
        if (result.success){
        let container = document.getElementById('products-container');

        container.innerHTML = '';

        let products = result.body;

        products.forEach(product => {
          let productHTML = `
            <div class="portfolio col-12 sm:col-6 lg:col-4" >
              <article class="group" data-filter="[PRODUCT.CATEGORY]">
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

const enableForm = () => {
    const form = document.getElementById("form_voting");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const rateId = document.getElementById("select_rate").value;

        if (!rateId) {
            alert("Por favor, selecciona una opción de experiencia.");
            return;
        }

        const result = await saveVote(rateId);

        if (result.status) {
            alert("Voto registrado correctamente");
            location.reload();
        } else {
            alert("Error al guardar el voto");
        }
    });
};

const displayVotes = async () => {
    const result = await getVotes();
    const resultsContainer = document.getElementById("results");

    resultsContainer.innerHTML = `<p class="text-gray-500 text-center mt-2">Cargando...</p>`;

    if (result.success) {
        const votes = result.data;

        const voteCount = {};

        Object.keys(votes).forEach(key => {
            const id = votes[key].rateId;
            voteCount[id] = (voteCount[id] || 0) + 1;
        });

        let labels = {
            exp1: "Excelente atención",
            exp2: "Buena atención",
            exp3: "Atención regular",
            exp4: "Mala atención"
        };

        let tableHTML = `
            <table border="1" cellpadding="8" class="w-full text-center">
                <thead>
                    <tr>
                        <th>Experiencia</th>
                        <th>Votos</th>
                    </tr>
                </thead>
                <tbody>
        `;

        Object.keys(voteCount).forEach(rate => {
            tableHTML += `
            <tr>
                <td>${labels[rate] || rate}</td>
                <td>${voteCount[rate]}</td>
            </tr>`;
        });

        tableHTML += `</tbody></table>`;

        resultsContainer.innerHTML = tableHTML;

    } else {
        resultsContainer.innerHTML = `<p>${result.message}</p>`;
    }
};

(() => {
  renderProducts();
  enableForm();
  displayVotes();
})();