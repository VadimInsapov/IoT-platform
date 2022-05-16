exports.index = function (request, response){
    response.render("scripts.hbs");
};
exports.create = function (request, response){
    response.render("scripts.create.hbs");
};