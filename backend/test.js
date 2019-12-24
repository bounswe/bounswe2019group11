require('dotenv').config();

const database = require('./helpers/database');
const alertHelper = require('./helpers/alert');
const Alert = require('./models/alert');
const AlertNotification = require('./models/alertNotification');

async function main() {
    await database.establishConnection();

    const code = 'EUR';
    const rate = 7.0;

    const alerts = await Alert.find({type: alertHelper.TYPE.CURRENCY, currencyCode: code});
    for (let j = 0; j < alerts.length; j++) {
        const alert = alerts[j];
        console.log(alert);
        if ((alert.direction === alertHelper.DIRECTION.ABOVE && alert.rate < rate)
            || (alert.direction === alertHelper.DIRECTION.BELOW && alert.rate >= rate)) {
            await AlertNotification.create({
                userId: alert.userId,
                type: alertHelper.TYPE.CURRENCY,
                direction: alert.direction,
                rate: alert.rate,
                currentRate: rate,
                currencyCode: code,
                currencyId: '5dd93e4301df5b4513254756'
            });
            await Alert.findOneAndDelete({_id: alert._id});
        }
    }
}

main().then();
