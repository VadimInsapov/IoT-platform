const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient('mongodb://127.0.0.1');

class TypesController {
	async getAllTypes(req, res) {
		try {
			client.connect().then(client =>
				client.db('things').listCollections().toArray())
				.then(cols => {
					let collection_names = new Array()
					for (let col of cols) {
						collection_names.push(col.name)
					}
					res.send(collection_names)
				})
				.finally(() => client.close());
		} catch (e) {
			res.send(`entities ${req.method} error`);
		}
	}
}

module.exports = new TypesController;
