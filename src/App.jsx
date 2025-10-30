import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketId, setTicketId] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5;

  // ✅ URL base (mejor práctica: usar import.meta.env)
  const API_BASE =
    "http://api-rest-helpdesk-fqaff3axb8e0deep.canadacentral-01.azurewebsites.net";

  // 🔹 Traer todos los tickets paginados
  const fetchAllTickets = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/ticket/page?page=${pageNumber}&size=${size}`
      );
      if (!response.ok) throw new Error("Error al obtener tickets");
      const data = await response.json();
      setTickets(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al obtener tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Buscar ticket por ID
  const buscarTicket = async () => {
    if (!ticketId) {
      fetchAllTickets();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/ticket/${ticketId}`);
      if (!response.ok) throw new Error("Ticket no encontrado");
      const data = await response.json();
      setTickets([data]);
    } catch (error) {
      console.error(error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar al iniciar
  useEffect(() => {
    fetchAllTickets();
  }, []);

  if (loading) return <h2>Cargando tickets...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Tickets</h1>

      <div className="search-bar">
        <input
          type="number"
          placeholder="Ingrese ID de ticket"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          className="search-input"
        />
        <button onClick={buscarTicket} className="search-button">
          Buscar
        </button>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Categoría</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Usuario</th>
            <th>Soporte</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
            <th>Fecha de Asignación</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket.idTicket}>
                <td>{ticket.idTicket}</td>
                <td>{ticket.nroTicket}</td>
                <td>{ticket.categoria?.nomCategoria || "Sin categoría"}</td>
                <td>{ticket.tituloTicket}</td>
                <td>{ticket.descTicket}</td>
                <td>{ticket.usuario?.nomUsuario || "Sin usuario"}</td>
                <td>{ticket.soporte?.nomSoporte || "Sin soporte"}</td>
                <td>{ticket.estadoTicket === 1 ? "Activo" : "Inactivo"}</td>
                <td>
                  {ticket.fechaCreacionTicket
                    ? new Date(ticket.fechaCreacionTicket).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {ticket.fechaAsignacionTicket
                    ? new Date(ticket.fechaAsignacionTicket).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No se encontraron tickets</td>
            </tr>
          )}
        </tbody>
      </table>

      {!ticketId && (
        <div className="pagination">
          <button
            disabled={page === 0}
            onClick={() => fetchAllTickets(page - 1)}
          >
            ◀ Anterior
          </button>
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <button
            disabled={page + 1 === totalPages}
            onClick={() => fetchAllTickets(page + 1)}
          >
            Siguiente ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
