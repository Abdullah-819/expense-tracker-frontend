import { useEffect, useState } from "react";
import api from "../api/axios";

const ExpenseForm = ({ onAdd, editingExpense, clearEdit }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
  });

  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(editingExpense?._id);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.amount <= 0) {
      return alert("Amount must be greater than 0");
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
      };

      if (isEdit) {
        await api.put(`/expenses/${editingExpense._id}`, payload);
        clearEdit();
      } else {
        await api.post("/expenses", payload);
      }

      setForm({ title: "", amount: "", category: "Food" });
      onAdd();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? "Edit Expense" : "Add Expense"}</h3>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        autoFocus
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <select name="category" value={form.category} onChange={handleChange}>
        <option>Food</option>
        <option>Travel</option>
        <option>Bills</option>
        <option>Shopping</option>
        <option>Other</option>
      </select>

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Add"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={() => {
              clearEdit();
              setForm({ title: "", amount: "", category: "Food" });
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
