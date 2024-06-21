const images = import.meta.glob<{ default: string }>('@/assets/albums/*.{png,jpg,jpeg,svg}', { eager: true });

const importedImages = Object.values(images).map((module) => module.default);

export default importedImages;