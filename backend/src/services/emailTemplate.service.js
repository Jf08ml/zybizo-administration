function generatePaymentEmailTemplate(newOrder) {
  const itemsHtml = `
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px;">Nombre</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Imagen</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Referencias</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Precio total</th>
      </tr>
    </thead>
    <tbody>
      ${newOrder.items
        .map(
          (item) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
          <img src="${item.image}" alt="${
            item.name
          }" style="width: 100px; height: auto;">
        </td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          ${
            item.references && item.references.length > 0
              ? `
          <ul style="padding-left: 16px; margin: 0;">
            ${item.references
              .map((ref) => `<li>${ref.name}: ${ref.selectedOption}</li>`)
              .join("")}
          </ul>`
              : "N/A"
          }
        </td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
          item.quantity
        }</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${
          item.totalPrice
        }</td>
      </tr>
    `
        )
        .join("")}
    </tbody>
  </table>
`;

  return `<html>
    <head>
    <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: white;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: pink;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 30px;
      text-align: left;
      line-height: 1.6;
    }
    .item {
      margin-bottom: 20px;
    }
    .footer {
      background-color: pink;
      padding: 15px;
      text-align: center;
      border-radius: 0 0 8px 8px;
      font-size: 0.9em;
    }
    </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
            <h2>Información del pedido</h2>
        </div>
        <div class="content">
          <p>Cliente: <strong>${
            newOrder.deliveryAddress.contactName
          }</strong>,</p>
          <p>Pedido realizado.</p>
          <p><strong>Dirección de entrega:</strong></p>
          <p>${newOrder.deliveryAddress.address}, ${
    newOrder.deliveryAddress.neighborhood
  }, ${newOrder.deliveryAddress.city}, ${
    newOrder.deliveryAddress.department
  }</p>
          <p><strong>Indicaciones:</strong> ${
            newOrder.deliveryAddress.indications !== ""
              ? newOrder.deliveryAddress.indications
              : "Sin indicaciones"
          }</p>
          <p><strong>Tipo de envío:</strong> ${newOrder.deliveryType}</p>
          <h3>Artículos:</h3>
          ${itemsHtml}
          <p><strong>Total a pagar:</strong> $${newOrder.totalToPay}</p>
        </div>
        <div class="footer">
            <p>${new Date().getFullYear()} © Tienda Online</p>
            <p>Zybizo Bazar</p>
        </div>
      </div>
    </body>
    </html>`;
}

export { generatePaymentEmailTemplate };
