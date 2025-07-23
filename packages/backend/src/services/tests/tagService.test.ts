import { tagService } from "../tagService";

const run = async () => {
  try {
    const tagName = 'מבצע קיץ'; // שימי כאן את השם לבדיקה
    const tag = await tagService.addTag(tagName);
    console.log('✅ תגית נוספה (או כבר קיימת):', tag);
  } catch (error) {
    console.error('❌ שגיאה בהוספת תגית:', error);
  }
};
run();