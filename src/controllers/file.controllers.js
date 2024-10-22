import { File } from '../models/file.model.js';
import path from 'path';
import fs from 'fs';

// Controlador para subir archivos
export const uploadFile = async (req, res) => {
    try {
      const { section } = req.body; // Obtener la sección desde el cuerpo de la petición
      const file = req.file; // Archivo subido por multer
  
      if (!file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo' });
      }
  
      // Verificar si el archivo ya existe en la base de datos
      const existingFile = await File.findOne({ where: { filename: file.originalname, section } });
      if (existingFile) {
        return res.status(400).json({ message: 'El archivo ya esta cargado' });
      }
  
      const fileUrl = `/uploads/${file.filename}`; // URL accesible del archivo
  
      // Guardar información del archivo en la base de datos
      const newFile = await File.create({
        filename: file.originalname,
        fileUrl,
        section,
      });
  
      return res.status(201).json({ message: 'Archivo subido correctamente', file: newFile });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al subir el archivo' });
    }
  };
  
// Controlador para obtener archivos por sección
export const getFilesBySection = async (req, res) => {
    const { section } = req.params; // Obtener la sección desde los parámetros de la URL

    try {
        const files = await File.findAll({ where: { section } }); // Buscar archivos por sección
        return res.status(200).json(files);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los archivos' });
    }
};


export const deleteFile = async (req, res) => {
    const { id } = req.params;
    console.log(`Archivo que se intenta eliminar: ${filePath}`);

    try {
      const fileToDelete = await File.findByPk(id);
      if (!fileToDelete) {
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }
  
      // Usa fileUrl para construir la ruta completa del archivo
      const filePath = path.join('uploads', fileToDelete.fileUrl.split('/').pop()); // Extraer el nombre del archivo
      console.log(`Intentando eliminar el archivo: ${filePath}`);
  
      // Eliminar el archivo del sistema de archivos
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al eliminar el archivo del sistema' });
        }
  
        // Eliminar el registro del archivo de la base de datos solo si la eliminación del archivo fue exitosa
        await File.destroy({ where: { id } });
        return res.status(200).json({ message: 'Archivo eliminado correctamente' });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al eliminar el archivo' });
    }
  };
  