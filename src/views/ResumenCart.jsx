import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useRappi from "../store";
import { useNavigate } from "react-router-dom";
import "../css/ResumenCart.css";

const ResumenCart = () => {
    const carrito = useRappi((state) => state.carrito);
    const eliminarProductoByIdCart = useRappi((state) => state.eliminarProductoByIdCart);
    const profile = useRappi((state) => state.profile);
    const navigate = useNavigate();
    const [codigoCupon, setCodigoCupon] = useState("");
    const [cantidades, setCantidades] = useState(
        carrito.reduce((acc, _, index) => ({ ...acc, [index]: 1 }), {})
    );


    console.log("cantidades:", cantidades);

    const handleCantidadChange = (index, nuevaCantidad) => {
        if (nuevaCantidad > 0) {
            setCantidades({
                ...cantidades,
                [index]: nuevaCantidad,
            });
        }
    };

    const handleEliminar = (index) => {
        eliminarProductoByIdCart(index);
        const { [index]: _, ...nuevosCantidades } = cantidades;
        setCantidades(nuevosCantidades);
    };

    const calcularSubtotal = () => {
        return carrito.reduce((total, item, index) => {
            return total + item.price * (cantidades[index] || 1);
        }, 0);
    };

    const subtotal = calcularSubtotal();
    const impuesto = 0;
    const total = subtotal + impuesto;

    const handleProcederCheckout = () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }
        navigate("/checkout");
    };

    return (
        <div className="resumen-cart-container">
            <Header />

            <div className="cart-wrapper">
                <h1>Carrito de Compras</h1>

                {carrito.length === 0 ? (
                    <div className="cart-empty">
                        <p>Tu carrito está vacío</p>
                    </div>
                ) : (
                    <div className="cart-content">
                        {/* Tabla de productos */}
                        <div className="cart-table-section">
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carrito.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="product-info">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="product-image"
                                                        />
                                                    )}
                                                    <span>{item.name}</span>
                                                </div>
                                            </td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>
                                                <div className="quantity-control">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() =>
                                                            handleCantidadChange(
                                                                index,
                                                                (cantidades[index] || 1) - 1
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={cantidades[index] || 1}
                                                        onChange={(e) =>
                                                            handleCantidadChange(
                                                                index,
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        className="qty-input"
                                                    />
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() =>
                                                            handleCantidadChange(
                                                                index,
                                                                (cantidades[index] || 1) + 1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                $
                                                {(
                                                    item.price * (cantidades[index] || 1)
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-eliminar"
                                                    onClick={() => handleEliminar(index)}
                                                    title="Eliminar producto"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Sección de totales y promoción */}
                        <div className="cart-footer-section">
                            <div className="promotion-section">
                                <h3>Código de Promoción</h3>
                                <div className="promotion-form">
                                    <input
                                        type="text"
                                        placeholder="Ingrese código de cupón"
                                        value={codigoCupon}
                                        onChange={(e) => setCodigoCupon(e.target.value)}
                                        className="coupon-input"
                                    />
                                    <button className="btn-apply-coupon">
                                        APLICAR CUPÓN
                                    </button>
                                </div>
                            </div>

                            <div className="totals-section">
                                <h3>Totales del Carrito</h3>
                                <div className="total-row">
                                    <span>Subtotal:</span>
                                    <span className="amount">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Impuesto (0%):</span>
                                    <span className="amount">${impuesto.toFixed(2)}</span>
                                </div>
                                <div className="total-row total-final">
                                    <span>Total:</span>
                                    <span className="amount">${total.toFixed(2)}</span>
                                </div>
                                <button
                                    className="btn-checkout"
                                    onClick={handleProcederCheckout}
                                >
                                    PROCEDER AL CHECKOUT
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ResumenCart;