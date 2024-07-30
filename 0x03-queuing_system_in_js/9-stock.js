import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const app = express();
const client = createClient();
const HOST = '127.0.0.1';
const PORT = 1245;

// Sample product data
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

/**
 * Retrieves a product from the list by its ID
 * @param {number} id - Product ID
 * @returns {object|undefined} - Product object if found, otherwise undefined
 */
function getItemById(id) {
  return listProducts.find((product) => product.id === id);
}

// Redis client event handlers
client.on('error', (error) => {
  console.error(`Redis client not connected to server: ${error.message}`);
});

/**
 * Stores the stock of an item in Redis
 * @param {number} itemId - Product ID
 * @param {number} stock - Product stock
 */
function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock);
}

/**
 * Retrieves the reserved stock for a given item from Redis
 * @param {number} itemId - Product ID
 * @returns {Promise<number|null>} - Reserved stock of the product or null if not set
 */
async function getCurrentReservedStockById(itemId) {
  const getAsync = promisify(client.get).bind(client);
  const value = await getAsync(`item.${itemId}`);
  return value ? Number(value) : null;
}

// Express routes
app.get('/list_products', (req, res) => {
  res.json(listProducts.map(({ id, name, price, stock }) => ({
    itemId: id,
    itemName: name,
    price,
    initialAvailableQuantity: stock,
  })));
});

app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(Number(itemId));
  
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(product.id);
  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: reservedStock !== null ? reservedStock : product.stock,
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(Number(itemId));
  
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  let reservedStock = await getCurrentReservedStockById(product.id);
  reservedStock = reservedStock !== null ? reservedStock : product.stock;

  if (reservedStock <= 0) {
    return res.status(400).json({ status: 'Not enough stock available', itemId: product.id });
  }

  reserveStockById(product.id, reservedStock - 1);
  res.json({ status: 'Reservation confirmed', itemId: product.id });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is live at http://${HOST}:${PORT}`);
});
