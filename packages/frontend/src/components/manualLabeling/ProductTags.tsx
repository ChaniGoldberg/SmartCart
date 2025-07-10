import React, { useState, useEffect } from 'react';
import { Tag } from '@smartcart/shared/src/tag';

interface TagFilterProps {
    search?: string;
    onTagSelect?: (tagName: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ search, onTagSelect }) => {
    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string>('הכל');

    const loadTags = async (searchText: string = 'חלב') => {
        setIsLoading(true);
        setError(null);

        try {

            const url = `http://localhost:3001/api/search/textTag/${encodeURIComponent(searchText)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`שגיאה בשרת: ${response.status}`);
            }

            const retrievedTags: Tag[] = await response.json();

            // המרה לשמות תגים
            const tagNames = retrievedTags?.map(tag => tag.tagName) || [];

            // הוספת תגים מיוחדים
            const updatedTags = [ ...tagNames,'ללא תיוג', 'הכל' ];
            setTags(updatedTags);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'שגיאה בחיבור לשרת');
            console.error('Error loading tags:', err);

            setTags(['ללא תיוג', 'הכל']);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTags(search || '');
    }, [search]);

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag);
        console.log(`Filtering products by tag: ${tag}`);

        if (onTagSelect) {
            onTagSelect(tag);
        }
    };

    return (
        <div>
            {error && (
                <div style={{
                    color: 'red',
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    borderRadius: '5px'
                }}>
                    {error}
                </div>
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '20px'
            }}>
                {tags.map((tag, index) => (
                    <button
                        key={index}
                        onClick={() => handleTagClick(tag)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: selectedTag === tag ? '#007bff' : '#f8f9fa',
                            color: selectedTag === tag ? 'white' : 'black',
                            border: '1px solid #dee2e6',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            if (selectedTag !== tag) {
                                e.currentTarget.style.backgroundColor = '#e9ecef';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedTag !== tag) {
                                e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TagFilter;