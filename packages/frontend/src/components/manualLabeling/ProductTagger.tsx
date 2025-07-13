import React, { useState } from "react";
import axios from "axios";

interface Product {
  itemCode: number;
  itemId: number;
  itemType: number;
  itemName: string;
  correctItemName: string;
  manufacturerName: string;
  manufactureCountry: string;
  manufacturerItemDescription: string;
  itemStatus: boolean;
  tagsId: number[];
}

interface Tag {
  tagId: number;
  tagName: string;
  dateAdded: string;
  isAlreadyScanned: boolean;
}

interface ProductTaggerProps {
  products: Product[];
  tags: Tag[];
}

const ProductTagger: React.FC<ProductTaggerProps> = ({ products, tags: initialTags }) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [pendingTag, setPendingTag] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // לחיצה על תגית לבחירה או הסרה
  const handleTagClick = (tagId: number) => {
    setSelectedTags((prev) => //עדכון מערך מזהי התגיות שנבחרו
      prev.includes(tagId) ? //בדיקה אם התגית נבחרה
        prev.filter((id) => id !== tagId) // אם כן מוריד אותה מהרשימה
        : [...prev, tagId] //אם לא מוסיף אותה
    );
  };

  // הפעלת הפונקציה הוספת רשימת תיוגים לרשימת מוצרים
  const handleApplyTags = async () => {
    // אם אין תיוגים או אין מוצרים
    if (selectedTags.length === 0 || products.length === 0) {
      alert("אין תיוגים או מוצרים לביצוע הפעולה");
      return;
    }
    // יוצר מערך שמכיל את קודי המוצרים שנבחרו
    const items = products.map((product) => ({
      itemCode: product.itemCode,
    }));

    // יותר מערך שמכיל את קודי הקטגוריות לפי הפורמט שהפונקציה מצפה לקבל
    const tagsToSend = selectedTags.map((id) => ({
      tagId: id,
    }));

    console.log("🟢 בקשה נשלחת עם הנתונים הבאים:", {
      tags: tagsToSend,
      items,
    });

    try {
      const res = await axios.post(
        "http://localhost:3001/api/tag/addtags-to-items",
        { tags: tagsToSend, items }
      );

      alert("תיוגים נוספו בהצלחה");
      console.log("✅ תגובה מהשרת:", res.data);

      setSelectedTags([]);
    } catch (error) {
      console.error("❌ שגיאה מהשרת:", error);
      alert("שגיאה בהוספת תיוגים למוצרים");
    }
  };


  // ביציאה משדה תיוג חדש - לפתוח אישור
  const handleAddTagOnBlur = () => {
    const trimmed = newTagLabel.trim();
    if (!trimmed || tags.some((tag) => tag.tagName === trimmed)) {
      setNewTagLabel("");
      return;
    }
    setPendingTag(trimmed);
    setShowConfirm(true);
  };

  // אישור הוספת תיוג חדש
  const handleConfirmAddTag = async () => {
    try {
      const encodedTag = encodeURIComponent(pendingTag);
      const res = await axios.post(`http://localhost:3001/api/tag/addtag/${encodedTag}`);

      const newTag = res.data.tag;
      setTags((prev) => [...prev, newTag]);
      setSelectedTags((prev) => [...prev, newTag.id]);
      setNewTagLabel("");
      setPendingTag("");
      setShowConfirm(false);
      alert("התיוג נוסף")
    } catch (error) {
      console.error(error);
      alert("שגיאה ביצירת תיוג");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* חלונית אישור תיוג חדש */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 30,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            border: "1px solid #1976d2",
            borderRadius: 8,
            padding: 24,
            zIndex: 1000,
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            להוסיף את התיוג "<b>{pendingTag}</b>"?
          </div>
          <button
            onClick={handleConfirmAddTag}
            style={{
              marginRight: 8,
              backgroundColor: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            אישור
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            style={{
              backgroundColor: "#e0e0e0",
              border: "none",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ביטול
          </button>
        </div>
      )}

      {/* שורת הכנסת תיוג חדש */}
      <input
        type="text"
        value={newTagLabel}
        onChange={(e) => setNewTagLabel(e.target.value)}
        placeholder="הוסף תיוג חדש"
        onBlur={handleAddTagOnBlur}
        disabled={showConfirm}
        style={{
          marginBottom: 12,
          padding: "6px 12px",
          borderRadius: 20,
          border: "1px solid #ccc",
          fontSize: 14,
          width: "100%",
          boxSizing: "border-box",
          direction: "rtl",
          textAlign: "right",
        }}
      />

      {/* רשימת התיוגים לבחירה */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
          justifyContent: "flex-end",
        }}
      >
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.tagId);
          return (
            <div
              key={tag.tagId}
              style={{ position: "relative", display: "inline-block" }}
            >
              <button
                onClick={() => handleTagClick(tag.tagId)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 20,
                  border: "none",
                  cursor: "pointer",
                  background: "#f18b00",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 14,
                  boxShadow: isSelected
                    ? "none"
                    : "0 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                {tag.tagName}
              </button>
              {isSelected && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "bold",
                    padding: "2px 5px",
                    borderRadius: "50%",
                    boxShadow: "0 0 2px rgba(0,0,0,0.3)",
                    pointerEvents: "none",
                  }}
                >
                  ✔
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* כפתור הפעלה */}
      <button
        onClick={handleApplyTags}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 20,
          background: "#2e8540",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 16,
          cursor: selectedTags.length === 0 ? "not-allowed" : "pointer",
          opacity: selectedTags.length === 0 ? 0.6 : 1,
          border: "none",
        }}
        disabled={selectedTags.length === 0}
      >
        החל תיוג על {products.length} מוצרים
      </button>
    </div>
  );
};

export default ProductTagger;
