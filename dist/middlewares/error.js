export const errorMiddleware = (err, req, res, next) => {
    return res.status(400).json({
        success: true,
        message: "some erroer",
    });
};
