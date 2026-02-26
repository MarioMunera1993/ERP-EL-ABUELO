// Lista de unidades de medida disponibles para el producto.
// Los valores (`value`) deben coincidir con los nombres de las constantes
// del enum UnitOfMeasure del backend.

export const unitOptions = [
    // Longitud
    { value: 'METROS', label: 'Metros (m)' },
    { value: 'CENTIMETROS', label: 'Centímetros (cm)' },
    { value: 'MILIMETROS', label: 'Milímetros (mm)' },
    { value: 'PULGADAS', label: 'Pulgadas (")' },
    { value: 'PIES', label: 'Pies (ft)' },

    // Masa / peso
    { value: 'KILOGRAMOS', label: 'Kilogramos (kg)' },
    { value: 'GRAMOS', label: 'Gramos (g)' },
    { value: 'LIBRAS', label: 'Libras (lb)' },
    { value: 'TONELADAS', label: 'Toneladas (t)' },

    // Volumen
    { value: 'LITROS', label: 'Litros (L)' },
    { value: 'MILILITROS', label: 'Mililitros (ml)' },
    { value: 'GALONES', label: 'Galones (gal)' },
    { value: 'METROS_CUBICOS', label: 'Metros cúbicos (m³)' },

    // Conteo
    { value: 'UNIDAD', label: 'Unidad (un)' },
    { value: 'DOCENA', label: 'Docena' },
    { value: 'GRUESA', label: 'Gruesa (144)' },
    { value: 'SET', label: 'Set / Juego / Kit' }
];

// Mapas auxiliares para mostrar la abreviatura junto a cantidades
export const unitAbbreviations = {
    METROS: 'm',
    CENTIMETROS: 'cm',
    MILIMETROS: 'mm',
    PULGADAS: '"',
    PIES: 'ft',
    KILOGRAMOS: 'kg',
    GRAMOS: 'g',
    LIBRAS: 'lb',
    TONELADAS: 't',
    LITROS: 'L',
    MILILITROS: 'ml',
    GALONES: 'gal',
    METROS_CUBICOS: 'm³',
    UNIDAD: 'un',
    DOCENA: 'dz',
    GRUESA: '144',
    SET: 'set'
};

export const getUnitLabel = (value) => {
    const opt = unitOptions.find(u => u.value === value);
    return opt ? opt.label : '';
};

export const getUnitAbbrev = (value) => unitAbbreviations[value] || '';
