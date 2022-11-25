const fs = require("fs");

module.exports = class Carrito {
  constructor() {}
  getAll = async (id) => {
    try {
      const archive = await fs.promises.readFile(
        "./api/prodCarrito.json",
        "utf-8"
      );

      const newDataCart = JSON.parse(archive);

      const cart = newDataCart.find((prod) => prod.carrito_id == id);

      return cart;
    } catch (e) {
      console.log(e);
    }
  };
  newCart = async () => {
    try {
      const archive = await fs.promises.readFile(
        "./api/prodCarrito.json",
        "utf-8"
      );
      const carritos = JSON.parse(archive);
      const ids = carritos.map((object) => {
        return object.carrito_id;
      });

      const max = Math.max(...ids);

      const id = max + 1;
      carritos.push({ carrito_id: id, productos: [] });

      const carritosString = JSON.stringify(carritos);

      await fs.promises.writeFile("./api/prodCarrito.json", carritosString);
      return id;
    } catch (e) {
      console.log(e);
    }
  };

  postById = async (idCart, idProd, timestamp) => {
    try {
      const readDataCart = await fs.promises.readFile("./api/prodCarrito.json");
      const readDataProd = await fs.promises.readFile("./api/productos.json");
      
      const newDataCart = JSON.parse(readDataCart);
      const newDataProd = JSON.parse(readDataProd);
      

      const cart = newDataCart.find((cart) => cart.carrito_id == idCart);

      let isInCart = cart.productos.some(prod=>prod.id == idProd)
      
      const prod = newDataProd.find((prod) => prod.id == idProd);

      console.log(isInCart)
      if (isInCart == false) {
        prod.timestamp = timestamp
        cart.productos.push(prod);
        let carritosString = JSON.stringify(newDataCart);
  
        await fs.promises.writeFile("./api/prodCarrito.json", carritosString);
        console.log("agregado al carrito")
      }

      console.log(idCart, idProd);

      
    } catch (e) {
      console.log(e);
    }
  };

  // save = async (producto) => {
  //   try {
  //     const productos = await this.getAll();
  //     const ids = productos.map((object) => {
  //       return object.id;
  //     });

  //     const max = Math.max(...ids);
  //     console.log(max);

  //     const id = max + 1;
  //     producto.id = id;
  //     productos.push(producto);

  //     const productsString = JSON.stringify(productos);

  //     await fs.promises.writeFile("./api/productos.json", productsString);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // getById = async (id) => {
  //   try {
  //     const readData = await fs.promises.readFile("./api/prodCarrito.json");
  //     const newData = JSON.parse(readData);
  //     const name = newData.find((name) => name.id == id);
  //     if (name) {
  //       return name;
  //     } else {
  //       console.log("Producto no encontrado");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  deleteCart = async (id) => {
    ///////////
    try {
      const readData = await fs.promises.readFile("./api/prodCarrito.json");
      const newData = await JSON.parse(readData);

      const indexProd = await newData.findIndex(
        (obj) => obj.carrito_id == id
      );
      if (indexProd >= 0) {
        await newData.splice(indexProd, 1);
      }
      const dataJSON = JSON.stringify(newData);
      console.log(id);
      console.log(newData);

      await fs.promises.writeFile("./api/prodCarrito.json", dataJSON);

      console.log("Producto eliminado");
    } catch (e) {
      console.log(e);
    }
  };
  // updateById = async (id, name, price) => {
  //   try {
  //     const productos = await this.getAll();
  //     const item = productos.find((prod) => prod.id === Number(id));
  //     if (item) {
  //       item.name = name;
  //       item.price = price;
  //       const dataJSON = JSON.stringify(productos);
  //       // item.thumbnail = thumbnail;
  //       await fs.promises.writeFile("./api/prodCarrito.json", dataJSON);
  //       return item;
  //     } else {
  //       return { error: "Producto no encontrado" };
  //     }
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // };

  deleteProduct = async (cartId, prodId) => {
    ///////////////////
    try {
      const readDataCart = await fs.promises.readFile("./api/prodCarrito.json");
      const newDataCart = JSON.parse(readDataCart);

      const cart = newDataCart.find((cart) => cart.carrito_id == cartId);

      const indexCart = await newDataCart.findIndex(
        (cart) => cart.carrito_id == cartId
      );

      if (!cart) {
        console.log("El carrito no existe");
      } else {
        const indexProd = await cart.productos.findIndex(
          (obj) => obj.id == prodId
        );
        if (indexProd >= 0) {
          await newDataCart[indexCart].productos.splice(indexProd, 1);
        }

        const newCart = JSON.stringify(newDataCart);

        await fs.promises.writeFile("./api/prodCarrito.json", newCart);

        console.log("Producto eliminado");
        return newDataCart;
      }
    } catch (e) {
      console.log(e);
    }
  };
};
