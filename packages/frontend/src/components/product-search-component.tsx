import React, { useState } from 'react';
import { Search, Package, ShoppingCart } from 'lucide-react';
import { ProductDTO } from '@smartcart/shared/src/dto/Product.dto';
import { searchApiService } from '../services/searchApi'; 

const ProductSearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const storePK = '1234'; 

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('אנא הזן מונח חיפוש');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);
    
    try {
      debugger
      const results = await searchApiService.getSearchProduct(searchTerm, storePK);
      setProducts(results);
    } catch (err) {
      setError('אירעה שגיאה בחיפוש המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8 text-teal-600" />
          חיפוש מוצרים
        </h1>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="הזן שם מוצר לחיפוש..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Search className="h-4 w-4" />
            {loading ? 'מחפש...' : 'חפש'}
          </button>
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">קוד מוצר</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">שם מוצר</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">יצרן</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">תיאור</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">מחיר</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">כמות באריזה</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.itemCode} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">{product.itemCode}</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-medium">{product.ProductName}</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">{product.manufacturerName}</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600 text-sm">{product.manufacturerItemDescription}</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800 font-bold text-teal-600">
                    ₪{product.price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">{product.quantityInPackage}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.itemStatus 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.itemStatus ? 'זמין' : 'לא זמין'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {products.length === 0 && !loading && hasSearched && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">לא נמצאו מוצרים</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearchComponent;