function generatePaymentEmailTemplate(newOrder) {
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
      background-color: #4CAF50;
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
    .footer {
      background-color: #f0f0f0;
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
          <p>Cliente ${newOrder.deliveryAddress.contactName},</p>
          <p>Se ha realizado un pedido.</p>
          <p><strong>Monto:</strong>$ ${newOrder.totalToPay}</p>
          <p><strong>Dirección:</strong> ${newOrder.deliveryAddress.address}</p>
          <p><strong>Whatsapp:</strong> ${newOrder.deliveryAddress.phoneContact}</p>
        </div>
        <div class="footer">
            <p>Naty teamo</p>
        </div>
      </div>
    </body>
    </html>`;
}

export { generatePaymentEmailTemplate };
