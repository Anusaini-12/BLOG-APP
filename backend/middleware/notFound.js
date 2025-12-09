const notFound = (req, res, next) =>{
    const error = new Error("NOT FOUND!");
    error.status = 404;
    return next(error);
}
export default notFound;