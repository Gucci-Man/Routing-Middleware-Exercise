process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

// add items into array to test
let cheetos = { name: "Cheetos", price: "$4.99" }; 
let doritos = { name: "Doritos", price: "$2.00" };

beforeEach(function() {
    items.push(cheetos);
    items.push(doritos);
});
  
afterEach(function() {
    // make sure this *mutates*, not redefines, `items`
    items.length = 0;
});
// end afterEach

/** GET /items/[name] - return data about one item */

describe("GET /items/:name", function() {
    test("Gets a single item", async function() {
      const resp = await request(app).get(`/items/${cheetos.name}`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body).toEqual({name: "Cheetos", price: "$4.99"});
    });
  
    test("Responds with 404 if can't find item", async function() {
      const resp = await request(app).get(`/items/0`);
      expect(resp.statusCode).toBe(404);
    });
});
  // end

  /** GET /items - return a list of shopping items */
describe("GET /items", function() {
    test("Gets entire shopping list", async function() {
      const resp = await request(app).get(`/items`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body).toEqual({items : [{name: "Cheetos", price: "$4.99"}, { name: "Doritos", price: "$2.00" }]});
    });
});
  // end

/** POST /items - create item from data */

describe("POST /items", function() {
    test("Creates a new item", async function() {
      const resp = await request(app)
        .post(`/items`)
        .send({
          name: "Popcorn",
          price: "$3.50"
        });
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        added: {name: "Popcorn" ,
        price: "$3.50"}});
    });
  });
  // end

/** PATCH /items/[name] - update item */

describe("PATCH /items/:name", function() {
    test("Updates a single item", async function() {
      const resp = await request(app)
        .patch(`/items/${cheetos.name}`)
        .send({
          name: "HOT CHEETOS",
          price: "$100"
        });
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        updated: {
            name: "HOT CHEETOS",
            price: "$100"
          }}
      );
    });
  
    test("Responds with 404 if id invalid", async function() {
      const resp = await request(app).patch(`/items/0`);
      expect(resp.statusCode).toBe(404);
    });
  });
  // end

/** DELETE /items/[name] - delete doritos snack,
 *  return `{message: "Deleted"}` */

describe("DELETE /items/:name", function() {
    test("Deletes a single item", async function() {
      const resp = await request(app).delete(`/items/${doritos.name}`);
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ message: "Deleted" });
    });
  });
  // end
  