class StringUtils {
    static capitalize(str) {
        if (!str || typeof str !== 'string') {
            return '';
        }

        return str.charAt(0).toUpperCase() + str.substring(1);
    }
}

module.exports = StringUtils;
