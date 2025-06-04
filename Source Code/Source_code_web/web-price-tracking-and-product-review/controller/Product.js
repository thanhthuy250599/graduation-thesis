const {
    TopTrending,
    Products
} = require("../models/Product");

exports.searchName = async(req,res) =>{
  const query =req.params.query;
  return await Products.find( {$text: { $search: query }},
    { score: { $meta: "textScore" } }, (findErr, findRes) => {
    if (findErr) {
    //log error here
      res.status(200).send({
        message: 'Failed: to search via index',
        success: true,
        result: findErr
      });
    }
    else {
      res.send(findRes);
    }
  }).sort({ score: { $meta: "textScore" } }).limit(30);
}

exports.getCate = async(req,res) =>{
  const query =req.params.query;
  return await Products.find( {"catid":query}, (findErr, findRes) => {
    if (findErr) {
    //log error here
      res.status(200).send({
        message: 'Failed: to search via index',
        success: true,
        result: findErr
      });
    }
    else {
      res.send(findRes);
    }
  }).sort({"historical_sold":-1}).limit(50);
}

exports.TopTrending = async (req, res) => {
    try {
      let response = await TopTrending();
      return res.status(200).json({
        response,
      });
    } catch (err) {
      res.status(400).json({
        message: "load fail",
      });
  
      console.log(err);
    }
};
