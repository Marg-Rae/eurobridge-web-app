import { useState } from "react";
import api from "../api/axios.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setIsSubmitting(true);
      await api.post("/api/contact", form);
      setSuccess("Thanks! We will reach out within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError("Unable to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page">
      <h1>Contact</h1>
      <p>Tell us about your goals and we will match you with a program.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone (optional)
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </form>
      {isSubmitting && <Loading label="Submitting" />}
      {error && <ErrorMessage message={error} />}
      {success && <div className="status success">{success}</div>}
    </section>
  );
};

export default Contact;
