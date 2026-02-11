import { useEffect, useState } from "react";
import axios from "axios";

const Restaurantes = () => {

    const [productos, setProductos] = useState([]);
   
    const [categorias, setCategorias] = useState([
    "Comida Rápida",
    "Italiana",
    "Mexicana",
    "China",
    "Postres",
  ]);
    const [marcas, setMarcas] = useState([
    "McDonald's",
    "Burger King",
    "KFC",
    "Subway",
    "Pizza Hut",
  ]);

  console.log(marcas);

  console.log(productos);



    useEffect(() => {
        console.log("Componente Restaurantes montado");
        // alert("Bienvenido a la sección de Restaurantes");
  }, []); // El arreglo vacío significa que este efecto se ejecuta solo una vez al montar el componente


//     useEffect(() => {
//         console.log("Componente Restaurantes montado");
//         alert("Bienvenido a la sección de Restaurantes");
//   }); // Sin arreglo de dependencias, se ejecuta en cada renderizado


//     useEffect(() => {
//         console.log("Componente Restaurantes montado, LISTAR CATEGORIAS");
//         alert("Bienvenido a la sección de Restaurantes, LISTAR CATEGORIAS");
//   }, [categorias]); // El arreglo vacío significa que este efecto se ejecuta solo una vez al montar el componente


    useEffect(() => {
       
// fetch('https://dummyjson.com/products')
// .then(res => res.json())
// .then((data) => {
//     console.log("Datos obtenidos de la API:", data)
//     setProductos(data.products);
//     // Aquí podrías actualizar el estado con los datos obtenidos
// });



    axios.get("https://dummyjson.com/products").then((response) => {
        console.log("Datos obtenidos con Axios:", response.data);
        setProductos(response.data.products);
    });
        
        
  }, []); // El arreglo vacío significa que este efecto se ejecuta solo una vez al montar el componente

  return (
    <div>
      <h2>Restaurantes Component</h2>

      <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1> 


      // boton con estilos de facebook usando tailwindcss 

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Inicar Sesión
      </button>

      <button className="btn btn-neutral">Neutral</button>
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-info">Info</button>
<button className="btn btn-success">Success</button>
<button className="btn btn-warning">Warning</button>
<button className="btn btn-error">Error</button>

<div className="avatar">
  <div className="w-24 rounded-xl">
    <img src="https://img.daisyui.com/images/profile/demo/yellingwoman@192.webp" />
  </div>
</div>
<div className="avatar">
  <div className="w-24 rounded-full">
    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
  </div>
</div>



<div className="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">
      Card Title
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions justify-end">
      <div className="badge badge-outline">Fashion</div>
      <div className="badge badge-outline">Products</div>
    </div>
  </div>
</div>
      

      <ul>
        {marcas.map((marca, index) => (
          <li key={index}>{marca}</li>
        ))}
      </ul>


      <button onClick={() => {
        setMarcas(
            [
    "McDonald's",
    "Burger King",
    "KFC",
    "Subway",
    "Pizza Hut",
    "Taco Bell",
    "Wendy's"
  ]
        );
      }}>Agregar Marcas</button>



      <button onClick={() => {
        setCategorias(
            [
    "Comida Rápida",
    "Italiana",
    "Mexicana",
    "China",
    "Postres",
    "Vegetariana",
    "Vegana"
  ]
        );
      }}>
        Cambiar Categorías
      </button>


      <div>

        {
            productos.map((producto, index) => (
                <div key={index} style={{border: '1px solid gray', margin: '10px', padding: '10px'}}>
                    <h3>{producto.title}</h3>
                    <p>{producto.description}</p>
                    <p>Precio: ${producto.price}</p>
                    <img src={producto.thumbnail} alt={producto.title} width="100" />
                </div>
            ))
        }



      </div>
    </div>
  );
};

export default Restaurantes;
