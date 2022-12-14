const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const { application } = require("express");

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index",{articles: articles})
    })
});

router.get("/admin/articles/new",(req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories: categories})
    })
})

router.post("/articles/save", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    })

});

router.post("/articles/delete",(req, res) => {
    var id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
                where: {
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            })
        }else{// Não for um número
            res.redirect("/admin/articles");
        }
    }else{// NULL
        res.redirect("/admin/articles");
    }
})

router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/articles")
    }

    Article.findByPk(id).then(articles => {
        if(articles != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {articles: articles, categories: categories})
            })
        }else{
            res.redirect("/admin/articles")
        }
    }).catch(err => {
        res.redirect("/admin/articles")
    })
});

router.post("/admin/articles/update", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var id = req.body.id;
    var category = req.body.category;

    Article.update({title: title, slug: slugify(title), body: body, categoryId: category},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(err => {
        res.redirect("/admin/articles")
    })

})


module.exports = router;