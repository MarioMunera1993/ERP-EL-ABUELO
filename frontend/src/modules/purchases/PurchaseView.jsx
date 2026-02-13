import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import directoryService from '../../services/directoryService';
import purchaseService from '../../services/purchaseService';

const PurchaseView = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const loadData = async () => {
        try {
            const [prodRes, suppRes] = await Promise.all([
                productService.getProducts(),
                directoryService.getSuppliers()
            ]);
            setProducts(prodRes);
            setSuppliers(suppRes);
        } catch (error) {
            console.error("Error cargando datos de compra:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const addToCart = (product) => {
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, {
                product,
                quantity: 1,
                purchasePrice: product.purchasePrice || 0,
                profitMargin: 30, // Default 30% margin
                salePrice: product.salePrice || 0
            }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.product.id !== id));
    };

    const updateItem = (id, field, value) => {
        setCart(cart.map(item => {
            if (item.product.id !== id) return item;

            let updatedItem = { ...item, [field]: value };

            // Lógica de cálculo de precios
            if (field === 'purchasePrice' || field === 'profitMargin') {
                const cost = field === 'purchasePrice' ? parseFloat(value) : item.purchasePrice;
                const margin = field === 'profitMargin' ? parseFloat(value) : item.profitMargin;
                if (!isNaN(cost) && !isNaN(margin)) {
                    updatedItem.salePrice = Math.round(cost * (1 + (margin / 100)));
                }
            } else if (field === 'salePrice') {
                const cost = item.purchasePrice;
                const sale = parseFloat(value);
                if (!isNaN(cost) && cost > 0 && !isNaN(sale)) {
                    updatedItem.profitMargin = Math.round(((sale / cost) - 1) * 100);
                }
            }

            return updatedItem;
        }));
    };

    const calculateTotal = () => cart.reduce((acc, item) => acc + (item.purchasePrice * item.quantity), 0);

    const handleRegisterPurchase = async () => {
        if (!selectedSupplier || !invoiceNumber) {
            alert("Por favor selecciona un proveedor e ingresa el número de factura.");
            return;
        }
        if (cart.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        const purchaseData = {
            supplier: { id: selectedSupplier },
            invoiceNumber: invoiceNumber,
            details: cart.map(item => ({
                product: { id: item.product.id },
                quantity: item.quantity,
                purchasePrice: item.purchasePrice,
                suggestedSalePrice: item.salePrice
            }))
        };

        try {
            setIsProcessing(true);
            await purchaseService.createPurchase(purchaseData);
            alert("¡Compra registrada y stock actualizado con éxito!");
            setCart([]);
            setInvoiceNumber("");
            setSelectedSupplier("");
            loadData();
        } catch (error) {
            alert("Error al registrar la compra: " + (error.response?.data || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <header className="mb-6">
                    <h1 className="text-3xl font-black text-gray-800">Compras / Stock-In</h1>
                    <p className="text-gray-500 font-medium">Registra entradas de mercancía y actualiza precios.</p>
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
                                <p className="text-sm text-gray-500">Stock actual: {p.stock}</p>
                            </div>
                            <button
                                onClick={() => addToCart(p)}
                                className="bg-green-100 text-green-600 p-3 rounded-xl font-bold hover:bg-green-600 hover:text-white transition-colors"
                            >
                                + Agregar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-6">
                <h2 className="text-2xl font-black mb-6 text-gray-800">🛒 Detalle de Compra</h2>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">Proveedor</label>
                        <select
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                            value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}
                        >
                            <option value="">-- Seleccionar --</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.companyName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">N° Factura Proveedor</label>
                        <input
                            type="text" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                            value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)}
                            placeholder="Ej: FAC-12345"
                        />
                    </div>
                </div>

                <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
                    {cart.map(item => (
                        <div key={item.product.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="absolute top-2 right-2 text-red-300 hover:text-red-500 font-bold"
                            >×</button>

                            <p className="font-bold text-gray-800 mb-3 truncate pr-6">{item.product.name}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Cantidad</label>
                                    <input
                                        type="number" className="w-full p-2 bg-white rounded-lg border text-sm"
                                        value={item.quantity} onChange={(e) => updateItem(item.product.id, 'quantity', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Costo Unit.</label>
                                    <input
                                        type="number" className="w-full p-2 bg-white rounded-lg border text-sm"
                                        value={item.purchasePrice} onChange={(e) => updateItem(item.product.id, 'purchasePrice', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">% Ganancia</label>
                                    <input
                                        type="number" className="w-full p-2 bg-white rounded-lg border text-sm"
                                        value={item.profitMargin} onChange={(e) => updateItem(item.product.id, 'profitMargin', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">P. Venta Sug.</label>
                                    <input
                                        type="number" className="w-full p-2 bg-white rounded-lg border text-sm font-bold text-blue-600"
                                        value={item.salePrice} onChange={(e) => updateItem(item.product.id, 'salePrice', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-center text-gray-400 italic py-8 border-2 border-dashed rounded-2xl">Sin productos seleccionados</p>}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between text-2xl font-black text-gray-800">
                        <span>TOTAL COMPRA:</span>
                        <span className="text-green-600">${calculateTotal().toLocaleString()}</span>
                    </div>
                </div>

                <button
                    onClick={handleRegisterPurchase}
                    disabled={isProcessing || cart.length === 0}
                    className={`w-full text-white font-black py-4 rounded-2xl mt-6 shadow-lg transition-all active:scale-95 ${isProcessing || cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
                >
                    {isProcessing ? 'REGISTRANDO...' : 'REGISTRAR COMPRA'}
                </button>
            </div>
        </div>
    );
};

export default PurchaseView;
