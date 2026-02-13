import React, { useState, useEffect } from 'react';
import categoryService from '../../../services/categoryService';

const ProductForm = ({ onSave, editingProduct, onCancel }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        purchasePrice: '',
        salePrice: '',
        stock: 0,
        stockMin: 5,
        ivaPercentage: 19.00,
        category: { id: '' }
    });

    const [categories, setCategories] = useState([]);
    const [showCatModal, setShowCatModal] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', description: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error cargando categorías");
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const created = await categoryService.createCategory(newCat);
            setCategories([...categories, created]);
            setFormData({ ...formData, category: { id: created.id } });
            setShowCatModal(false);
            setNewCat({ name: '', description: '' });
        } catch (error) {
            alert("Error creando categoría");
        }
    };

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                ...editingProduct,
                category: editingProduct.category || { id: '' }
            });
        } else {
            setFormData({
                code: '',
                name: '',
                description: '',
                purchasePrice: '',
                salePrice: '',
                stock: 0,
                stockMin: 5,
                ivaPercentage: 19.00,
                category: { id: '' }
            });
        }
    }, [editingProduct]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.category.id) {
            alert("Por favor selecciona una categoría");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 relative">
            <header className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-700">
                    {editingProduct ? '📑 Editar Producto' : '📦 Registrar Nuevo Producto'}
                </h3>
                <button
                    type="button"
                    onClick={() => setShowCatModal(true)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 underline underline-offset-4"
                >
                    + Crear Nueva Categoría
                </button>
            </header>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Código / SKU</label>
                        <input
                            type="text" placeholder="Ej: MART-001"
                            className="p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
                            value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nombre del Producto *</label>
                        <input
                            type="text" placeholder="Ej: Martillo de bola 16oz" required
                            className="p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none font-bold"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Categoría *</label>
                        <select
                            required
                            className="p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
                            value={formData.category.id}
                            onChange={(e) => setFormData({ ...formData, category: { id: e.target.value } })}
                        >
                            <option value="">Seleccionar...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Stock Inicial *</label>
                        <input
                            type="number" required
                            className="p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
                            value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Precio Compra *</label>
                        <input
                            type="number" step="0.01" required
                            className="p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
                            value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Precio Venta *</label>
                        <input
                            type="number" step="0.01" required
                            className="p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none font-bold text-blue-600"
                            value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Stock Mínimo</label>
                        <input
                            type="number"
                            className="p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
                            value={formData.stockMin} onChange={(e) => setFormData({ ...formData, stockMin: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">% IVA</label>
                        <input
                            type="number" step="0.01"
                            className="p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
                            value={formData.ivaPercentage} onChange={(e) => setFormData({ ...formData, ivaPercentage: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                        {editingProduct ? '💾 ACTUALIZAR PRODUCTO' : '✅ GUARDAR PRODUCTO'}
                    </button>
                    {editingProduct && (
                        <button type="button" onClick={onCancel} className="bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
                            CANCELAR
                        </button>
                    )}
                </div>
            </form>

            {/* Modal de Categoría */}
            {showCatModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h4 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Nueva Categoría</h4>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                                <input
                                    type="text" required autoFocus
                                    className="w-full p-3 bg-slate-50 rounded-xl mt-1 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Descripción</label>
                                <textarea
                                    className="w-full p-3 bg-slate-50 rounded-xl mt-1 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    value={newCat.description} onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">CREAR</button>
                                <button type="button" onClick={() => setShowCatModal(false)} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200">DESCARTAR</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductForm;
