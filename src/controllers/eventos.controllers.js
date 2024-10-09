import { Evento } from '../models/eventos.model.js'

// Crear un nuevo evento
export const createEvento = async (req, res) => {
    const { title, ubicacion, horarios, description } = req.body;

    try {
        const newEvento = await Evento.create({
            title,
            ubicacion,
            horarios,
            description,
        });

        return res.status(201).json({ message: 'Evento creado correctamente', evento: newEvento });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el evento' });
    }
};

// Obtener todos los eventos
export const getAllEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los eventos.', error });
    }
};

// Obtener un evento por ID
export const getEventoById = async (req, res) => {
    const { id } = req.params;

    try {
        const evento = await Evento.findByPk(id);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado.' });
        }

        res.json(evento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el evento.', error });
    }
};

// Actualizar un evento
export const updateEvento = async (req, res) => {
    const { id } = req.params;
    const { title, ubicacion, horarios, description } = req.body;

    try {
        const eventoToUpdate = await Evento.findByPk(id);
        if (!eventoToUpdate) {
            return res.status(404).json({ message: 'Evento no encontrado.' });
        }

        eventoToUpdate.title = title || eventoToUpdate.title;
        eventoToUpdate.ubicacion = ubicacion || eventoToUpdate.ubicacion;
        eventoToUpdate.horarios = horarios || eventoToUpdate.horarios;
        eventoToUpdate.description = description || eventoToUpdate.description;

        await eventoToUpdate.save(); // Guardar cambios

        return res.status(200).json({ message: 'Evento actualizado correctamente.', evento: eventoToUpdate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el evento.' });
    }
};

// Eliminar un evento
export const deleteEvento = async (req, res) => {
    const { id } = req.params;

    try {
        const eventoToDelete = await Evento.findByPk(id);
        if (!eventoToDelete) {
            return res.status(404).json({ message: 'Evento no encontrado.' });
        }

        await eventoToDelete.destroy();

        return res.status(200).json({ message: 'Evento eliminado correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el evento.' });
    }
};
