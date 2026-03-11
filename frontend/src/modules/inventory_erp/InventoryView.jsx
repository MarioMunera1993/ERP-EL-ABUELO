import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductForm from './components/ProductForm';
import ProductCard from './components/ProductCard';
import { useNotification } from '../../context/NotificationContext';

const InventoryView = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const { notify } = useNotification();

    const loadData = async () => {
        try {
            const [productsRes, alertsRes] = await Promise.all([
                productService.getProducts(),
                productService.getStockAlerts()
            ]);
            setProducts(productsRes);
            setAlerts(alertsRes);
        } catch (error) {
            console.error("Error cargando inventario:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = async (productData) => {
        try {
            if (isEditing) {
                await productService.updateProduct(productData.id, productData);
            } else {
                await productService.createProduct(productData);
            }
            notify(isEditing ? "¡Producto actualizado con éxito!" : "¡Producto creado con éxito!", "success");
            setIsEditing(false);
            setSelectedProduct(null);
            loadData();
        } catch (error) {
            notify(error.response?.data || "Error al guardar producto", "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await productService.deleteProduct(id);
                notify("¡Producto eliminado con éxito!", "success");
                loadData();
            } catch (error) {
                notify("No tienes permisos para eliminar o hubo un error.", "error");
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 animate-fadeIn">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-gray-800">Gestión de Inventario</h1>
                    <p className="text-gray-500 font-medium">Control de stock de Ferretería El Abuelo.</p>
                </div>
                {alerts.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        <span className="font-bold">{alerts.length} productos con stock bajo</span>
                    </div>
                )}
            </header>

            <ProductForm
                onSave={handleSave}
                editingProduct={selectedProduct}
                onCancel={() => { setIsEditing(false); setSelectedProduct(null); }}
            />

            <div className="mb-8 max-w-md">
                <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o código..."
                    className="w-full p-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                    <ProductCard
                        key={p.id}
                        product={p}
                        isLowStock={alerts.some(a => a.id === p.id)}
                        onEdit={(prod) => { setSelectedProduct(prod); setIsEditing(true); window.scrollTo(0, 0); }}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-medium italic">No se encontraron productos.</p>
                </div>
            )}
        </div>
    );
};

export default InventoryView;
