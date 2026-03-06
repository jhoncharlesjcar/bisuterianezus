async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/search?limit=100');
        const data = await response.json();

        console.log("TODOS LOS PRODUCTOS:");
        data.products.forEach(p => {
            console.log(`"${p.name}" -> ${p.image_url}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchProducts();
