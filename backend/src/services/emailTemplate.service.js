function generatePaymentEmailTemplate(newOrder) {
  const itemsHtml = newOrder.items.map(item => `
    <div class="item">
      <h4>${item.name}</h4>
      <img src="${item.image}" alt="${item.name}" style="width: 100px; height: auto;">
      ${item.references && item.references.length > 0 ? `
      <p><strong>Referencias:</strong></p>
      <ul>
        ${item.references.map(ref => `<li>${ref.name}: ${ref.selectedOption}</li>`).join('')}
      </ul>` : ''}
      <p><strong>Cantidad:</strong> ${item.quantity}</p>
      <p><strong>Precio total:</strong> $${item.totalPrice}</p>
    </div>
  `).join('');

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
            <h2>Nuevo pedido</h2>
        </div>
        <div class="content">
          <p>Cliente: <strong>${newOrder.deliveryAddress.contactName}</strong>,</p>
          <p>Se ha realizado un pedido.</p>
          <p><strong>Dirección de entrega:</strong></p>
          <p>${newOrder.deliveryAddress.address}, ${newOrder.deliveryAddress.neighborhood}, ${newOrder.deliveryAddress.city}, ${newOrder.deliveryAddress.department}</p>
          <p><strong>Indicaciones:</strong> ${newOrder.deliveryAddress.indications}</p>
          <p><strong>Whatsapp:</strong> ${newOrder.deliveryAddress.phoneContact}</p>
          <p><strong>Tipo de envío:</strong> ${newOrder.deliveryType}</p>
          <h3>Artículos:</h3>
          ${itemsHtml}
          <p><strong>Total a pagar:</strong> $${newOrder.totalToPay}</p>
        </div>
        <div class="footer">
            <p>${new Date().getFullYear()} © Tienda de Naty</p>
            <p>Naty teamo</p>
        </div>
      </div>
    </body>
    </html>`;
}

export { generatePaymentEmailTemplate };
