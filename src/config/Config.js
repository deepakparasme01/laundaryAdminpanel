// const API_BASE_URL = "https://rasatva.apponedemo.top/laundry/api/"; 
// const IMG_BASE_URL = "https://rasatva.apponedemo.top/laundry/public/";

const API_BASE_URL = process.env.VITE_BASE_URL;
const IMG_BASE_URL = process.env.VITE_IMAGE_URL;
export {API_BASE_URL, IMG_BASE_URL};