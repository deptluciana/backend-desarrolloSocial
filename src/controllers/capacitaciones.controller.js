import { Capacitacion } from '../models/capacitacion.model.js'

// Crear un nuevo evento
export const createCapacitacion = async (req, res) => {
    const { title, ubicacion, horarios, description } = req.body;

    try {
        const newCapacitacion = await Capacitacion.create({
            title,
            ubicacion,
            horarios,
            description,
        });

        return res.status(201).json({ message: 'Capacitacion creada correctamente', evento: newCapacitacion });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la capacitacion' });
    }
};

// Obtener todos los eventos
export const getAllCapacitaciones = async (req, res) => {
    try {
        const capacitaciones = await Capacitacion.findAll();
        res.json(capacitaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las capacitaciones.', error });
    }
};

// Obtener un evento por ID
export const getCapacitacionById = async (req, res) => {
    const { id } = req.params;

    try {
        const capacitacion = await Capacitacion.findByPk(id);
        if (!capacitacion) {
            return res.status(404).json({ message: 'Capacitacion no encontrada.' });
        }

        res.json(evento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la capacitacion.', error });
    }
};

// Actualizar un evento
export const updateCapacitacion= async (req, res) => {
    const { id } = req.params;
    const { title, ubicacion, horarios, description } = req.body;

    try {
        const capacitacionToUpdate = await Capacitacion.findByPk(id);
        if (!capacitacionToUpdate) {
            return res.status(404).json({ message: 'Evento no encontrado.' });
        }

        capacitacionToUpdate.title = title || capacitacionToUpdate.title;
        capacitacionToUpdate.ubicacion = ubicacion || capacitacionToUpdate.ubicacion;
        capacitacionToUpdate.horarios = horarios || capacitacionToUpdate.horarios;
        capacitacionToUpdate.description = description || capacitacionToUpdate.description;

        await capacitacionToUpdate.save(); // Guardar cambios

        return res.status(200).json({ message: 'Capacitacion actualizada correctamente.', evento: eventoToUpdate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la Capacitacion.' });
    }
};

// Eliminar un evento
export const deleteCapacitacion = async (req, res) => {
    const { id } = req.params;

    try {
        const capacitacionToDelete = await Capacitacion.findByPk(id);
        if (!capacitacionToDelete) {
            return res.status(404).json({ message: 'Capacitacion no encontrada.' });
        }

        await capacitacionToDelete.destroy();

        return res.status(200).json({ message: 'Capacitacion eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar la Capacitacion.' });
    }
};
