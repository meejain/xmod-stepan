export default function decorate(block) {
  const rows = [...block.children];
  const hasImage = rows.length > 1 && rows[0].querySelector('img');

  if (hasImage) {
    // Image in first row, content in second row
    const imageRow = rows[0];
    const contentRow = rows[1];

    // Extract the img and wrap in proper structure
    const img = imageRow.querySelector('img');
    imageRow.classList.add('hero-homepage-image');
    imageRow.textContent = '';
    imageRow.append(img);

    contentRow.classList.add('hero-homepage-content');
  } else {
    // No image - fallback solid background
    block.classList.add('no-image');
    if (rows[0]) rows[0].classList.add('hero-homepage-content');
  }
}
