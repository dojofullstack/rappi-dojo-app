import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useRappi from "../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ResumenCart.css";
import "../css/Checkout.css";

const Checkout = () => {

    // const cantidades  = null;
    const carrito = useRappi((state) => state.carrito);
    const profile = useRappi((state) => state.profile);
    const navigate = useNavigate();
    
    // Estado del formulario de cliente
    const [datosCliente, setDatosCliente] = useState({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        apartamento: "",
        ciudad: "",
        estado: "",
        codigoPostal: "",
    });

    // Estado de métodos de pago y envío
    const [metodoPago, setMetodoPago] = useState("tarjeta");
    const [metodoEnvio, setMetodoEnvio] = useState("gratis");
    const [datosTargeta, setDatosTargeta] = useState({
        nombreTitular: "",
        numeroTarjeta: "",
        fechaVencimiento: "",
        cvv: "",
    });




    const handleDatosClienteChange = (e) => {
        const { name, value } = e.target;
        setDatosCliente({
            ...datosCliente,
            [name]: value,
        });
    };

    const handleDatosTargetaChange = (e) => {
        const { name, value } = e.target;
        setDatosTargeta({
            ...datosTargeta,
            [name]: value,
        });
    };

    const calcularSubtotal = () => {
        return carrito.reduce((total, item, index) => {
            return total + item.price * 1;
        }, 0);
    };

    const subtotal = calcularSubtotal();
    const costoEnvio = metodoEnvio === "express" ? 10 : 0;
    const impuesto = 0;
    const total = subtotal + costoEnvio + impuesto;

    const handleCompletarPago = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (
            !datosCliente.nombre ||
            !datosCliente.email ||
            !datosCliente.direccion ||
            !datosCliente.ciudad ||
            !datosCliente.codigoPostal
        ) {
            alert("Por favor completa todos los datos del cliente");
            return;
        }

        if (metodoPago === "tarjeta") {
            if (
                !datosTargeta.nombreTitular ||
                !datosTargeta.numeroTarjeta ||
                !datosTargeta.fechaVencimiento ||
                !datosTargeta.cvv
            ) {
                alert("Por favor completa los datos de la tarjeta");
                return;
            }
        }

        try {
            // Preparar datos para enviar al backend
            const datosPedido = {
                datosCliente,
                metodoPago,
                metodoEnvio,
                subtotal,
                costoEnvio,
                impuesto,
                total,
                carrito,
            };

            // Enviar pedido al backend
            const response = await axios.post('/api/pedidos', datosPedido);

            if (response.data.status) {
                // Pedido exitoso
                alert(
                    `¡Pago completado exitosamente!\n` +
                    `Número de pedido: ${response.data.pedidoId}\n` +
                    `Método: ${metodoPago === "tarjeta" ? "Tarjeta" : "PayPal"}\n` +
                    `Envío: ${metodoEnvio === "gratis" ? "Gratis (7 días)" : "Express ($10 - 3 días)"}\n` +
                    `Total: $${total.toFixed(2)}`
                );

                // Limpiar carrito después del pago exitoso
                useRappi.getState().eliminarProductosCarrito();

                // Redirigir a la página principal o de confirmación
                navigate('/');
            } else {
                alert("Error al procesar el pedido. Por favor intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error al enviar pedido:", error);
            alert(
                "Ocurrió un error al procesar tu pedido.\n" +
                "Por favor verifica tu conexión e intenta de nuevo."
            );
        }
    };

    const eliminarProductoByIdCart = useRappi((state) => state.eliminarProductoByIdCart);

    return (
        <div className="resumen-cart-container">
            <Header />

            <div className="cart-wrapper">
                <h1>Checkout</h1>

                {carrito.length === 0 ? (
                    <div className="cart-empty">
                        <p>Tu carrito está vacío</p>
                    </div>
                ) : (
                    <div className="cart-content">
                        {/* Formulario de datos del cliente */}
                        <form onSubmit={handleCompletarPago} className="checkout-form-section">
                            <div id="checkout-form" className="checkout-form">
                                <h2>Dirección de Envío</h2>
                                
                                <div className="form-group">    
                                    <input
                                        type="text"
                                        name="direccion"
                                        placeholder="Calle y número"
                                        value={datosCliente.direccion}
                                        onChange={handleDatosClienteChange}
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-add-more">
                                    <span>+</span> Agregar apartamento, suite, etc.
                                </div>

                                {datosCliente.apartamento !== undefined && (
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="apartamento"
                                            placeholder="Apartamento, suite, etc."
                                            value={datosCliente.apartamento}
                                            onChange={handleDatosClienteChange}
                                            className="input-field"
                                        />
                                    </div>
                                )}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Tu nombre"
                                            value={datosCliente.nombre}
                                            onChange={handleDatosClienteChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="tu@email.com"
                                            value={datosCliente.email}
                                            onChange={handleDatosClienteChange}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            placeholder="+1 (555) 000-0000"
                                            value={datosCliente.telefono}
                                            onChange={handleDatosClienteChange}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Ciudad</label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            placeholder="Ciudad"
                                            value={datosCliente.ciudad}
                                            onChange={handleDatosClienteChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <input
                                            type="text"
                                            name="estado"
                                            placeholder="Estado/Provincia"
                                            value={datosCliente.estado}
                                            onChange={handleDatosClienteChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Código Postal</label>
                                        <input
                                            type="text"
                                            name="codigoPostal"
                                            placeholder="12345"
                                            value={datosCliente.codigoPostal}
                                            onChange={handleDatosClienteChange}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                {/* Métodos de Envío */}
                                <h3>Método de Envío</h3>
                                <div className="shipping-methods">
                                    <label className={`shipping-option ${metodoEnvio === "gratis" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="metodoEnvio"
                                            value="gratis"
                                            checked={metodoEnvio === "gratis"}
                                            onChange={(e) => setMetodoEnvio(e.target.value)}
                                        />
                                        <div className="shipping-content">
                                            <span className="shipping-name">Envío Estándar</span>
                                            <span className="shipping-time">Tiempo de entrega: 7 días</span>
                                        </div>
                                        <span className="shipping-price">Gratis</span>
                                    </label>

                                    <label className={`shipping-option ${metodoEnvio === "express" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="metodoEnvio"
                                            value="express"
                                            checked={metodoEnvio === "express"}
                                            onChange={(e) => setMetodoEnvio(e.target.value)}
                                        />
                                        <div className="shipping-content">
                                            <span className="shipping-name">Envío Express</span>
                                            <span className="shipping-time">Tiempo de entrega: 3 días</span>
                                        </div>
                                        <span className="shipping-price">$10.00</span>
                                    </label>
                                </div>

                                {/* Métodos de Pago */}
                                <h3>Método de Pago</h3>
                                <div className="payment-methods">
                                    <label className={`payment-option ${metodoPago === "tarjeta" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value="tarjeta"
                                            checked={metodoPago === "tarjeta"}
                                            onChange={(e) => setMetodoPago(e.target.value)}
                                        />
                                        <span className="payment-name">Tarjeta de Crédito o Débito</span>
                                        <div className="card-logos">
                                            <span className="logo visa">VISA</span>
                                            <span className="logo mastercard">MC</span>
                                            <span className="logo discover">DISCOVER</span>
                                            <span className="logo amex">AMEX</span>
                                        </div>
                                    </label>

                                    <label className={`payment-option ${metodoPago === "paypal" ? "active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value="paypal"
                                            checked={metodoPago === "paypal"}
                                            onChange={(e) => setMetodoPago(e.target.value)}
                                        />
                                        <span className="payment-name">PayPal</span>
                                        <span className="paypal-logo">PayPal</span>
                                    </label>
                                </div>

                                {/* Datos de la tarjeta (solo si está seleccionada) */}
                                {metodoPago === "tarjeta" && (
                                    <div className="card-details">
                                        <h4>Datos de la Tarjeta</h4>
                                        <div className="form-group">
                                            <label>Nombre del Titular</label>
                                            <input
                                                type="text"
                                                name="nombreTitular"
                                                placeholder="Juan Pérez"
                                                value={datosTargeta.nombreTitular}
                                                onChange={handleDatosTargetaChange}
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número de Tarjeta</label>
                                            <input
                                                type="text"
                                                name="numeroTarjeta"
                                                placeholder="1234 5678 9012 3456"
                                                value={datosTargeta.numeroTarjeta}
                                                onChange={handleDatosTargetaChange}
                                                maxLength="19"
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Fecha de Vencimiento</label>
                                                <input
                                                    type="text"
                                                    name="fechaVencimiento"
                                                    placeholder="MM/YY"
                                                    value={datosTargeta.fechaVencimiento}
                                                    onChange={handleDatosTargetaChange}
                                                    maxLength="5"
                                                    className="input-field"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>CVV</label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    placeholder="123"
                                                    value={datosTargeta.cvv}
                                                    onChange={handleDatosTargetaChange}
                                                    maxLength="4"
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Botón de Completar Pago */}
                                <button type="submit" className="btn-completar-pago">
                                    COMPLETAR PAGO
                                </button>
                            </div>
                        </form>


                        {/* Sección de totales y promoción */}
                        <div className="cart-footer-section">
                            <div className="totals-section">
                                <h3>Totales del Carrito</h3>
                                <div className="total-row">
                                    <span>Subtotal:</span>
                                    <span className="amount">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Envío:</span>
                                    <span className="amount">${costoEnvio.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Impuesto (0%):</span>
                                    <span className="amount">${impuesto.toFixed(2)}</span>
                                </div>
                                <div className="total-row total-final">
                                    <span>Total:</span>
                                    <span className="amount">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Checkout;