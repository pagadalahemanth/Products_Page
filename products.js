document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.getElementById('tabs');
    const productList = document.getElementById('product-list');

    const url = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';

    let currentTab = 'Kids';

    async function fetchProductsFromApi() {
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayProducts(data, currentTab);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }

    
    function displayProducts(data, category) {
        productList.innerHTML = ''; 

        const selectedCategory = data.categories.find(cat => cat.category_name === category);

        if (selectedCategory) {
            selectedCategory.category_products.forEach(product => {
                const card = createProductCard(product);
                productList.appendChild(card);
            });
        }
    }

function createProductCard(product) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('product-card');

    if (product.badge_text) {
        const badge = document.createElement('div');
        badge.classList.add('badge');
        badge.textContent = product.badge_text;
        cardContainer.appendChild(badge);
    }

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.alt = product.title;

    const badge = document.createElement('div');
    badge.classList.add('badge');
    badge.textContent = product.badge_text || '';
    
    const title = document.createElement('div');
    title.classList.add('title');
    const words = product.title.split(' ').slice(0, 5).join(' ');
    title.textContent = words;
    cardContainer.appendChild(title);

    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');

    const vendor = document.createElement('div');
    vendor.classList.add('vendor');
    vendor.textContent = `${product.vendor}`;
    productInfo.appendChild(vendor);

    const priceInfoContainer = document.createElement('div');
    priceInfoContainer.classList.add('price-info');
    priceInfoContainer.innerHTML = `
        <div class="price">Rs ${product.price}</div>
        <div class="compare-at-price">${product.compare_at_price || 'N/A'}</div>
        <div class="save">${calculateSaveAmount(product.price, product.compare_at_price)}</div>
    `;

    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('add-to-cart-button');
    addToCartButton.textContent = 'Add to Cart';

    // Append elements to cardContainer
    cardContainer.appendChild(productImage);
    cardContainer.appendChild(title);
    cardContainer.appendChild(vendor);
    cardContainer.appendChild(priceInfoContainer);
    cardContainer.appendChild(addToCartButton);

    const productList = document.getElementById('product-list');
    productList.appendChild(cardContainer);

    return cardContainer;
}

function calculateSaveAmount(price, compareAtPrice) {
    if (!compareAtPrice) {
        return '';
    }

    const percentOff = ((compareAtPrice - price) / compareAtPrice) * 100;
    return ` ${percentOff.toFixed(2)}% Off`;
}

    fetchProductsFromApi();

    tabs.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            const selectedTab = event.target.getAttribute('data-tab');

            currentTab = selectedTab;
            fetchProductsFromApi();
        }
    });
});
