import React, { useContext, useState } from 'react';
import { Search, Package, ShoppingCart, Plus, Minus } from 'lucide-react';
import { ProductDTO } from '@smartcart/shared/src/dto/Product.dto';
import { searchApiService } from '../services/searchApi';
import { Check } from 'lucide-react';
import { useUser } from '../store/redux/userContext';
import { cartContext } from '../store/redux/cartRedux';
import { log } from 'console';
import { ProductCartDTO } from "@smartcart/shared";

const ProductSearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [addToCartStates, setAddToCartStates] = useState<{
    [itemCode: string]: { quantity: number; isActive: boolean };
  }>({});

  const { addToCart } = useContext(cartContext);
  const handleAddToCart = (item: ProductCartDTO, quantity: number) => {
    addToCart(item, quantity);
  };

  const { user } = useUser();
    let storePK = user?.preferred_store||"";
    //חנות דפולטיבית
    if(user?.preferred_store==undefined){
      storePK = "7290058140886-1-001"; // חנות דפולטיבית אם לא נבחרה חנות מועדפת
    }
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('אנא הזן מונח חיפוש');
      return;
    }
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const results = await searchApiService.getSearchProduct(searchTerm, storePK);
      setProducts(results);
      const initialStates = results.reduce((acc, product) => {
        acc[product.itemCode] = { quantity: 1, isActive: false };
        return acc;
      }, {} as { [itemCode: string]: { quantity: number; isActive: boolean } });
      setAddToCartStates(initialStates);
    } catch (err) {
      setError('אירעה שגיאה בחיפוש המוצרים');
    } finally {
      setLoading(false);
    }
  };
  const handleQuantityChange = (itemCode: string, delta: number) => {
    setAddToCartStates((prev) => ({
      ...prev,
      [itemCode]: {
        ...prev[itemCode],
        quantity: Math.max(0, prev[itemCode].quantity + delta),
      },
    }));
  };
  const handleToggleAddToCart = (itemCode: string) => {
    setAddToCartStates((prev) => ({
      ...prev,
      [itemCode]: {
        ...prev[itemCode],
        isActive: !prev[itemCode].isActive,
      },
    }));
  };
  const handleInputQuantityChange = (itemCode: string, value: string) => {
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed >= 0) {
      setAddToCartStates((prev) => ({
        ...prev,
        [itemCode]: {
          ...prev[itemCode],
          quantity: parsed,
        },
      }));
    }
  };
  const handleConfirm = (itemCode: string) => {
    const quantity = addToCartStates[itemCode]?.quantity || 1;
    if (quantity === 0) {
      alert('יש לבחור כמות גדולה מ-0');
      return;
    }
    try {
      const product = products.find((p) => p.itemCode === itemCode);
      if (!product) { return }
      const productCart: ProductCartDTO = {
        product: product,
        quantity: quantity
      };
      handleAddToCart(productCart, quantity);
      alert(`מוצר ${itemCode} נוסף לסל עם כמות: ${quantity}`);
      setAddToCartStates((prev) => ({
        ...prev,
        [itemCode]: {
          quantity: 1, // Reset back to default quantity
          isActive: false, // Set isActive to false to show "הוסף לסל" button again
        },
      }));
    }
    catch (error) {
      console.error("Error adding to cart:", error);
      alert('אירעה שגיאה בהוספת המוצר לסל');
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
                <th className="border px-4 py-3 text-right">קוד</th>
                <th className="border px-4 py-3 text-right">שם</th>
                <th className="border px-4 py-3 text-right">יצרן</th>
                <th className="border px-4 py-3 text-right">תיאור</th>
                <th className="border px-4 py-3 text-right">מחיר</th>
                <th className="border px-4 py-3 text-right">כמות באריזה</th>
                <th className="border px-4 py-3 text-right">סטטוס</th>
                <th className="border px-4 py-3 text-right">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const cartState = addToCartStates[product.itemCode];
                return (
                  <tr key={product.itemCode} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{product.itemCode}</td>
                    <td className="border px-4 py-2">{product.ProductName}</td>
                    <td className="border px-4 py-2">{product.manufacturerName}</td>
                    <td className="border px-4 py-2 text-sm text-gray-600">{product.manufacturerItemDescription}</td>
                    <td className="border px-4 py-2 text-teal-700 font-bold">₪{product.price.toFixed(2)}</td>
                    <td className="border px-4 py-2">{product.quantityInPackage}</td>
                    <td className="border px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.itemStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-800'
                        }`}>
                        {product.itemStatus ? 'זמין' : 'לא זמין'}
                      </span>
                    </td>
                    <td className="border px-1 py-2 text-left">
                      {!cartState?.isActive ? (
                        <button

                          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                          onClick={() => handleToggleAddToCart(product.itemCode)}
                        >
                          הוסף לסל
                          <ShoppingCart size={16} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleQuantityChange(product.itemCode, 1)} className="px-2 py-1 bg-gray-200 rounded">
                            <Plus size={16} />
                          </button>
                          <input
                            type="number"
                            className="w-16 text-center border rounded"
                            value={cartState.quantity}
                            onChange={(e) => handleInputQuantityChange(product.itemCode, e.target.value)}
                          />
                          <button onClick={() => handleQuantityChange(product.itemCode, -1)} className="px-2 py-1 bg-gray-200 rounded">
                            <Minus size={16} />
                          </button>

                          <button
                            onClick={() => handleConfirm(product.itemCode)}
                            className="flex items-center justify-center w-10 h-10 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Check size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
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
