import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import "./css/ModalNotas.css";
import InputGeneral from "../inputs/InputGeneral";
import ModalConfirmDelete from "./ModalConfirmDelete";

const ModalNotas = ({ doctorId, onClose }) => {
    const [notes, setNotes] = useState([]);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNoteContent, setEditingNoteContent] = useState("");
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
                setNewNoteContent("");
            }
        } catch (error) {
            console.error("Error creating note:", error);
        }
    };

    const handleEditNote = async (noteId) => {
        const updatedNote = { content: editingNoteContent };
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
                setEditingNoteContent("");
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
        <div className="modal-notes-overlay">
    <div className="modal-notes-container">
        <div className="modal-notes-header">
            <h2 className="modal-notes-title">Notas</h2>
            <button className="modal-notes-close-button" onClick={onClose}>X</button>
        </div>
        <div className="modal-notes-body">
            <div className="note-input-container">
                <div className="input-wrapper" style={{ flexGrow: 1 }}>
                    <InputGeneral
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Escribe una nota..."
                        className="modal-notes-input-field new-note-input-field"
                    />
                </div>
                <button className="modal-notes-create-button" onClick={handleCreateNote}>Crear Nota</button>
            </div>
            <div className="notes-list">
                {notes.map((note) => (
                    <div key={note._id} className="note-card">
                        {editingNoteId === note._id ? (
                            <div className="note-edit-container">
                                <InputGeneral
                                    value={editingNoteContent}
                                    onChange={(e) => setEditingNoteContent(e.target.value)}
                                    className="modal-notes-input-field edit-note-input-field"
                                />
                                <button className="modal-notes-save-button" onClick={() => handleEditNote(note._id)}>Guardar</button>
                            </div>
                        ) : (
                            <div className="note-content">
                                <p>{note.content}</p>
                                <div className="note-actions">
                                    <button className="modal-notes-edit-button" onClick={() => { setEditingNoteId(note._id); setEditingNoteContent(note.content); }}>Editar</button>
                                    <button className="modal-notes-delete-button" onClick={() => setConfirmDeleteId(note._id)}><FaTrashAlt /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        {confirmDeleteId && (
            <ModalConfirmDelete
                onConfirm={() => handleDeleteNote(confirmDeleteId)}
                onCancel={() => setConfirmDeleteId(null)}
            />
        )}
    </div>
</div>

    );
};

export default ModalNotas;
