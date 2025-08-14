import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ editingTask, setEditingTask, setTasks }) => {
  const [form, setForm] = useState({
    complainantName: '',
    email: '',
    phoneNumber: '',
    title: '',
    description: '',
    category: 'Low',
    assignedTo: ''
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        complainantName: editingTask.complainantName || '',
        email: editingTask.email || '',
        phoneNumber: editingTask.phoneNumber || '',
        title: editingTask.title || '',
        description: editingTask.description || '',
        category: editingTask.category || 'Low',
        assignedTo: editingTask.assignedTo || ''
      });
    } else {
      setForm({
        complainantName: '',
        email: '',
        phoneNumber: '',
        title: '',
        description: '',
        category: 'Low',
        assignedTo: ''
      });
    }
  }, [editingTask]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const { data } = await axiosInstance.patch(`/api/complaints/${editingTask._id}`, form);
        setTasks(prev => prev.map(t => (t._id === data._id ? data : t)));
        setEditingTask(null);
      } else {
        const { data } = await axiosInstance.post('/api/complaints', {
          ...form,
          status: 'Open'
        });
        setTasks(prev => [data, ...prev]);
      }

      setForm({
        complainantName: '',
        email: '',
        phoneNumber: '',
        title: '',
        description: '',
        category: 'Low',
        assignedTo: ''
      });
    } catch (err) {
      alert('Save failed.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded mb-8">
      <input name="complainantName" value={form.complainantName} onChange={handleChange} placeholder="Complainant Name" required className="w-full p-2 border mb-2" />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border mb-2" />
      <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className="w-full p-2 border mb-2" />
      <input name="title" value={form.title} onChange={handleChange} placeholder="Complaint Title" required className="w-full p-2 border mb-2" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border mb-2" rows={3} />
      <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 border mb-2">
        <option value="Low">Low</option>
        <option value="Moderate">Moderate</option>
        <option value="High">High</option>
      </select>
      <input name="assignedTo" value={form.assignedTo} onChange={handleChange} placeholder="Assigned To" required className="w-full p-2 border mb-2" />

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        {editingTask ? 'Update Complaint' : 'Add Complaint'}
      </button>
    </form>
  );
};

export default TaskForm;