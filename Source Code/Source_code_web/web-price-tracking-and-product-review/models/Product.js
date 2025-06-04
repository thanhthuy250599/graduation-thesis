const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;
//const DATA = "DataProducts";
const DATA = "products";
//var textSearch = require('mongoose-text-search');

const products = new Schema(
    {
        catid: Number,
        itemid: Number,
        shopid: Number,
        name: String,
        attributes: {value: {type:String}, name: String},
        images: [String],
        description: String,
        currency: String,
        image: String,
        shop_location: String,
        historical_sold: Number,
        normal_stock: Number,
        discount:String,
        cmt_count: Number,
        liked_count: Number,
        rating_star: Number,
        url:String,
        review_price: {price: {type:Number}, DayUpdate: Date},

    },
    { collection: DATA }
);
//products.index({Ten:'text',Hang_SX:'text'},{weights:{Ten:4}});
products.index({name:'text'});

Products=mongoose.model('products',products)
//products.plugin(textSearch);

const listProducts = mongoose.model(DATA, products)

const topTrending = async () => {
    const skip = 0;
    const limit = 8;
    return await listProducts.find().skip(skip).limit(limit);
}

module.exports= {
    TopTrending: topTrending,
    Products:Products
};