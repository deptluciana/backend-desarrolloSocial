import { Info } from '../models/info.model.js';

// Crear nueva información
export const createInfo = async (req, res) => {
    const { title, description, section } = req.body;

    try {
        const newInfo = await Info.create({
            title,
            description,
            section,
        });

        return res.status(201).json({ message: 'Panel creado correctamente', info: newInfo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el panel' });
    }
};

// Obtener toda la información de una sección específica
export const getInfoBySection = async (req, res) => {
    const { section } = req.params;

    try {
        const info = await Info.findAll({
            where: { section },
        });

        res.json(info); // Retornar todos los paneles de la sección
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la información.', error });
    }
};

export const updateInfo = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const infoToUpdate = await Info.findByPk(id);
        if (!infoToUpdate) {
            return res.status(404).json({ message: 'Panel no encontrado.' });
        }

        infoToUpdate.title = title || infoToUpdate.title;
        infoToUpdate.description = description || infoToUpdate.description;

        await infoToUpdate.save(); // Guardar los cambios

        return res.status(200).json({ message: 'Panel actualizado correctamente.', info: infoToUpdate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el panel.' });
    }
};

// Eliminar un panel completo
export const deleteInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const infoToDelete = await Info.findByPk(id);
        if (!infoToDelete) {
            return res.status(404).json({ message: 'Información no encontrada.' });
        }

        await infoToDelete.destroy();

        return res.status(200).json({ message: 'Panel eliminado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el panel.' });
    }
};
