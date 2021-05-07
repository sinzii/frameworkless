/**
 * User need to be authenticated in order for the request to process further
 *
 * @param req
 * @param res
 */
const authenticated = async (req, res) => {
    if (!req?.session?.currentUser) {
        throw new PermissionDeniedError();
    }
}

module.exports = {
    authenticated
}
