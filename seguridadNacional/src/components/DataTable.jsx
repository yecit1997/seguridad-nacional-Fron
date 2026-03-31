import React, { useState } from 'react';

const DataTable = ({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    loading = false,
    searchPlaceholder = "Buscar...",
    onSearch,
    actions = true,
    customActions = null,
    compact = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredData = data?.filter(item => {
        if (!searchTerm) return true;
        return columns.some(col => {
            const value = item[col.key];
            return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
    }) || [];

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        onSearch?.(value);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
            </div>
        );
    }

    const theadClass = compact ? "px-2 py-2 text-xs" : "px-6 py-3 text-xs";
    const tbodyClass = compact ? "px-2 py-2" : "px-6 py-4";
    
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {onSearch && (
                <div className={`${compact ? 'p-2' : 'p-4'} border-b`}>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className={`w-full md:w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${compact ? 'px-2 py-1 text-sm' : 'px-4 py-2'}`}
                    />
                </div>
            )}
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-sky-700 text-white">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`${theadClass} text-left text-xs font-medium uppercase tracking-wider ${col.width || ''} ${col.className || ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                            {actions && (
                                <th className={`${theadClass} text-right text-xs font-medium uppercase tracking-wider w-24`}>
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className={`${tbodyClass} text-center text-gray-500`}>
                                    No hay datos disponibles
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td key={col.key} className={`${tbodyClass} whitespace-nowrap ${col.cellClassName || ''}`}>
                                            {col.render ? col.render(item[col.key], item) : item[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className={`${tbodyClass} whitespace-nowrap text-right text-sm font-medium`}>
                                            {customActions ? customActions(item) : (
                                                <>
                                                    {onView && (
                                                        <button
                                                            onClick={() => onView(item)}
                                                            className="text-sky-600 hover:text-sky-900 mr-3"
                                                            title="Ver detalles"
                                                        >
                                                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {onEdit && (
                                                        <button
                                                            onClick={() => onEdit(item)}
                                                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                                                            title="Editar"
                                                        >
                                                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={() => onDelete(item)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Eliminar"
                                                        >
                                                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={`${compact ? 'px-2 py-2' : 'px-6 py-4'} flex items-center justify-between border-t`}>
                    <div className="text-sm text-gray-700">
                        Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} resultados
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
