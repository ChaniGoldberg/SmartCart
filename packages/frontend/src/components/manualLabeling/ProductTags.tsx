import React, { useState, useEffect } from 'react';
import { Tag } from '@smartcart/shared/src/tag';

interface TagFilterProps {
    tags?: Tag[];
    onTagSelect?: (tagName: string) => void;
}


const TagFilter: React.FC<TagFilterProps> = ({ tags = [], onTagSelect }) => {
    const [tagNames, setTagNames] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>('הכל');

    const loadTags = (providedTags: Tag[] = []) => {
        const tNames = providedTags.map(tag => tag.tagName);

        const updatedTags = [ ...tNames, 'ללא תיוג', 'הכל' ];
        setTagNames(updatedTags);
    };
    useEffect(() => {
        loadTags(tags);
    }, [tags]);

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag);

        if (onTagSelect) {
            onTagSelect(tag);
        }
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '20px'
            }}>
                {tagNames.map((tag, index) => (
                    <button
                        key={index}
                        onClick={() => handleTagClick(tag.tagName)}
                        style={{
                            padding: '8px 16px',

                            backgroundColor: selectedTag === tag.tagName ? '#007bff' : '#f8f9fa',
                            color: selectedTag === tag.tagName ? 'white' : 'black',
                            border: '1px solid #dee2e6',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '14px',
                            fontWeight: selectedTag === tag ? 'bold' : 'normal'
                        }}
                        onMouseOver={(e) => {
                            if (selectedTag !== tag.tagName) {
                                e.currentTarget.style.backgroundColor = '#e9ecef';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedTag !== tag.tagName) {

                                e.currentTarget.style.backgroundColor = '#f8f9fa';

                            }
                        }}
                    >
                        {tag.tagName}
                    </button>
                ))}
            </div>
            {/* הודעה אם אין תגים */}
            {tagNames.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    color: '#6c757d',
                    padding: '20px',
                    fontStyle: 'italic'
                }}>
                    אין תגים להצגה
                </div>
            )}
        </div>
    );
};
export default TagFilter;