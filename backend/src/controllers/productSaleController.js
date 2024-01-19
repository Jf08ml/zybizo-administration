import productSaleService from "../services/productSale.service.js";
import sendResponse from "../utils/response.js";

async function createProductSale(req, res, next) {
  try {
    const newProductSale = await productSaleService.createProductSale(
      req.body.productSale
    );
    sendResponse(
      res,
      201,
      newProductSale,
      "Venta de producto creada exitosamente."
    );
  } catch (error) {
    next(error);
  }
}

async function getProductsSale(req, res, next) {
  try {
    const productSales = await productSaleService.getProductsSale();
    sendResponse(
      res,
      200,
      productSales,
      productSales.length > 0
        ? "Ventas de productos encontradas."
        : "No se encontraron ventas de productos."
    );
  } catch (error) {
    next(error);
  }
}

async function handleReturn(req, res, next) {
  const { id } = req.params;
  const returnData = req.body;

  try {
    const sale = await productSaleService.handleReturn(id, returnData);
    sendResponse(res, 200, sale, "Devolución realizada exitosamente.");
  } catch (error) {
    next(error);
  }
}

export { createProductSale, getProductsSale, handleReturn };
