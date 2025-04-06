const { syncLogger } = require('../../../logger');
const { Product, User } = require('../index');

module.exports = async () => {
    try {
        const count = await Product.count();
        if (count > 0) {
            syncLogger.warn('Products already exist, skipping seed');
            return;
        }

        const admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            throw new Error('Admin user not found for product seeding');
        }

        const products = await Product.bulkCreate([
            { name: 'Laptop', price: 999.99, userId: admin.id },
            { name: 'Phone', price: 699.99, userId: admin.id },
            { name: 'Tablet', price: 399.99, userId: admin.id },
        ]);

        syncLogger.info(`Created ${products.length} products`);
        return products;
    } catch (error) {
        syncLogger.error('Product seed failed:', error);
        throw error;
    }
};
