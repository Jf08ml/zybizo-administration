import productSaleService from "../services/productSale.service.js";

async function createProductSale(req, res, next) {
  try {
    const newProductSale = await productSaleService.createProductSale(
      req.body.productSale
    );
    res.status(201).json({
      status: "success",
      data: newProductSale,
      message: "Venta de producto creada exitosamente.",
    });
  } catch (error) {
    next(error);
  }
}

async function getProductsSale(req, res, next) {
  try {
    const productSales = await productSaleService.getProductsSale();
    res.status(200).json({
      status: "success",
      data: productSales,
      message:
        productSales.length > 0
          ? "Ventas de productos encontradas."
          : "No se encontraron ventas de productos.",
    });
  } catch (error) {
    next(error);
  }
}

async function handleReturn(req, res, next) {
  const { id } = req.params;
  const returnData = req.body;

  try {
    const sale = await productSaleService.handleReturn(id, returnData);
    res.status(200).json({
      status: "success",
      data: sale,
      message: "Devolución manejada exitosamente.",
    });
  } catch (error) {
    next(error);
  }
}

export { createProductSale, getProductsSale, handleReturn };
