import React, { useState, useEffect } from "react";
import "./css/ModalNotas.css";
import InputGeneral from "../inputs/InputGeneral"; 
import ModalConfirmDelete from "./ModalConfirmDelete"; 

const ModalNotas = ({ doctorId, onClose }) => { // Cambia closeModal por onClose
    const [notes, setNotes] = useState([]);
    const [newNoteContent, setNewNoteContent] = useState("Nueva Nota");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`http://localhost:3000/user/note/${doctorId}`);
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const handleCreateNote = async () => {
        const newNote = { doctorId, content: newNoteContent };
        try {
            const response = await fetch("http://localhost:3000/user/note", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newNote),
            });
            if (response.ok) {
                fetchNotes();
                setNewNoteContent("Nueva Nota");
            }
        } catch (error) {
            console.error("Error creating note:", error);
        }
    };

    const handleEditNote = async (noteId) => {
        const updatedNote = { content: newNoteContent };
        try {
            const response = await fetch(`http://localhost:3000/user/note/${noteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedNote),
            });
            if (response.ok) {
                fetchNotes();
                setEditingNoteId(null);
            }
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await fetch(`http://localhost:3000/user/note/${noteId}`, {
                method: "DELETE",
            });
            fetchNotes();
            setConfirmDeleteId(null);
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return (
        <div className="modalNotasContainer">
            <div className="modalNotasBackgroundBlur"></div>
            <div className="modalNotasContent">
                <h2>Notas</h2>
                <div className="noteInputContainer">
                    <InputGeneral
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Nueva Nota"
                    />
                    <button onClick={handleCreateNote}>Crear Nota</button>
                </div>
                <div className="notesList">
                    {notes.map((note) => (
                        <div key={note._id} className="noteCard">
                            {editingNoteId === note._id ? (
                                <div>
                                    <InputGeneral
                                        value={newNoteContent}
                                        onChange={(e) => setNewNoteContent(e.target.value)}
                                    />
                                    <button onClick={() => handleEditNote(note._id)}>Guardar</button>
                                </div>
                            ) : (
                                <div className="noteContent">
                                    <p>{note.content}</p>
                                    <div className="noteActions">
                                        <button onClick={() => { setEditingNoteId(note._id); setNewNoteContent(note.content); }}>Editar</button>
                                        <button onClick={() => setConfirmDeleteId(note._id)}>🗑️</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {confirmDeleteId && (
                    <ModalConfirmDelete
                        onConfirm={() => handleDeleteNote(confirmDeleteId)}
                        onCancel={() => setConfirmDeleteId(null)}
                    />
                )}
                <button onClick={onClose}>Cerrar</button> {/* Usa onClose aquí */}
            </div>
        </div>
    );
};

export default ModalNotas;
