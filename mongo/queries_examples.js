db.products.insert(product);
db.products.createIndex({slug: 1}, {unique: true});
// query for all products in the Gardening Tools category
db.products.find({category_ids: ObjectId('6a5b1476238d3b4dd5000048')});

product = db.products.findOne({'slug': 'wheel-barrow-9092'});
db.categories.findOne({'_id': product['main_cat_id']});
db.reviews.find({'product_id': product['_id']});

// offset, limit and sorting
db.reviews.find({'product_id': product['_id']})
		  .sort({'helpful_votes': -1})
		  .skip(0).limit(12);
		  
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
