const { MongoClient } = require('mongodb');

class MapHelper {
    static async fetchActiveMaps(client) {
        const db = client.db('Maps');
        const collection = db.collection('ActiveMaps');
        const documents = await collection.find().toArray();
        // Transform the objects into arrays of strings
        if (documents.length == 0) {
            throw new Error('No Active Maps Found');
        }
        let transformedData = documents.map(obj => [obj.user, obj.zone, obj.coords]);
        // Group the data by the second element
        let groupedData = transformedData.reduce((groups, item) => {
            let key = item[1];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
        // Build the output string
        let output = '__**Currrent Active Maps:**__' + '\n' + '\n';
        for (let group in groupedData) {
            output += '**' + group + '**' + ':\n';
            for (let item of groupedData[group]) {
                output += '  ' + item.join(', ') + '\n';
            }
            output += '\n';
        }
        return output;
    }
}

module.exports = MapHelper;