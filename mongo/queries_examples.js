db.products.createIndex({slug: 1}, {unique: true});
// query for all products in the Gardening Tools category
db.products.find({category_ids: ObjectId('6a5b1476238d3b4dd5000048')});

product = db.products.findOne({'slug': 'wheel-barrow-9092'});
db.categories.findOne({'_id': product['main_cat_id']});
db.reviews.find({'product_id': product['_id']});

// offset, limit and sorting
db.reviews.find({'product_id': product['_id']}).
		  sort({'helpful_votes': -1}).
		  skip(0).limit(12);
		  
// skip the first 24 reviews and limit the number of reviews to 12		  
db.products.find({}, {'reviews': {$slice: [24, 12]}})		  
		  
// pagination: The order in which you call skip , limit , and sort in the JavaScript shell doesn’t matter.		  
page_number = 1		  
reviews_count = db.reviews.count({'product_id': product['_id']})
reviews = db.reviews.find({'product_id': product['_id']}).
					skip((page_number - 1) * 12).
					limit(12).
					sort({'helpful_votes': -1});		  

// Boolean operators $ne, $not, $or, $and, $nor, and $exists
db.products.find({'details.manufacturer': 'Acme', tags: {$ne: "gardening"} })

// finding all products that are either blue or made by Acme
db.products.find({
	'$or': [
		{'details.color': 'blue'},
		{'details.manufacturer': 'Acme'}
	]
});

db.products.find({
	$and: [
		{ tags: {$in: ['gift', 'holiday']} },
		{ tags: {$in: ['gardening', 'landscaping']} }
    ]
});

// comparing the first element of tags array
db.products.find({'tags.0': "soil"})

// finding all products which does not have color property
db.products.find({'details.color': {$exists: true}})

/* query for all categories from a given product's categories
 * $in , $all , and $nin. $nin can’t take advantage of indexes 
 * thus requires a collection scan. Try to use it in combination with
 * another query term that does use an index */
db.categories.find({_id: {$in: product['category_ids']}})

// find all order subtotals that are divisible by 3 with a reminder of 1
// $mod [(quotient),(result)]. it won’t use an index
db.orders.find({sub_total: {$mod: [3, 1]}})



// projection of only _id field by specifying its name in the third argument 
// with 1 as value
db.users.findOne({
	'username': 'kbanker',
	'hashed_password': 'bd1cfa194c3a603e7186780824b04419'},
	{'_id': 1}
)

// projections of all fields but addresses and payment_methods
db.users.find({}, {'addresses': 0, 'payment_methods': 0})

// query using regular expressions. if you do use /i , it will disable the
// use of indexes
db.users.find({'last_name': /^Ba/})

// query SPECIFIC RANGES
db.users.find({'addresses.zip': {'$gt': 10019, '$lt': 10040}})

// It also returns documents with no age field
db.users.find({'age': {'$not': {'$lte': 30}}})

// you want users whose home address is in New York. Note that if you use 
// {'addresses.name': 'home', 'addresses.state': 'NY'}, it will match also those users 
// who have at least one address with name "home" and one with state "NY", without 
// the need for them to stay in the same object.
// use $elemMatch only when you need to match two or more attributes in a subdocument
db.users.find({
	'addresses': {
		'$elemMatch': {
			'name': 'home',
			'state': 'NY'
		}
	}
})

// find all users with exactly three addresses. $size wants a number
db.users.find({'addresses': {$size: 3}})

// find all users who have 3 or more addresses
db.users.find({'addresses.2': {$exists:true}})

/* $where executes some arbitrary JavaScript to select a document.
 * Find all reviews with helpful votes greater than or equal of 3.
 * Within a JavaScript context, the keyword this refers to the current document.
 * JavaScript expressions can’t use an index */
db.reviews.find({'$where': "function() { return this.helpful_votes >= 3; }"})
db.reviews.find({'$where': "this.helpful_votes >= 3"})


// Aggregation framework -------------------------------------------------------------
product = db.products.findOne({'slug': 'wheel-barrow-9092'});
reviews_count = db.reviews.count({'product_id': product['_id']});	// 3

// get for each product the sum of the total reviews. Field used for grouping by is
// specified with "$"  
// { "_id" : ObjectId("4c4b1476238d3b4dd5003982"), "count" : 2 }, count is the name of the 
// field used. $group adds 1 to each document found
db.reviews.aggregate([
	{$group : { _id:'$product_id', count:{$sum:1} }}
]);

/* You select only the one product you want to get a count for. 
 * Note that the result from the aggregation pipeline is a cursor, a 
 * pointer to your results that allows you to process results of almost any size, 
 * one document at a time. To retrieve the single document in the result, 
 * you use the next() function to return the first document from the cursor.
 * By putting $match before $group, you greatly reduce how many documents have to 
 * be processed by the $group operator. */
db.reviews.aggregate([
	{$match : { product_id: product['_id']} },
	{$group : { _id:'$product_id', 
		average:{$avg:'$rating'},
		count:{$sum:1} 
	}}
]).next();	// Return the first document in the results.

// aggregation by rating for a product
db.reviews.aggregate([
	{$match : {'product_id': product['_id']}},
	{$group : { 
		_id:'$rating',
		count:{$sum:1}
	}}
]).toArray()	// cursor converted to an array


// pseudo-join with a temporary collection
db.mainCategorySummary.remove({});		// Remove existing documents from mainCategorySummary collection

db.products.aggregate([
	{$group : { _id:'$main_cat_id', count:{$sum:1}}}
]).forEach(function(doc) {
	/* running the findOne() command for each document to read the category name, can
	 * still be time consuming if done millions of times. */
	var category = db.categories.findOne({_id:doc._id});
	if (category !== null) {
		doc.category_name = category.name;
	} else {
		doc.category_name = 'not found';
	}
	db.mainCategorySummary.insert(doc);
});

db.mainCategorySummary.findOne();

db.products.aggregate([
	{$project : {category_ids:1}},
	{$unwind : '$category_ids'},
	{$group : { _id:'$category_ids', count:{$sum:1}}},
	{$out : 'countsByCategory'}
]);

// summarizes orders by month and year for orders beginning in 2010
// { "_id" : { "year" : 2014, "month" : 11 }, "count" : 1, "total" : 4897 }
db.orders.aggregate([
	{$match: {purchase_data: {$gte: new Date(2010, 0, 1)}}},
	{$group: {
		_id: {year : {$year :'$purchase_data'},
		month: {$month :'$purchase_data'}},
		count: {$sum:1},
		total: {$sum:'$sub_total'}},
	{$sort: {_id:-1}}
]);

// find the _id of the highest spending user
db.orders.aggregate([
	{$match: {'shipping_address.zip': {$gte: 10019, $lt: 10040}}},
	{$group: {_id: '$user_id', total: {$sum:'$sub_total'} }},
	{$match: {total: {$gt:10000}}},
	{$sort: {total: -1}},
	{$out: 'targetedCustomers'}
]);

// String functions
db.users.aggregate([
	{$match: {username: 'kbanker'}},
	{$project: {
		name: {$concat:['$first_name', ' ', '$last_name']},
		firstInitial: {$substr: ['$first_name',0,1]},
		usernameUpperCase: {$toUpper: '$username'}
	}}
])

