import { create } from 'zustand'


const agregarProducto = (set, get, nombreProducto) => {
    // actualizar el carrito con este nuevo producto
    console.log("Agregando producto al carrito:", nombreProducto);

    set({carrito:  [...get().carrito, nombreProducto]   })

}


const useRappi = create( (set, get) => {
    return {
        carrito: [],
        profile: null,
        categorias: [],
        marcas: [],
        agregarProducto: (nombreProducto) => agregarProducto(set, get, nombreProducto, ),
        profileUpdated: (nuevoProfile) => set({profile: nuevoProfile} ),
        setCategorias: (nuevasCategorias) => set({categorias: nuevasCategorias} ),
        setMarcas: (nuevasMarcas) => set({marcas: nuevasMarcas} ),
        eliminarProductosCarrito: () => set({carrito: []}),
        eliminarProductoByIdCart: (idProducto) => {
            const carritoActual = get().carrito;
            const nuevoCarrito = carritoActual.filter( (producto, index) => index !== idProducto );
            set({carrito: nuevoCarrito});
        }
    }
} );



export const useCheckout = create( (set, get) => {
    return {
        direccion: null,
        metodoPago: null,
        setDireccion: (nuevaDireccion) => set({direccion: nuevaDireccion} ),
        setMetodoPago: (nuevoMetodoPago) => set({metodoPago: nuevoMetodoPago} ),
    }
} );

export default useRappi;



// son 2 callbac para el create,
//  set y get
//  set sirve para actualizar el estado
//  get sirve para obtener el estado actual