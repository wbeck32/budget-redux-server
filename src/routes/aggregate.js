db['{ "_id": ObjectId("59b1acc0de7c5625e2de2891"), $and: [ { "subCategories._id": ObjectId("59b1b12dde7c5625e2de28ac") } ] }'].aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: { "_id": ObjectId("59b1acc0de7c5625e2de2891"), $and: [ { "subCategories._id": ObjectId("59b1b12dde7c5625e2de28ac") } ] }
			
		},
	],

	// Options
	{
		explain: true
	}

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
