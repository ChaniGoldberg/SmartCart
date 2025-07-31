import React, { useEffect, useState, useContext } from 'react';
import { Search, Package, Tags } from 'lucide-react';
import { ProductDTO } from '@smartcart/shared/src/dto/Product.dto';
import { Tag } from '@smartcart/shared/src/tag';
import { searchProductApiService } from '../../services/searcProductApi';
import { StoreContext } from 'src/store/storage/StoreProvider';

export const CompareComponent = () => {
  const { selectedStores, stores } = useContext(StoreContext);

  // מערך ה-storePKs מתוך הסופרים שנבחרו בלבד
  const storePKs = selectedStores ? selectedStores.map((store: any) => store.storePK) : [];

  // כל הסופרים שנבחרו (ללא כפילויות)
  const allStores = (selectedStores ?? []).filter(
    (store, idx, arr) => arr.findIndex(s => s.storePK === store.storePK) === idx
  );

  const [tags, setTags] = useState<Tag[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/tag/tags');
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.error('שגיאה בשליפת קטגוריות:', error);
      }
    };
    fetchTags();
  }, []);

  const handleSearch = async () => {
    setProducts([]);
    setHasSearched(true);
    setLoading(true);
    setError('');
    try {
      const res = await searchProductApiService.getSearchProduct(searchTerm, storePKs);
      setProducts(res);
    } catch (error) {
      console.error('שגיאה בשליפת מוצרים:', error);
      setError('אירעה שגיאה בשליפת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = async (tagId: number) => {
    setSearchTerm('');
    setSelectedTagId(tagId);
    setHasSearched(true);
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/products/by-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName: tags.find(t => t.tagId === tagId)?.tagName,
          storePKs: storePKs
        })
      });
      const data = await response.json();
      setProducts(data);
      console.log(data);
      // כאן יש להוסיף קריאת שרת לשליפת מוצרים לפי קטגוריה
    } catch (error) {
      console.error('שגיאה בטעינת מוצרים מהקטגוריה:', error);
      setError('אירעה שגיאה בשליפת המוצרים');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      dir="rtl"
      style={{
        height: '100vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Search className="h-6 w-6 text-teal-600" />
          השוואת מוצרים
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="הזן שם מוצר לחיפוש..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={selectedTagId ?? ''}
            onChange={(e) => setSelectedTagId(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">בחר קטגוריה</option>
            {tags.map((tag) => (
              <option key={tag.tagId} value={tag.tagId}>
                {tag.tagName}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition"
          >
            {loading ? 'מחפש...' : 'חפש'}
          </button>
        </div>
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            {error}
          </div>
        )}
      </div>
      {searchTerm.trim() === '' && !hasSearched && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {tags.map((tag) => (
            <div
              key={tag.tagId}
              onClick={() => handleTagClick(tag.tagId)}
              className="cursor-pointer p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-gray-50 text-center"
            >
              <Tags className="mx-auto mb-2 text-teal-500" />
              <p className="text-gray-700 font-semibold">{tag.tagName}</p>
            </div>
          ))}
        </div>
      )}
      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b text-right">שם מוצר</th>
                <th className="px-4 py-2 border-b text-right">תיאור</th>
                <th className="px-4 py-2 border-b text-right">מחיר</th>
                <th className="px-4 py-2 border-b text-right">חנות</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const store = allStores.find(
                  (s) => String(s.storePK).trim() === String(product.storePK).trim()
                );
                return (
                  <tr key={product.priceId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{product.ProductName}</td>
                    <td className="px-4 py-2 border-b">{product.manufacturerItemDescription}</td>
                    <td className="px-4 py-2 border-b text-teal-700 font-bold">
                      ₪{product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <span className="text-sm text-gray-700">
                        {store ? `${store.chainName} - ${store.storeName}` : "חנות לא נמצאה"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        hasSearched &&
        !loading && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">לא נמצאו מוצרים</p>
          </div>
        )
      )}
    </div>
  );
};
export default CompareComponent;