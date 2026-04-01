export const FILTERS = [
    { id: 'none', label: 'Normal', css: 'none' },
    { id: 'bw', label: 'B&W', css: 'grayscale(100%)' },
    { id: 'sepia', label: 'Sepia', css: 'sepia(80%)' },
    { id: 'vivid', label: 'Vivid', css: 'saturate(180%)' },
    {
        id: 'warm',
        label: 'Warm',
        css: 'contrast(110%) brightness(105%) sepia(20%)',
    },
    {
        id: 'cool',
        label: 'Cool',
        css: 'contrast(110%) brightness(105%) hue-rotate(20deg)',
    },
];
