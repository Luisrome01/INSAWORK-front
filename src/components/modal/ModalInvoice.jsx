import React, { useState, useEffect } from "react";
import "./css/ModalInvoice.css";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import ModalConfirmDelete from "./ModalConfirmDelete";
import ModalCreateInvoice from "./ModalCreateInvoice";

const ModalInvoice = ({ closeModal }) => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);

  useEffect(() => {
    // Disable scrolling on the body when the modal is open
    document.body.style.overflow = showCreateInvoiceModal ? "hidden" : "auto";

    return () => {
      // Enable scrolling again when the modal is closed
      document.body.style.overflow = "auto";
    };
  }, [showCreateInvoiceModal]);
 
  useEffect(() => {
    const doctorId = JSON.parse(localStorage.getItem("user"))._id;

    fetch(`https://insawork.onrender.com/invoices/${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        const updatedInvoices = data.map((invoice) => ({
          ...invoice,
          fecha: new Date(invoice.fecha).toLocaleDateString(),
        }));
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
      })
      .catch((error) => console.error("Error fetching invoices:", error));
  }, []);

  useEffect(() => {
    const results = invoices.filter(
      (invoice) =>
        invoice.nombre_razon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.patientId &&
          invoice.patientId.cedula.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredInvoices(results);
  }, [searchTerm, invoices]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInvoiceClick = (id) => {
    fetch(`https://insawork.onrender.com/invoice/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Failed to fetch the invoice.");
        }
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch((error) => console.error("Error fetching invoice:", error));
  };

  const handleDeleteClick = (id) => {
    setInvoiceToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    fetch(`https://insawork.onrender.com/invoices/${invoiceToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setInvoices(invoices.filter((invoice) => invoice._id !== invoiceToDelete));
          setFilteredInvoices(
            filteredInvoices.filter((invoice) => invoice._id !== invoiceToDelete)
          );
          setShowConfirmDelete(false);
        } else {
          throw new Error("Failed to delete the invoice.");
        }
      })
      .catch((error) => console.error("Error deleting invoice:", error));
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleCreateInvoiceClick = () => {
    setShowCreateInvoiceModal(true);
  };

  const handleCloseCreateInvoiceModal = () => {
    setShowCreateInvoiceModal(false);
  };

  return (
    <div className="modalInvoiceContainer">
      <div className="modalInvoiceBackgroundBlur" onClick={() => closeModal()}></div>
      <div className="modalInvoiceContent">
        <div className="invoiceHeader">
          <h2 className="createMedicineModalTitle">Facturas</h2>
          <button className="usuarioCloseButton"  onClick={() => closeModal()}>
            <FaTimes />
          </button>
        </div>
        <div className="invoiceBody">
          <div className="modalBodyContainer">
            <div className="modalSearchContainer">
              <input
                type="text"
                className="searchInput"
                placeholder="Buscar por razón social o cédula..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="createInvoiceButton" onClick={handleCreateInvoiceClick}>
                Crear Factura
              </button>
            </div>
            <div className="invoiceList">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <div key={invoice._id} className="invoiceItem">
                    <div className="invoiceContent" onClick={() => handleInvoiceClick(invoice._id)}>
                      <div className="invoiceInfo">
                        <p>
                          <strong>Razón Social:</strong> {invoice.nombre_razon}
                        </p>
                        <p className="name">
                          <strong>Nombre:</strong>{" "}
                          {invoice.patientId ? invoice.patientId.name : "N/A"}
                          <strong> </strong>{" "}
                          {invoice.patientId ? invoice.patientId.lastname : "N/A"}
                        </p>
                        <p>
                          <strong>Cédula:</strong>{" "}
                          {invoice.patientId ? invoice.patientId.cedula : "N/A"}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {invoice.fecha}
                        </p>
                        <p>
                          <strong>Total:</strong> {invoice.total ? `$${invoice.total}` : "N/A"}
                        </p>
                      </div>
                      <FaTrashAlt
                        className="deleteIconn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(invoice._id);
                        }}
                      />
                    </div>
                    <hr className="itemSeparator" />
                  </div>
                ))
              ) : (
                <p>No se encontraron facturas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showConfirmDelete && (
        <ModalConfirmDelete onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
      )}
      {showCreateInvoiceModal && <ModalCreateInvoice closeModal={handleCloseCreateInvoiceModal} />}
    </div>
  );
};

export default ModalInvoice;
