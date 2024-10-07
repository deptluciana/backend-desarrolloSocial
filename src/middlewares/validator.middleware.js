export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body); // Aquí validamos el cuerpo de la solicitud con el esquema
        next(); // Si pasa la validación, continúa
    } catch (error) {
        return res
            .status(400)
            .json({ message: error.errors.map((error) => error.message) });
    }
};
