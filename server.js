const express = require("express");
const { Router } = express;
const routerProductos = Router();
const routerCarrito = Router();
const Container = require("./classContainer.js");
const Carrito = require("./classCarrito.js");
// const { engine } = require("express-handlebars");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors")


const contenedor = new Container();
const carrito = new Carrito();

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use(cors({
  origin : "*",
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log(`App funcionando en http://localhost:${port}`);
});

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.send(
      "<h1 style='color:blue;'> E-commerce </h1><a href='/form'> Subir producto </a>"
  );
});
app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


// app.set("view engine", "hbs");
// app.set("views", "./views");
// app.engine(
//   "hbs",
//   engine({
//     extname: ".hbs",
//     defaultLayout: "index.hbs",
//     layoutsDir: __dirname + "/views/layouts",
//     partialsDir: __dirname + "/views/partials",
//   })
// );


let isAdmin = true;

routerProductos.get("/", async (req, res) => {
  try {
    const productos = await contenedor.getAll();
    res.json(productos);
  } catch (error) {
    res.json({ error: true, msj: "error" });
  }
});

routerProductos.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.json((await contenedor.getById(id)) ?? { error: "no encontrado" });
});

routerProductos.post(
  "/",
  async (req, res, next) => {
    if (isAdmin === true) {
      next();
    } else {
      return res
        .status(401)
        .json({ error: -1, descripcion: "ruta 'x' método 'y' no autorizada" });
    }
  },
  async (req, res) => {
    try {
      const { body } = req;
      contenedor.save(body);
      // res.json("ok");
    } catch (error) {
      res.json({ error: true, msj: "error" });
    }
  }
);

routerProductos.put(
  "/:id",
  async (req, res, next) => {
    if (isAdmin === true) {
      next();
    } else {
      return res
        .status(401)
        .json({ error: -1, descripcion: "ruta 'x' método 'y' no autorizada" });
    }
  },
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price } = req.body;
      console.log(name, price, id);
      await contenedor.updateById(id, name, price);
      res.json({ succes: true });
    } catch (error) {
      res.json({ error: true, msj: "error" });
    }
  }
);

routerProductos.delete(
  "/:id",
  async (req, res, next) => {
    if (isAdmin === true) {
      next();
    } else {
      return res
        .status(401)
        .json({ error: -1, descripcion: "ruta 'x' método 'y' no autorizada" });
    }
  },
  async (req, res) => {
    try {
      const id = req.params.id;
      contenedor.deleteById(id);
      res.send("Eliminado");
    } catch (error) {
      res.json({ error: true, msj: "error" });
    }
  }
);


routerCarrito.post("/", async (req, res) => {
  res.json((await carrito.newCart()) ?? { error: "no encontrado" });
});

routerCarrito.post("/:id/productos/:id_prod", async (req, res) => {

  try {
  const idCart = req.params.id;
  const idProd = req.params.id_prod;
  let timestamp = Date.now();
  await carrito.postById(idCart, idProd, timestamp)
  res.json(id)
  } catch (error) {
    res.json({ error: true, msj: "error" });
  }
});


routerCarrito.get("/:id/productos/", async (req, res) => {
  try {
    const { id } = req.params;
      productos = await carrito.getAll(id)
      res.json(productos);

  } catch (error) {
    res.json({ error: true, msj: "error" });
  }
});

routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_prod } = req.params;
    
      productos = await carrito.deleteProduct(id,id_prod)
      res.json(productos);

  } catch (error) {
    res.json({ error: true, msj: "error" });
  }
});

routerCarrito.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
      await carrito.deleteCart(id)
      res.json({succes: true});

  } catch (error) {
    res.json({ error: true, msj: "error" });
  }
});


