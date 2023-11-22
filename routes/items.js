const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

// 1. GET /items 
router.get("/", function(req, res){
    res.json({items})
})

// 2. POST /items
router.post("/", function(req, res){
    const newItem = {name: req.body.name, price: req.body.price}
    items.push(newItem)
    res.status(201).json({ added: newItem})
})


// 3. GET /items/:name
router.get("/:name", function(req, res){

    const foundItem = items.find(item => item.name === req.params.name)
    if(foundItem === undefined){
        throw new ExpressError("Item not found", 404)
    }
    res.json(foundItem)
})

// 4. PATCH /items/:name
router.patch("/:name", function(req, res){
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404)
      }
    foundItem.name = req.body.name
    foundItem.price = req.body.price
    res.json({updated: foundItem})
})

// 5. DELETE /items/:name 
router.delete("/:name", function(req, res){
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === -1) {
        throw new ExpressError("Item not found", 404)
      }
    items.splice(foundItem, 1)
    res.json({message: "Deleted"})
})

module.exports = router;