import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import useRappi from "../store";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import toastHenry, { Toaster } from 'react-hot-toast';



const API_FOOD = "https://devsapihub.com/api-fast-food"



const storeDescription = {
    name: "D´nnos Pizza",
    address: "Av. Comandante Espinar 266, Miraflores 15074",
    category: "Pizzas",
    service: "Delivery",
    deliveryTime: "44 min",
    shippingCost: "Gratis (nuevos usuarios)",
    rating: 3.5,
    logo: "https://images.rappi.pe/restaurants_logo/9abefdb1-af26-47f5-a923-088a29d28166-1686534198848.png?e=webp&d=10x10&q=10"
};


const MenuView = () => {


    // const carrito =  useRappi((state) => state.carrito);
    // const profile =  useRappi((state) => state.profile);
    const agregarProducto =  useRappi((state) => state.agregarProducto);

    // console.log(agregarProducto);



    const { marca } = useParams();  // Para capturar el parámetro "marca" de la URL

    // crea restado menus con useState
    const [menus, setMenus] = useState([]);

    const [menuActive, setMenuActive] = useState({});
    const [cantidad, setCantidad] = useState(1);
    const [acompañamiento, setAcompañamiento] = useState("Sin Papas Fritas");

    console.log("marca:", marca);
    console.log("menus:", menus);




    useEffect(() => {
        
        axios.get(`${API_FOOD}/category/${marca}`).then((response) => {
            console.log("Datos del menú obtenidos con Axios:", response.data);
            setMenus(response.data);
        });


    }, [marca]);
    


    return (
        <div className="min-h-screen bg-base-200">


            <Header/>

            {/* Open the modal using document.getElementById('ID').showModal() method */}
{/* <button className="btn" onClick={()=>document.getElementById('modal_menu').showModal()}>open modal</button> */}
{/* <dialog id="modal_menu" className="modal">  
  <div className="modal-box">
    <h3 className="font-bold text-lg">{menuActive.name}</h3>
    <p className="py-4">{menuActive.description}</p>
    <img src={menuActive.image} alt={menuActive.name} />
    <div className="modal-action">
      <form method="dialog">
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog> */}


            {/* Breadcrumbs */}
            <div className="bg-base-100 border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="text-sm breadcrumbs">
                        <ul>
                            <li><a>Rappi</a></li>
                            <li><a>Restaurantes Delivery</a></li>
                            <li><a>Restaurantes en Lima</a></li>
                            <li className="font-semibold">Menú Delivery</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Header del Menú */}
            <div className="bg-base-100 border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Menú de {storeDescription.name} - {marca}</h1>
                </div>
            </div>

            {/* Ofertas Destacadas */}
            <div className="bg-base-100 border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                            <div className="card-body p-4">
                                <div className="badge badge-primary badge-sm mb-2">✓</div>
                                <h3 className="font-bold text-sm">Envío gratis en tu pedido</h3>
                                <p className="text-xs text-gray-600">Disfruta de este descuento exclusivo en tu pedido...</p>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                            <div className="card-body p-4">
                                <div className="badge badge-primary badge-sm mb-2">✓</div>
                                <h3 className="font-bold text-sm">50% de cashback en tu pedido</h3>
                                <p className="text-xs text-gray-600">Disfruta de este descuento exclusivo en tu pedido...</p>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                            <div className="card-body p-4">
                                <div className="badge badge-warning badge-sm mb-2">👑</div>
                                <h3 className="font-bold text-sm">Hasta 30% OFF exclusivo Pro</h3>
                                <p className="text-xs text-gray-600">Disfruta por ser Pro de este beneficio en los...</p>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                            <div className="card-body p-4">
                                <div className="badge badge-primary badge-sm mb-2">✓</div>
                                <h3 className="font-bold text-sm">Hasta 20% OFF imperdible</h3>
                                <p className="text-xs text-gray-600">Disfruta este descuento en tu pedido y recíbelo en...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenedor Principal con Sidebar */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Sidebar Izquierdo */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="card bg-base-100 shadow-lg sticky top-4">
                            <div className="card-body p-6 space-y-4">
                                {/* Logo y Info del Restaurante */}
                                <div className="flex items-start gap-3">
                                    <div className="avatar">
                                        <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={storeDescription.logo} alt={storeDescription.name} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-bold text-lg">{storeDescription.name}</h2>
                                        <p className="text-xs text-gray-500">{storeDescription.address}</p>
                                        <p className="text-xs text-gray-600 mt-1">{storeDescription.category} - {storeDescription.name}</p>
                                    </div>
                                </div>

                                <div className="divider my-2"></div>

                                {/* Información de Entrega */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">Delivery ⏱️</span>
                                        <span className="ml-auto font-bold">{storeDescription.deliveryTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">Envío 🚴</span>
                                        <span className="ml-auto text-green-600 font-bold">{storeDescription.shippingCost}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">Calificación</span>
                                        <div className="ml-auto flex items-center gap-1">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="font-bold">{storeDescription.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="divider my-2"></div>

                                {/* Navegación de Categorías */}
                                <div className="space-y-1">
                                    <button className="btn btn-sm btn-ghost w-full justify-between">
                                        <span>Combos D'nnos</span>
                                        <span className="text-xs">⌃ ⌄</span>
                                    </button>
                                    <button className="btn btn-sm btn-ghost w-full justify-between">
                                        <span>Pizzas</span>
                                        <span className="text-xs">›</span>
                                    </button>
                                    <button className="btn btn-sm btn-ghost w-full justify-between">
                                        <span>Pizzas Grandes</span>
                                        <span className="text-xs">›</span>
                                    </button>
                                    <button className="btn btn-sm btn-ghost w-full justify-between">
                                        <span>Pizzas Familiares</span>
                                        <span className="text-xs">›</span>
                                    </button>
                                    <button className="btn btn-sm btn-ghost w-full justify-between">
                                        <span>Pizzas de 2 Sabores</span>
                                        <span className="text-xs">›</span>
                                    </button>
                                    <button className="btn btn-sm btn-ghost w-full justify-between">
                                        <span>Panes</span>
                                        <span className="text-xs">›</span>
                                    </button>
                                    <button className="btn btn-sm btn-ghost w-full justify-between">
                                        <span>Bebidas</span>
                                        <span className="text-xs">›</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Contenido Principal - Menú de Productos */}
                    <main className="flex-1">
                        <div className="space-y-8">
                            
                            {/* Sección de Menú */}
                            {menus.length > 0 ? (
                                <section>
                                    <h2 className="text-2xl font-bold mb-6 capitalize">{marca}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {menus.map((menu) => (
                                            <div
                                                key={menu.id}
                                                className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                                                onClick={() => {
                                                            setMenuActive(menu);
                                                            document.getElementById('modal_menu').showModal();
                                                        }}>
                                                <figure className="w-40 flex-shrink-0">
                                                    <img 
                                                        src={menu.image} 
                                                        alt={menu.name} 
                                                        className="w-full h-full object-cover rounded-l-2xl"
                                                    />
                                                </figure>
                                                <div className="card-body p-4">
                                                    <h3 className="card-title text-base">{menu.name}</h3>
                                                    <p className="text-xs text-gray-600 line-clamp-2">{menu.description}</p>
                                                    <div className="card-actions justify-between items-center mt-2">
                                                        <div className="flex flex-col">
                                                            <span className="badge badge-error badge-sm">-10%</span>
                                                            <span className="text-lg font-bold">S/ {menu.price}</span>
                                                            <span className="text-xs text-gray-400 line-through">S/ {(menu.price * 1.11).toFixed(2)}</span>
                                                        </div>
                                                        <button className="btn btn-primary btn-sm"  onClick={() => {
                                                            setMenuActive(menu);
                                                            document.getElementById('modal_menu').showModal();
                                                        }} >
                                                            Agregar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="loading loading-spinner loading-lg text-primary"></div>
                                    <p className="mt-4 text-gray-500">Cargando menú...</p>
                                </div>
                            )}

                        </div>
                    </main>
                </div>
            </div>

            {/* Modal de Detalle del Menú */}
            <dialog id="modal_menu" className="modal">
                <div className="modal-box max-w-4xl p-0">
                    {/* Botón Cerrar */}
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10 bg-white shadow-lg">
                            ✕
                        </button>
                    </form>

                    {/* Contenedor Principal */}
                    <div className="flex flex-col md:flex-row">
                        {/* Imagen del Producto */}
                        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
                            <img 
                                src={menuActive.image} 
                                alt={menuActive.name}
                                className="w-full h-auto object-contain rounded-lg max-h-96"
                            />
                        </div>

                        {/* Detalles del Producto */}
                        <div className="md:w-1/2 p-6 space-y-4">
                            {/* Título y Precio */}
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{menuActive.name}</h3>
                                <p className="text-3xl font-bold text-gray-800">$ {menuActive.price}</p>
                            </div>

                            {/* Descripción */}
                            <div>
                                <p className="text-sm text-gray-600">
                                    {menuActive.description}
                                    <button className="text-primary ml-1 font-semibold">... Leer más</button>
                                </p>
                            </div>

                            {/* Formulario de Acompañamiento */}
                            <div className="collapse collapse-arrow bg-base-200">
                                <input type="checkbox" defaultChecked /> 
                                <div className="collapse-title flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold">Elige tu Acompañamiento</h4>
                                        <p className="text-xs text-gray-500">Selecciona 1 opciones.</p>
                                    </div>
                                    <span className="badge badge-success badge-sm">Listo</span>
                                </div>
                                <div className="collapse-content">
                                    <div className="space-y-3 mt-2">
                                        <label className="flex items-center justify-between cursor-pointer hover:bg-base-300 p-3 rounded-lg">
                                            <span className="text-sm">Sin Papas Fritas</span>
                                            <input 
                                                type="radio" 
                                                name="acompañamiento" 
                                                className="radio radio-primary"
                                                value="Sin Papas Fritas"
                                                checked={acompañamiento === "Sin Papas Fritas"}
                                                onChange={(e) => setAcompañamiento(e.target.value)}
                                            />
                                        </label>
                                        <label className="flex items-center justify-between cursor-pointer hover:bg-base-300 p-3 rounded-lg">
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-sm">Con Papas Fritas</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold">+ $ 11.00</span>
                                                    <input 
                                                        type="radio" 
                                                        name="acompañamiento" 
                                                        className="radio radio-primary"
                                                        value="Con Papas Fritas"
                                                        checked={acompañamiento === "Con Papas Fritas"}
                                                        onChange={(e) => setAcompañamiento(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Controles Inferiores */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                {/* Contador de Cantidad */}
                                <div className="flex items-center gap-4 bg-base-200 rounded-lg p-2">
                                    <button 
                                        className="btn btn-sm btn-circle"
                                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                    >
                                        🗑️
                                    </button>
                                    <span className="font-bold text-lg px-4">{cantidad}</span>
                                    <button 
                                        className="btn btn-sm btn-circle"
                                        onClick={() => setCantidad(cantidad + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Botón Agregar */}
                                <button className="btn btn-success text-white px-6" onClick={() => {
                                    agregarProducto(menuActive);
                                    // lanzar notificacion de que se agregó al carrito
                                    // toast.success('Producto agregado al carrito');

                                    toast.success('Producto agregado al carrito', {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: false,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "light",
                                                transition: Bounce,
                                                });


                                    // toastHenry.success('Producto agregado al carrito', {
                                    //     position: "top-right",
                                    //     duration: 5000,
                                    //     hideProgressBar: false,
                                    //     closeOnClick: true,
                                    //     pauseOnHover: true,
                                    //     draggable: true,
                                    //     progress: undefined,
                                    // });
                                  }  } >
                                    Agregar $ {(
                                        (menuActive.price + (acompañamiento === "Con Papas Fritas" ? 11 : 0)) * cantidad
                                    ).toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

                <ToastContainer />
                <Toaster />
        </div>
    );
}

export default MenuView;