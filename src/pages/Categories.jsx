import React, { useEffect, useState, useRef } from 'react';
import * as categoryService from '../services/CategoryService';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const originalRef = useRef(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        setLoading(true);
        setError('');
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    }

    function normalizeName(name) {
        return (name || '').trim().toLowerCase();
    }

    function isDuplicate(name, excludeId = null) {
        const n = normalizeName(name);
        return categories.some(c => c.id !== excludeId && normalizeName(c.name) === n);
    }

    async function handleAdd(e) {
        e && e.preventDefault();
        setError('');
        const name = newName.trim();
        if (!name) return setError('Category name is required');
        if (isDuplicate(name)) return setError('Category already exists');

        // optimistic add
        const tempId = `temp-${Date.now()}`;
        const temp = { id: tempId, name };
        setCategories(prev => [temp, ...prev]);
        setAdding(true);
        setNewName('');
        try {
            const created = await categoryService.addCategory(name);
            setCategories(prev => prev.map(c => (c.id === tempId ? created : c)));
        } catch (err) {
            // rollback
            setCategories(prev => prev.filter(c => c.id !== tempId));
            setError(err.message || 'Failed to add category');
        } finally {
            setAdding(false);
        }
    }

    function startEdit(cat) {
        originalRef.current = cat.name;
        setEditingId(cat.id);
        setEditingName(cat.name);
        setError('');
    }

    function cancelEdit() {
        setEditingId(null);
        setEditingName('');
        originalRef.current = null;
    }

    async function saveEdit(id) {
        const name = editingName.trim();
        if (!name) return setError('Category name is required');
        if (isDuplicate(name, id)) return setError('Category already exists');

        const prev = categories;
        // optimistic update
        setCategories(prev => prev.map(c => (c.id === id ? { ...c, name } : c)));
        setEditingId(null);
        setEditingName('');
        setError('');
        try {
            await categoryService.updateCategory(id, name);
        } catch (err) {
            // rollback
            setCategories(prev);
            setError(err.message || 'Failed to update category');
        }
    }

    async function handleDelete(id) {
        setError('');
        const backup = categories;
        // optimistic remove
        setCategories(prev => prev.filter(c => c.id !== id));
        try {
            await categoryService.deleteCategory(id);
        } catch (err) {
            setCategories(backup);
            setError(err.message || 'Failed to delete category');
        }
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Categories</h4>
            </div>

            <form className="mb-3 d-flex" onSubmit={handleAdd}>
                <input
                    className="form-control me-2"
                    placeholder="New category name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    aria-label="New category name"
                />
                <button className="btn btn-primary" type="submit" disabled={adding}>
                    {adding ? 'Adding...' : 'Add'}
                </button>
            </form>

            {error && <div className="alert alert-danger py-1">{error}</div>}

            {loading ? (
                <div>Loading categories...</div>
            ) : (
                <div className="list-group">
                    {categories.length === 0 && <div className="text-muted">No categories yet.</div>}
                    {categories.map(cat => (
                        <div key={cat.id} className="list-group-item d-flex align-items-center justify-content-between">
                            <div className="flex-grow-1">
                                {editingId === cat.id ? (
                                    <input
                                        className="form-control"
                                        value={editingName}
                                        onChange={e => setEditingName(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') saveEdit(cat.id);
                                            if (e.key === 'Escape') cancelEdit();
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span>{cat.name}</span>
                                )}
                            </div>

                            <div className="ms-3">
                                {editingId === cat.id ? (
                                    <>
                                        <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(cat.id)}>
                                            Save
                                        </button>
                                        <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(cat)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;

