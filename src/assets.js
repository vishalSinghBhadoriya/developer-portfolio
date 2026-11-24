export function publicAsset(path) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}

export function responsivePublicImage(stem, widths) {
  return widths.map(width => publicAsset(stem + '-' + width + '.webp') + ' ' + width + 'w').join(', ')
}

export const buyNestMedia = {
  mobile: publicAsset('buynest-mobile-390.webp'),
  product: publicAsset('buynest-product-760.webp'),
  productSrcSet: responsivePublicImage('buynest-product', [760, 1320]),
}
