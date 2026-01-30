// CSS Test Calculator - Configuration Constants

var CSS_CONSTANTS = {
    // Time limits in seconds
    limits: {
        time200: {
            min: 100,   // 1:40 - below would be world record
            max: 360    // 6:00
        },
        time400: {
            min: 210,   // 3:30 - below would be world record
            max: 720    // 12:00
        }
    }
};

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSS_CONSTANTS;
}
