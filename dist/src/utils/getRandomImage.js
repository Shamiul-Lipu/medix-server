const MEDICINE_IMAGES = [
    "https://i.ibb.co.com/1GwGBgn9/product8-fetaured.jpg",
    "https://i.ibb.co.com/twThqTcR/product11-fetaured.jpg",
    "https://i.ibb.co.com/ZQkVD7v/product1-fetaured.jpg",
    "https://i.ibb.co.com/RGNNNj6R/product-7-1.jpg",
    "https://i.ibb.co.com/0jLd1HNq/product-6.jpg",
    "https://i.ibb.co.com/C3BDkVZ7/product-4-3.jpg",
    "https://i.ibb.co.com/q3mCsZq1/product-19-1.jpg",
    "https://i.ibb.co.com/ch5WWf2K/product-3-2.webp",
    "https://i.ibb.co.com/7tzWYLQj/download-7b1679ef-9582-489d-b75a-42adcd154100.webp",
    "https://i.ibb.co.com/x8hgcnws/download-b5eaa43f-fcd9-4e38-869b-20bd489fd572.webp",
    "https://i.ibb.co.com/bgfwZG9s/download-03fd9754-4edb-482d-ae53-c90009bdb244.webp",
    "https://i.ibb.co.com/V03rgZcj/download-325fa82b-94e3-4126-ac3b-b24f08b0b03f.webp",
    "https://i.ibb.co.com/wxQ1Sk4/product-12-2.webp",
];
// Utility to pick random image
export const getRandomImage = () => {
    const index = Math.floor(Math.random() * MEDICINE_IMAGES.length);
    return MEDICINE_IMAGES[index];
};
//# sourceMappingURL=getRandomImage.js.map