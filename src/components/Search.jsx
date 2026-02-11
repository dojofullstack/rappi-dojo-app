import { useState } from "react";


const Search = () => {
  
    const  [precioZapatilla, setPrecioZapatilla] =  useState("$100");
    const  [buscador, setBuscador] =  useState("");
    const  [price, setPrice] =  useState("");

    // console.log(precioZapatilla);
    console.log(buscador);
    console.log(price);



  return (
    <div>
      <input type="text" placeholder="Search..." value={buscador} onChange={(e) => setBuscador(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

      <button>Search</button>

      <h2>BUscando el producto {buscador} con precio {price}</h2>

      <hr />


      <h2>
        Precio Zapatilla: {precioZapatilla}
      </h2>

      <button onClick={() => setPrecioZapatilla("$120") } >Actualizar precio Zapatilla</button>
    </div>
  );
}

export default Search;