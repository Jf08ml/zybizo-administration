export function formatPrice(price) {
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(price);
  return formattedPrice.replace(/,00$/, "");
}
