import { useNavigate } from "react-router-dom";
import "../css/App.css";

const areasDestacadas = [
  { 
    id: 1, 
    nombre: 'Restaurantes', 
    imagen: "https://images.rappi.pe/web-home/static/media/Restaurantes.77274b6….png",
    descripcion: "Comida a domicilio"
  },
  { 
    id: 2, 
    nombre: 'Supermercados', 
    imagen: "https://images.rappi.pe/web-home/static/media/Supermercados.0c1c0f9….png",
    descripcion: "Todo para tu hogar"
  },
];

const categorias = [
    { id: 1, nombre: 'Farmacia', imagen: "https://images.rappi.pe/home-ab-objects/iconfarma.png?e=webp&d=150x150&q=50" },
    { id: 2, nombre: 'Express', imagen: "https://images.rappi.pe/home-ab-objects/express_r8.png?e=webp&d=150x150&q=50" },
    { id: 3, nombre: 'Supermercado', imagen: "https://images.rappi.pe/home-ab-objects/iconecomm.png?e=webp&d=150x150&q=50" },
    { id: 5, nombre: 'Licores', imagen: "https://images.rappi.pe/home-ab-objects/liquors_r8.png?e=webp&d=150x150&q=50" },
    { id: 6, nombre: 'Travel', imagen: "https://images.rappi.pe/new_store_type/store_type_1624482580671.png?e=webp&d=150x150&q=50" },
];

const masBuscado = [
  { id: 1, nombre: 'Makis', icono: '🍱' },
  { id: 2, nombre: 'Pizza', icono: '🍕' },
  { id: 3, nombre: 'Pollo', icono: '🍗' },
  { id: 4, nombre: 'Helado', icono: '🍦' },
  { id: 5, nombre: 'Chifa', icono: '🥡' },
  { id: 6, nombre: 'Pollo a la brasa', icono: '🍗' },
  { id: 7, nombre: 'Agua', icono: '💧' },
  { id: 8, nombre: 'Menu', icono: '🍽️' },
  { id: 9, nombre: 'Alitas', icono: '🍗' },
  { id: 10, nombre: 'Postres', icono: '🍰' },
  { id: 11, nombre: 'Café', icono: '☕' },
  { id: 12, nombre: 'Donas', icono: '🍩' },
  { id: 13, nombre: 'Hamburguesas', icono: '🍔' },
  { id: 14, nombre: 'Pizza', icono: '🍕' },
  { id: 15, nombre: 'Pasteles', icono: '🎂' },
  { id: 16, nombre: 'Galletas', icono: '🍪' },
];

const App = () => {
    const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-8">
      
      {/* Sección: ¿Necesitas algo más? */}
      <section className="necesitas-mas">
        <h2 className="text-2xl font-bold mb-4">¿Necesitas algo más?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areasDestacadas.map((area) => (
            <div 
              key={area.id} 
              className="card card-compact bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => navigate(`/${area.nombre.toLowerCase()}`)}
            >
              <div className="card-body flex-row items-center gap-4">
                <figure className="w-20 h-20 flex-shrink-0">
                  <img src={area.imagen} alt={area.nombre} className="w-full h-full object-contain" />
                </figure>
                <div className="text-white">
                  <h3 className="card-title text-xl font-bold">{area.nombre}</h3>
                  <p className="text-sm opacity-90">{area.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Categorías */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Categorías</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categorias.map((categoria) => (
            <div 
              key={categoria.id} 
              className="card w-28 bg-base-100 shadow-md hover:shadow-xl transition-all cursor-pointer flex-shrink-0 transform hover:scale-105" 
              onClick={() => navigate(`/${categoria.nombre.toLowerCase()}`)}
            >
              <figure className="px-4 pt-4">
                <img src={categoria.imagen} alt={categoria.nombre} className="rounded-xl w-16 h-16 object-contain" />
              </figure>
              <div className="card-body items-center p-3">
                <h3 className="text-xs font-semibold text-center">{categoria.nombre}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Lo más buscado */}
      <section className="mas-buscado">
        <h2 className="text-2xl font-bold mb-4">Lo más buscado</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {masBuscado.map((item) => (
            <div 
              key={item.id}
              className="badge-busqueda badge badge-lg badge-outline p-4 h-auto cursor-pointer hover:badge-primary transition-all"
              onClick={() => navigate(`/menu/${item.nombre.toLowerCase()}`)}
            >
              <span className="text-2xl mr-2">{item.icono}</span>
              <span className="font-medium">{item.nombre}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default App;