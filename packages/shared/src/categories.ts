import { Item } from "./types";

export interface Subcategory {
  name: string;
  items: Item[];
}

export interface Category {
  name: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    name: "פירות וירקות",
    subcategories: [
      { name: "פירות טריים", items: [] },
      { name: "ירקות טריים", items: [] },
      { name: "פירות וירקות קפואים", items: [] },
      { name: "פיצוחים ופירות יבשים", items: [] },
    ]
  },
  {
    name: "בשרים ודגים",
    subcategories: [
      { name: "בשר טרי", items: [] },
      { name: "עוף", items: [] },
      { name: "דגים", items: [] },
      { name: "בשר קפוא", items: [] },
      { name: "נקניקים ונקניקיות", items: [] },
    ]
  },
  {
    name: "מוצרי חלב ומחלבה",
    subcategories: [
      { name: "חלב", items: [] },
      { name: "גבינות", items: [] },
      { name: "יוגורטים", items: [] },
      { name: "שמנת", items: [] },
      { name: "חמאה", items: [] },
      { name: "תחליפי חלב", items: [] },
      { name: "טופו", items: [] },
    ]
  },
  {
    name: "מעדניה",
    subcategories: [
      { name: "סלטים", items: [] },
      { name: "חומוס", items: [] },
      { name: "ממרחים", items: [] },
    ]
  },
  {
    name: "מזון קפוא",
    subcategories: [
      { name: "ירקות קפואים", items: [] },
      { name: "גלידות", items: [] },
      { name: "ארוחות קפואות", items: [] },
      { name: "שניצלים קפואים", items: [] },
    ]
  },
  {
    name: "מאפים ודגנים",
    subcategories: [
      { name: "לחם", items: [] },
      { name: "עוגות", items: [] },
      { name: "עוגיות", items: [] },
      { name: "פסטה", items: [] },
      { name: "אורז", items: [] },
      { name: "קוסקוס", items: [] },
      { name: "קטניות", items: [] },
      { name: "דגני בוקר", items: [] },
      { name: "חטיפי אנרגיה", items: [] },
    ]
  },
  {
    name: "ממתקים וחטיפים",
    subcategories: [
      { name: "שוקולדים", items: [] },
      { name: "חטיפים מלוחים", items: [] },
      { name: "סוכריות", items: [] },
      { name: "קרקרים", items: [] },
    ]
  },
  {
    name: "משקאות",
    subcategories: [
      { name: "מים", items: [] },
      { name: "מיצים", items: [] },
      { name: "שתייה קלה", items: [] },
      { name: "קפה", items: [] },
      { name: "תה", items: [] },
      { name: "משקאות אלכוהוליים", items: [] },
    ]
  },
  {
    name: "תבלינים ורטבים",
    subcategories: [
      { name: "שמן", items: [] },
      { name: "חומץ", items: [] },
      { name: "מיונז", items: [] },
      { name: "קטשופ", items: [] },
      { name: "חרדל", items: [] },
      { name: "תבלינים יבשים", items: [] },
      { name: "רטבים מוכנים", items: [] },
    ]
  },
  {
    name: "מזווה ושימורים",
    subcategories: [
      { name: "קטניות יבשות", items: [] },
      { name: "שימורים רטובים", items: [] },
      { name: "שימורים יבשים", items: [] },
      { name: "שמן קנולה", items: [] },
      { name: "טחינה", items: [] },
    ]
  },
  {
    name: "ניקיון וטואלטיקה",
    subcategories: [
      { name: "אבקות כביסה", items: [] },
      { name: "נוזלי כלים", items: [] },
      { name: "תרסיסים", items: [] },
      { name: "חומרי ניקוי", items: [] },
      { name: "שקיות אשפה", items: [] },
      { name: "נייר טואלט", items: [] },
    ]
  },
  {
    name: "טיפוח אישי",
    subcategories: [
      { name: "שמפו", items: [] },
      { name: "סבון", items: [] },
      { name: "משחת שיניים", items: [] },
      { name: "מגבונים לחים", items: [] },
      { name: "דאודורנט", items: [] },
    ]
  },
  {
    name: "תינוקות",
    subcategories: [
      { name: "חיתולים", items: [] },
      { name: "מזון לתינוקות", items: [] },
      { name: "תמרוקים לתינוקות", items: [] },
    ]
  },
  {
    name: "חיות מחמד",
    subcategories: [
      { name: "אוכל לחיות", items: [] },
      { name: "ציוד לחיות", items: [] },
    ]
  },
  {
    name: "חד פעמי",
    subcategories: [
      { name: "כוסות", items: [] },
      { name: "צלחות", items: [] },
      { name: 'סכו"ם', items: [] },
    ]
  },
  {
    name: "מוצרים בפיקוח",
    subcategories: [
      { name: "מוצרי בסיס מפוקחים", items: [] },
      { name: "תרופות ללא מרשם", items: [] },
    ]
  },
];
