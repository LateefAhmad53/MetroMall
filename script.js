document.addEventListener('DOMContentLoaded', function () {
    function filterItems(category) {
        const searchInput = document.getElementById(`search-${category}`);
        const brandFilter = document.getElementById(`brand-filter-${category}`);
        const typeFilter = document.getElementById(`type-filter`);
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');

        const items = document.querySelectorAll(`.${category === 'real-estate' ? 'property' : 'product'}`);

        function applyFilters() {
            const searchText = searchInput ? searchInput.value.toLowerCase() : "";
            const selectedBrand = brandFilter ? brandFilter.value : "";
            const selectedType = typeFilter ? typeFilter.value : "";
            const min = minPrice && minPrice.value ? parseInt(minPrice.value) : 0;
            const max = maxPrice && maxPrice.value ? parseInt(maxPrice.value) : Infinity;

            items.forEach(item => {
                const title = item.querySelector('h3').innerText.toLowerCase();
                const brand = item.dataset.brand || "";
                const type = item.dataset.type || "";
                const price = parseInt(item.dataset.price);

                const matchesSearch = title.includes(searchText);
                const matchesBrand = selectedBrand === "" || brand === selectedBrand;
                const matchesType = selectedType === "" || type === selectedType;
                const matchesPrice = price >= min && price <= max;

                item.style.display = (matchesSearch && matchesBrand && matchesType && matchesPrice) ? "block" : "none";
            });
        }

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (brandFilter) brandFilter.addEventListener('change', applyFilters);
        if (typeFilter) typeFilter.addEventListener('change', applyFilters);
        if (minPrice) minPrice.addEventListener('input', applyFilters);
        if (maxPrice) maxPrice.addEventListener('input', applyFilters);
    }

    // Initialize filters for different pages
    const pageCategories = ['fashion', 'electronics', 'real-estate'];
    pageCategories.forEach(category => {
        if (document.getElementById(`search-${category}`)) {
            filterItems(category);
        }
    });
});
