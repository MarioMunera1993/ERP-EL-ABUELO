import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import directoryService from '../../services/directoryService';
import saleService from '../../services/saleService';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

const SalesView = () => {
    // ... rest of the code updated in the previous chunk
    const [products, setProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [discount, setDiscount] = useState(0); // Removing global discount usage in logic
    const [searchTerm, setSearchTerm] = useState("");
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [lastSale, setLastSale] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const sellerName = user?.fullName || user?.username || "Vendedor";

    const loadData = async () => {
        try {
            const [prodRes, cliRes] = await Promise.all([
                productService.getProducts(),
                directoryService.getClients()
            ]);
            setProducts(prodRes);
            setClients(cliRes);
        } catch (error) {
            console.error("Error cargando datos de venta:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const addToCart = (product) => {
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
            if (existing.quantity >= product.stock) {
                alert("No hay suficiente stock disponible.");
                return;
            }
            setCart(cart.map(item =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            if (product.stock <= 0) {
                alert("Producto sin stock.");
                return;
            }
            setCart([...cart, { product, quantity: 1, unitPrice: product.salePrice, discount: 0 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.product.id !== id));
    };

    const updateQuantity = (id, qty) => {
        const numericQty = parseInt(qty);
        if (isNaN(numericQty) || numericQty < 0) return;
        if (numericQty === 0) {
            removeFromCart(id);
            return;
        }
        const item = cart.find(i => i.product.id === id);
        if (numericQty > item.product.stock) {
            alert("Excede el stock disponible.");
            return;
        }
        setCart(cart.map(i => i.product.id === id ? { ...i, quantity: numericQty } : i));
    };

    const updateItemDiscount = (id, disc) => {
        const numericDisc = parseFloat(disc);
        if (isNaN(numericDisc) || numericDisc < 0) return;
        setCart(cart.map(i => i.product.id === id ? { ...i, discount: numericDisc } : i));
    };

    const calculateSubtotal = () => cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const calculateTotalDiscount = () => cart.reduce((acc, item) => acc + (item.discount || 0), 0);
    const calculateIVA = () => cart.reduce((acc, item) => {
        const lineTotal = (item.unitPrice * item.quantity) - (item.discount || 0);
        return acc + (lineTotal * (item.product.ivaPercentage / 100));
    }, 0);

    const subtotal = calculateSubtotal();
    const totalDiscount = calculateTotalDiscount();
    const iva = calculateIVA();
    const total = subtotal - totalDiscount + iva;

    const handleFinalizeSale = async () => {
        if (!selectedClient) {
            alert("Por favor selecciona un cliente.");
            return;
        }
        if (cart.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        const saleData = {
            client: { id: selectedClient },
            discount: 0, // Global discount set to 0.
            details: cart.map(item => ({
                product: { id: item.product.id },
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount
            }))
        };

        try {
            setIsFinalizing(true);
            const response = await saleService.createSale(saleData);
            alert("¡Venta registrada con éxito!");

            setLastSale({
                id: response.id,
                invoiceNumber: response.invoiceNumber,
                clientName: clients.find(c => c.id == selectedClient)?.fullName || 'Consumidor Final',
                clientTaxId: clients.find(c => c.id == selectedClient)?.taxId || '',
                sellerName: sellerName,
                date: new Date().toLocaleString(),
                details: cart.map(item => ({
                    productName: item.product.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discount: item.discount,
                    ivaPercentage: item.product.ivaPercentage,
                    lineTotal: (item.unitPrice * item.quantity) - item.discount
                })),
                subtotal: subtotal,
                ivaTotal: iva,
                discount: totalDiscount,
                total: total
            });

            setCart([]);
            setSelectedClient("");
            setDiscount(0);
            loadData();
        } catch (error) {
            alert("Error al finalizar la venta: " + (error.response?.data || error.message));
        } finally {
            setIsFinalizing(false);
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Buscador de Productos */}
            <div className="lg:col-span-2">
                <header className="mb-6">
                    <h1 className="text-3xl font-black text-gray-800">Caja / Ventas</h1>
                    <p className="text-gray-500 font-medium">Busca productos y agrégalos al carrito.</p>
                </header>

                <div className="mb-6">
                    <input
                        type="text" placeholder="🔍 Buscar producto por nombre..."
                        className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center hover:shadow-md transition-shadow">
                            <div>
                                <h4 className="font-bold text-gray-800">{p.name}</h4>
                                <p className="text-sm text-gray-500">Stock: {p.stock} | Precio: ${p.salePrice}</p>
                            </div>
                            <button
                                onClick={() => addToCart(p)}
                                className="bg-blue-100 text-blue-600 p-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-colors"
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carrito de Compras */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-6">
                <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2">
                    🛒 Carrito <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>
                </h2>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-600 mb-2">Seleccionar Cliente</label>
                    <select
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                        value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
                    >
                        <option value="">-- Cliente --</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.taxId} - {c.fullName}</option>)}
                    </select>
                </div>

                <div className="space-y-4 mb-8 max-h-80 overflow-y-auto">
                    {cart.map(item => (
                        <div key={item.product.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-sm text-gray-800 truncate pr-4">{item.product.name}</p>
                                <button onClick={() => removeFromCart(item.product.id)} className="text-red-300 hover:text-red-500 font-bold text-lg">×</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cant.</label>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            className="w-6 h-6 flex items-center justify-center bg-white border rounded text-gray-500 hover:bg-gray-100 text-xs"
                                        >-</button>
                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            className="w-6 h-6 flex items-center justify-center bg-white border rounded text-gray-500 hover:bg-gray-100 text-xs"
                                        >+</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Precio Unit.</label>
                                    <p className="text-sm font-bold text-gray-700">${item.unitPrice}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Descuento</label>
                                    <input
                                        type="number"
                                        className="w-full p-1 text-sm bg-white border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={item.discount}
                                        onChange={(e) => updateItemDiscount(item.product.id, e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="text-right">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Subtotal</label>
                                    <p className="text-sm font-black text-blue-600">${(item.unitPrice * item.quantity) - item.discount}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-center text-gray-400 italic py-8 border-2 border-dashed rounded-2xl">Carrito vacío</p>}
                </div>

                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal:</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Descuento Total:</span>
                        <span className="text-red-500">-${totalDiscount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>IVA:</span>
                        <span>${iva.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-xl font-black text-gray-800 pt-4 border-t border-dashed">
                        <span>TOTAL:</span>
                        <span className="text-blue-600">${total.toLocaleString()}</span>
                    </div>
                </div>

                <button
                    onClick={handleFinalizeSale}
                    disabled={isFinalizing || cart.length === 0}
                    className={`w-full text-white font-black py-4 rounded-2xl mt-6 shadow-lg transition-all active:scale-95 ${isFinalizing || cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                >
                    {isFinalizing ? 'PROCESANDO...' : 'REGISTRAR VENTA'}
                </button>

                {/* Modal / Botón de descarga de factura */}
                {lastSale && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
                        <p className="text-green-700 font-bold mb-2 text-sm">¡Venta # {lastSale.id} guardada!</p>
                        <button
                            onClick={() => generateInvoicePDF(lastSale)}
                            className="w-full bg-green-600 text-white font-bold py-2 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>📄</span> Descargar Factura PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesView;
