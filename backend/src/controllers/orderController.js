import OrderService from "../services/order.service.js";
import CustomErrors from "../errors/CustomErrors.js";
import sendResponse from "../utils/response";
import { generatePaymentEmailTemplate } from "../services/emailTemplate.service.js";
import { sendEmail } from "../services/email.service.js";
import emailSendingService from "../services/emailSending.service.js";
import { sendMessageSuccessPayment } from "../services/whatsapp.service.js";

const { NotFoundError, ValidationError } = CustomErrors;

export const createOrder = async (req, res, next) => {
  try {
    const newOrder = await OrderService.createOrder(req.body.order);
    const htmlBody = generatePaymentEmailTemplate(newOrder);

    try {
      await emailSendingService.sendEmail({
        to: newOrder.deliveryAddress.email,
        subject: "Pedido Zybizo Bazar",
        htmlContent: htmlBody,
        fromName: "Zybizo Bazar",
      });
    } catch (emailError) {
      console.error(
        `Error al enviar correo a ${newOrder.deliveryAddress.email}:`,
        emailError
      );
    }

    // Intento enviar el correo amazon
    // try {
    //   await sendEmail({
    //     to: "lassojuanfe@gmail.com",
    //     subject: "Nuevo pedido",
    //     htmlBody,
    //   });
    //   console.log(`Correo enviado exitosamente a lassojuanfe@gmail.com`);
    // } catch (emailError) {
    //   console.error(
    //     `Error al enviar correo a lassojuanfe@gmail.com:`,
    //     emailError
    //   );
    // }

    // Intento enviar el mensaje a WhatsApp
    // try {
    //   const prefixFormated = paymentData.payer.prefix.replace(/\+/g, "");
    //   const recipientId = prefixFormated + paymentData.payer.phone;
    //   const templateName = "pago_exitoso_membresia";
    //   const parameters = [
    //     paymentData.payer.name,
    //     paymentData.description,
    //     paymentData.order_id,
    //   ];

    //   await sendMessageSuccessPayment(recipientId, templateName, parameters);
    //   console.log(`Mensaje de WhatsApp enviado exitosamente a ${recipientId}`);
    // } catch (whatsappError) {
    //   console.error(`Error al enviar mensaje de WhatsApp a ${recipientId}:`, whatsappError);
    // }

    sendResponse(
      res,
      201,
      newOrder,
      "Pedido guardado y disponible para enviar."
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return sendResponse(res, 400, "Error", error.message);
    }
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const rewards = await OrderService.getOrders();
    sendResponse(
      res,
      200,
      rewards,
      rewards.length > 0 ? "Pedidos encontrados." : "No se encontraron pedidos."
    );
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await OrderService.getOrder(req.params.id);
    sendResponse(res, 200, order, "Pedido encontrado.");
  } catch (error) {
    if (error instanceof NotFoundError) {
      return sendResponse(res, 404, null, error.message);
    }
    next(error);
  }
};

export const getOrderByField = async (req, res, next) => {
  try {
    console.log(req.query);
    const order = await OrderService.getOrderByField(req.query);
    sendResponse(res, 200, order, "Recompensas encontradas.");
  } catch (error) {
    console.log(error);
    if (error instanceof NotFoundError) {
      return sendResponse(res, 404, null, error.message);
    }
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await OrderService.updateOrder(
      req.params.id,
      req.body.reward
    );
    sendResponse(res, 200, updatedOrder, "Pedido actualizado.");
  } catch (error) {
    if (error instanceof NotFoundError) {
      return sendResponse(res, 404, null, error.message);
    }
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    await OrderService.deleteOrder(req.params.id);
    sendResponse(res, 200, null, "Pedido eliminado con éxito.");
  } catch (error) {
    if (error instanceof NotFoundError) {
      return sendResponse(res, 404, null, error.message);
    }
    next(error);
  }
};
