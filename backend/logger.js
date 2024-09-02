



export const logger = {

    log(message) {
        console.log(message);
    },

    error(message) {
        console.error(message)
    },

    warn(message) {
        console.warn(message)
    },

    info(message) {
        console.info(message);
    },

    debug(message, meta) {
        console.debug(message, meta ? JSON.stringify(meta) : "");
    }

}