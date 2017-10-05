db['seed-users'].aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			"info.public":true
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
