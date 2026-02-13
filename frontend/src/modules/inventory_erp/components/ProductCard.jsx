import React from 'react';

const ProductCard = ({ product, onEdit, onDelete, isLowStock }) => {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border ${isLowStock ? 'border-red-200 bg-red-50' : 'border-gray-100'} hover:shadow-md transition-shadow relative overflow-hidden`}>
            {isLowStock && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    BAJO STOCK
                </div>
            )}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{product.code || 'SIN CÓDIGO'}</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">{product.name}</h3>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stock actual:</span>
                    <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>{product.stock} unidades</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Precio compra:</span>
                    <span className="font-semibold text-gray-700">${product.purchasePrice}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                    <span className="text-gray-700 font-medium">Precio Venta (COP):</span>
                    <span className="font-bold text-blue-600 text-lg">${product.salePrice}</span>
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <button
                    onClick={() => onEdit(product)}
                    className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
