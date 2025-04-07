const { syncLogger } = require('../../../logger');
const { User } = require('../index');

module.exports = async () => {
    try {
        const count = await User.count();
        
        if (count > 0) {
            syncLogger.warn('Users already exist, skipping seed');
            return;
        }

        const users = await User.bulkCreate(
            [
                {
                    firstName: 'Admin',
                    lastName: 'System',
                    username: 'admin',
                    email: 'admin@example.com',
                    role: 'admin',
                },
                {
                    firstName: 'John',
                    lastName: 'Doe',
                    username: 'user1',
                    email: 'user1@example.com',
                    role: 'user',
                },
                {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    username: 'user2',
                    email: 'user2@example.com',
                    role: 'user',
                },
            ],
            { validate: true }
        );

        syncLogger.info(`Created ${users.length} users`);
        return users;
    } catch (error) {
        syncLogger.info('User seed failed:', error);
        throw error;
    }
};
