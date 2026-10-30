import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "./api";

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong."
  );
}

function ProtectedRoute({ children }) {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/auth" replace />;
}

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || password.length < 8) {
      setError("Enter a valid email and a password with at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      const path = mode === "login"
        ? "/api/auth/login"
        : "/api/auth/register";

      const response = await api.post(path, {
        email: email.trim(),
        password,
      });

      if (mode === "register") {
        setMode("login");
        setError("Account created. Please sign in.");
      } else {
        const token = response.data?.token;
        if (!token) throw new Error("The login response did not contain a token.");

        localStorage.setItem("token", token);
        navigate("/");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-box">
      <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
      <p>Sign in to browse and register for college events.</p>

      <form onSubmit={submit} className="form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>

        {error && <p className="message">{error}</p>}

        <button disabled={busy}>
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <button
        className="text-button"
        onClick={() => {
          setError("");
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </button>
    </main>
  );
}

function Header() {
  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem("token");
    navigate("/auth");
  }

  return (
    <header className="header">
      <Link to="/" className="brand">Campus Events</Link>
      <button className="secondary-button" onClick={signOut}>Sign out</button>
    </header>
  );
}
function formatDate(value) {
  if (!value) return "Date not provided";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "Time not provided";

  // Handles values such as "09:00:00" or "09:00".
  const [hours, minutes] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/events")
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("Expected the events API to return a JSON array.");
        }
        setEvents(response.data);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="page">
        <h1>College Events</h1>
        <p>Choose an event to view details and register.</p>

        {loading && <p>Loading events…</p>}
        {error && (
          <div className="error-box">
            <strong>Could not load events.</strong>
            <p>{error}</p>
            <p>Check that the Event Service is running and that the Gateway has a GET /api/events route.</p>
          </div>
        )}

        {!loading && !error && events.length !== 3 && (
          <p className="message">
            The Event Service returned {events.length} event(s). It must return
            the three events you want displayed.
          </p>
        )}

        <section className="event-grid">
          {events.map((event) => (
            
          <article className="event-card" key={event.id}>
  <h2>{event.title}</h2>

  <p>
    <strong>Event Date:</strong>{" "}
    {formatDate(event.eventDate ?? event.date)}
  </p>

  <p>
    <strong>Event Timings:</strong>{" "}
    {formatTime(event.startTime)} – {formatTime(event.endTime)}
  </p>

  
    <p>
      <strong>Venue:</strong> {event.venue || "Not provided"}
    </p>

  

  <p>
    <strong>Capacity:</strong> {event.capacity} students
  </p>

  <Link className="button-link" to={`/events/${event.id}`}>
    View Details
  </Link>

  <Link className="button-link book-link" to={`/events/${event.id}`}>
    Book Now
  </Link>
</article>

          ))}
        </section>
      </main>
    </>
  );
}

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === "{id}") {
      setError("The event URL does not contain a real event ID.");
      setLoading(false);
      return;
    }

    api.get(`/api/events/${encodeURIComponent(id)}`)
      .then((response) => setEvent(response.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Header /><main className="page">Loading event…</main></>;
  if (error) return <><Header /><main className="page error-box">{error}</main></>;
  if (!event) return null;

  const full =
    Number(event.registeredCount) >= Number(event.capacity);

  return (
    <>
      <Header />
      <main className="page narrow">
        <Link to="/">← Back to events</Link>
        <h1>{event.title}</h1>
        <p><strong>Event Date:</strong> {formatDate(event.date)}</p>
<p>
  <strong>Event Timings:</strong>{" "}
  {formatTime(event.startTime)} – {formatTime(event.endTime)}
</p>
<p><strong>Venue:</strong> {event.venue}</p>

       

        {full ? (
          <p className="closed">
            Registration Closed — Event Capacity Reached.
          </p>
        ) : (
          <Link className="button-link book-link" to={`/events/${event.id}/register`}>
            Book Now
          </Link>
        )}
      </main>
    </>
  );
}

function StudentRegistrationPage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    studentName: "",
    collegeName: "",
    registerNumber: "",
    department: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    const cleaned = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()])
    );

    if (Object.values(cleaned).some((value) => !value)) {
      setError("Please complete every field.");
      return;
    }

    if (!/^[A-Za-z][A-Za-z .'-]{1,79}$/.test(cleaned.studentName)) {
      setError("Enter a valid student name.");
      return;
    }

    if (!/^[A-Za-z0-9/-]{2,30}$/.test(cleaned.registerNumber)) {
      setError("Register Number may contain letters, numbers, / or -.");
      return;
    }

    if (!["1", "2", "3", "4"].includes(cleaned.year)) {
      setError("Select a valid year.");
      return;
    }

    setBusy(true);
    try {
      const response = await api.post("/api/registrations/register", {
        ...cleaned,
        eventId: id,
        year: Number(cleaned.year),
      });

      // Do not show a success page unless the backend confirms a ticket ID.
      const ticket = response.data;
      if (!ticket?.ticketId) {
        throw new Error(
          "Registration response did not contain ticketId. Check the backend response."
        );
      }

      navigate("/confirmation", { state: { ticket } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <main className="page narrow">
        <h1>Student Registration</h1>
        <form className="form" onSubmit={submit}>
          <label>Student Name
            <input name="studentName" value={form.studentName} onChange={update} required />
          </label>
          <label>College Name
            <input name="collegeName" value={form.collegeName} onChange={update} required />
          </label>
          <label>Register Number
            <input name="registerNumber" value={form.registerNumber} onChange={update} required />
          </label>
          <label>Department
            <input name="department" value={form.department} onChange={update} required />
          </label>
          <label>Year
            <select name="year" value={form.year} onChange={update} required>
              <option value="">Select year</option>
              {[1, 2, 3, 4].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>

          {error && <p className="error-text">{error}</p>}
          <button disabled={busy}>
            {busy ? "Submitting…" : "Register Now"}
          </button>
        </form>
      </main>
    </>
  );
}

function ConfirmationPage() {
  const { state } = useLocation();
  const ticket = state?.ticket;

  if (!ticket) return <Navigate to="/" replace />;

  return (
    <>
      <Header />
      <main className="page narrow confirmation">
        <h1>Registration Successful!</h1>
        <p><strong>Student Name:</strong> {ticket.studentName}</p>
        <p><strong>Event Title:</strong> {ticket.eventTitle}</p>
        <p>
    <strong>Unique Ticket ID:</strong>
    {ticket.ticketCode || ticket.ticketId}
</p>
        <p><strong>Registration Status:</strong> {ticket.status}</p>
        <Link className="button-link" to="/">Return to events</Link>
      </main>
    </>
  );
}



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
        <Route path="/events/:id/register" element={<ProtectedRoute><StudentRegistrationPage /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
