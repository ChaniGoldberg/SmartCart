import React, { useEffect, useState, useContext } from 'react';
import { Search, Package, Tags } from 'lucide-react';
import { ProductDTO } from '@smartcart/shared/src/dto/Product.dto';
import { Tag } from '@smartcart/shared/src/tag';
import { searchApiService } from '../../services/searchApi';
import { searchAnotherApiService } from '../../services/searchAnotherApi';
import { StoreContext } from 'src/store/storage/StoreProvider';
export const CompareComponent = () => {
  const { selectedStores } = useContext(StoreContext); // get stores from context
  // Always include these PKs
  const alwaysIncludePKs = [
    "7290058140886-1-010",
    "7290058140886-1-048",
    "7290103152017-1-031",
    "7290103152017-1-028"
  ];
  // Merge storePKs from context with alwaysIncludePKs (no duplicates)
  const storePKs = [
    ...(selectedStores ? selectedStores.map((store: any) => store.storePK) : []),
    ...alwaysIncludePKs
  ].filter((pk, idx, arr) => arr.indexOf(pk) === idx);
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
    setHasSearched(true);
    setLoading(true);
    setError('');
    try {
      let res;
      res = await searchAnotherApiService.getSearchProduct(searchTerm, storePKs);
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
      const res = await fetch(`/api/products/byTag/${tagId}`);
      const data = await res.json();
      setProducts(data);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.priceId} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.ProductName}</h3>
              <p className="text-gray-600 mb-1">תיאור: {product.manufacturerItemDescription}</p>
              <p className="text-teal-700 font-bold">מחיר: ₪{product.price.toFixed(2)}</p>
            </div>
          ))}
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