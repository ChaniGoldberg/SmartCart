

import { Item } from "@smartcart/shared";
import { Tag } from "@smartcart/shared";
import React, { useState } from "react";


interface ProductTaggerProps {
  items: Item[];
  tags: Tag[];
  onTagChange?: (itemCode: string, tags: Tag[]) => void;
}

const ProductTagger: React.FC<ProductTaggerProps> = ({ items, tags: initialTags, onTagChange }) => {
  const [productTags, setProductTags] = useState<Record<string, number[]>>(
    () =>
      Object.fromEntries(
        items.map((item) => [item.itemCode, []])
      )
  );
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [newTagLabel, setNewTagLabel] = useState<string>("");
  const [pendingTag, setPendingTag] = useState<string>(""); // תיוג שממתין לאישור
  const [showConfirm, setShowConfirm] = useState<boolean>(false); // האם להציג את הפופאפ

  // בוחר/מסיר תיוג מהבחירה
  const handleTagClick = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // שיוך התיוגים שנבחרו לכל המוצרים
  const handleApplyTags = () => {
    const newProductTags = { ...productTags };
    items.forEach((item) => {
      const current = new Set(newProductTags[item.itemCode] || []);
      selectedTags.forEach((tagId) => current.add(tagId));
      newProductTags[item.itemCode] = Array.from(current);
      if (onTagChange) {
        onTagChange(
          item.itemCode,
          tags.filter((tag) => newProductTags[item.itemCode].includes(tag.tagId))
        );
      }
    });
    setProductTags(newProductTags);
    setSelectedTags([]);
  };

  // ביציאה מהשדה - פותח חלונית אישור אם יש ערך
  const handleAddTagOnBlur = () => {
    const trimmed = newTagLabel.trim();
    if (!trimmed) return;
    if (tags.some((tag) => tag.tagName === trimmed)) {
      setNewTagLabel("");
      return;
    }
    setPendingTag(trimmed);
    setShowConfirm(true);
  };

  // אישור הוספת תיוג
  const handleConfirmAddTag = () => {
    const newTag: Tag = {
      tagId: tags.length > 0 ? Math.max(...tags.map((t) => t.tagId)) + 1 : 1,
      tagName: pendingTag,
      dateAdded: new Date(),
      isAlreadyScanned:false
    };
    setTags([...tags, newTag]);
    setNewTagLabel("");
    setPendingTag("");
    setShowConfirm(false);
  };

  // ביטול הוספת תיוג
  const handleCancelAddTag = () => {
    setNewTagLabel("");
    setPendingTag("");
    setShowConfirm(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* חלונית אישור הוספת תיוג */}
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
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: 24,
            zIndex: 1000,
            minWidth: 260,
            textAlign: "center",
            color: "#222",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            להוסיף את התיוג "<b>{pendingTag}</b>" לרשימת התיוגים?
          </div>
          <button
            onClick={handleConfirmAddTag}
            style={{
              marginRight: 8,
              padding: "6px 16px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            אישור
          </button>
          <button
            onClick={handleCancelAddTag}
            style={{
              padding: "6px 16px",
              background: "#e0e0e0",
              color: "#333",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ביטול
          </button>
        </div>
      )}

      {/* כותרת */}
      <div style={{ marginBottom: 16, fontWeight: "bold" }}>בחר תיוגים להוספה לכל המוצרים:</div>
      {/* הוספת תיוג חדש */}
      <input
        type="text"
        value={newTagLabel}
        onChange={(e) => setNewTagLabel(e.target.value)}
        placeholder="הוסף תיוג חדש"
        onBlur={handleAddTagOnBlur}
        style={{
          marginBottom: 12,
          marginLeft: 0,
          marginRight: 8,
          padding: "6px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
        disabled={showConfirm}
      />
      {/* רשימת התיוגים לבחירה */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {tags.map((tag) => (
          <button
            key={tag.tagId}
            type="button"
            onClick={() => handleTagClick(tag.tagId)}
            style={{
              padding: "6px 16px",
              borderRadius: "16px",
              border: "none",
              cursor: "pointer",
              background: selectedTags.includes(tag.tagId) ? "#1976d2" : "#e0e0e0",
              color: selectedTags.includes(tag.tagId) ? "#fff" : "#333",
              fontWeight: selectedTags.includes(tag.tagId) ? "bold" : "normal",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {tag.tagName}
          </button>
        ))}
      </div>
      {/* כפתור להוספת התיוגים שנבחרו לכל המוצרים */}
      <button
        type="button"
        onClick={handleApplyTags}
        style={{
          padding: "8px 24px",
          borderRadius: "16px",
          border: "none",
          background: "#1976d2",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: 24,
        }}
        disabled={selectedTags.length === 0}
      >
        החל תיוג על {items.length} מוצרים
      </button>
    
    </div>
  );
};

export default ProductTagger;


