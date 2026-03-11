import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { getUnitAbbrev } from '../../utils/unitUtils';
import directoryService from '../../services/directoryService';
import purchaseService from '../../services/purchaseService';
import { useNotification } from '../../context/NotificationContext';

const PurchaseView = () => {
    const [activeTab, setActiveTab] = useState('register'); // 'register' o 'history'
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { notify } = useNotification();

    const loadData = async () => {
        try {
            const [prodRes, suppRes, purchRes] = await Promise.all([
                productService.getProducts(),
                directoryService.getSuppliers(),
                purchaseService.getPurchases()
            ]);
            setProducts(prodRes);
            setSuppliers(suppRes);
            setPurchases(purchRes.sort((a,b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)));
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
                profitMargin: 30,
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
            notify("Por favor selecciona un proveedor e ingresa el número de factura.", "error");
            return;
        }
        if (cart.length === 0) {
            notify("El carrito está vacío.", "error");
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
            notify("¡Compra registrada y stock actualizado con éxito!", "success");
            setCart([]);
            setInvoiceNumber("");
            setSelectedSupplier("");
            loadData();
        } catch (error) {
            notify("Error al registrar la compra: " + (error.response?.data || error.message), "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAnnulPurchase = async (id) => {
        if (!window.confirm("¿Estás seguro de anular esta compra? El stock se revertirá automáticamente.")) return;
        try {
            setIsProcessing(true);
            await purchaseService.deletePurchase(id);
            notify("Compra anulada exitosamente.", "success");
            loadData();
        } catch (error) {
            notify("Error al anular compra: " + (error.response?.data || error.message), "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-4 sm:p-6">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Módulo de <span className="text-green-600">Compras</span> 📦</h1>
                    <p className="text-slate-500 font-medium">Gestiona entradas de mercancía y consulta el historial.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('register')}
                        className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'register' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                    >
                        Registrar Nueva
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                    >
                        Historial / CRUD
                    </button>
                </div>
            </header>

            {activeTab === 'register' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <input
                                type="text" placeholder="🔍 Buscar producto por nombre o código..."
                                className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{p.name}</h4>
                                        <p className="text-sm text-slate-500 font-bold">Stock: {p.stock} {getUnitAbbrev(p.unit) || 'un'}</p>
                                    </div>
                                    <button
                                        onClick={() => addToCart(p)}
                                        className="bg-green-50 text-green-600 px-4 py-2 rounded-xl font-bold hover:bg-green-600 hover:text-white transition-colors"
                                    >
                                        + Agregar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 h-fit sticky top-6">
                        <h2 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-2">🛒 Detalle de Factura</h2>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-1">Proveedor</label>
                                <select
                                    className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                    value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.companyName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-1">N° Factura</label>
                                <input
                                    type="text" className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                    value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)}
                                    placeholder="FAC-0001"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.product.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 font-black transition-colors"
                                    >×</button>
                                    <p className="font-bold text-slate-800 text-sm truncate mb-3 pr-6">{item.product.name}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Cant.</label>
                                            <input
                                                type="number" className="w-full p-2 bg-white rounded-lg border-none shadow-sm text-sm font-bold"
                                                value={item.quantity} onChange={(e) => updateItem(item.product.id, 'quantity', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Costo</label>
                                            <input
                                                type="number" className="w-full p-2 bg-white rounded-lg border-none shadow-sm text-sm font-bold"
                                                value={item.purchasePrice} onChange={(e) => updateItem(item.product.id, 'purchasePrice', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase">% Gan.</label>
                                            <input
                                                type="number" className="w-full p-2 bg-white rounded-lg border-none shadow-sm text-sm font-bold"
                                                value={item.profitMargin} onChange={(e) => updateItem(item.product.id, 'profitMargin', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase">Venta</label>
                                            <input
                                                type="number" className="w-full p-2 bg-white rounded-lg border-none shadow-sm text-sm font-bold text-blue-600"
                                                value={item.salePrice} onChange={(e) => updateItem(item.product.id, 'salePrice', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {cart.length === 0 && <p className="text-center text-slate-400 italic py-8 border-2 border-dashed rounded-2xl border-slate-100">Vacío</p>}
                        </div>

                        <div className="border-t border-slate-100 pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-bold">TOTAL:</span>
                                <span className="text-2xl font-black text-green-600">${calculateTotal().toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleRegisterPurchase}
                            disabled={isProcessing || cart.length === 0}
                            className={`w-full text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 ${isProcessing || cart.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}
                        >
                            {isProcessing ? 'PROCESANDO...' : 'REGISTRAR COMPRA'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fadeIn">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-5">Fecha</th>
                                    <th className="px-6 py-5">Factura</th>
                                    <th className="px-6 py-5">Proveedor</th>
                                    <th className="px-6 py-5 text-right">Total</th>
                                    <th className="px-6 py-5 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {purchases.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {new Date(p.purchaseDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-700">{p.invoiceNumber}</td>
                                        <td className="px-6 py-4 text-slate-600">{p.supplier?.companyName}</td>
                                        <td className="px-6 py-4 text-right font-black text-slate-800">
                                            ${p.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleAnnulPurchase(p.id)}
                                                className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-bold transition-colors text-sm"
                                            >
                                                Anular / Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {purchases.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">No hay registros de compras.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseView;
