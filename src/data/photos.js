/**
 * Конфигурация фотографий.
 * Файлы лежат в public/photos/
 */

// Учитываем base Vite, чтобы пути работали и локально, и на GitHub Pages.
const p = (folder, file) => `${import.meta.env.BASE_URL}photos/${folder}/${file}`;

export const photos = {
  intro: p('hero', 'intro.png'),

  couple: [
    p('couple', '01.png'),
    p('couple', '02.png'),
    p('couple', '03.png'),
    p('couple', '04.png'),
  ],

  dasha: [
    p('dasha', '01.png'),
    p('dasha', '02.png'),
    p('dasha', '03.png'),
    p('dasha', '04.png'),
    p('dasha', '05.png'),
  ],

  family: [
    p('family', '01.png'),
    p('family', '02.png'),
    p('family', '03.png'),
    p('family', '04.png'),
    p('family', '05.png'),
    p('family', '06.png'),
  ],

  sonya: [
    p('sonya', '01.png'),
    p('sonya', '02.png'),
    p('sonya', '03.png'),
    p('sonya', '04.png'),
  ],

  nastya: [
    p('nastya', '01.png'),
    p('nastya', '02.png'),
    p('nastya', '03.png'),
    p('nastya', '04.png'),
  ],

  fourHero: p('family', 'hero.png'),

  gallery: Array.from({ length: 25 }, (_, i) =>
    p('gallery', `${String(i + 1).padStart(2, '0')}.png`)
  ),

  finale: p('finale', 'closing.png'),
};

export const allPhotos = [
  photos.intro,
  ...photos.couple,
  ...photos.dasha,
  ...photos.family,
  ...photos.sonya,
  ...photos.nastya,
  photos.fourHero,
  ...photos.gallery,
  photos.finale,
];
