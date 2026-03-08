import React, { useEffect, useState } from 'react';
import { addCategory, getCategories, updateCategory, deleteCategory } from '../services/categoryService';

const Categories = () => {
    // List States
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Hover Preview States
    const [hoveredImg, setHoveredImg] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // "Add New" States
    const [newName, setNewName] = useState('');
    const [newImage, setNewImage] = useState('');
    const [adding, setAdding] = useState(false);

    // "Edit" States
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [editingImage, setEditingImage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    // API: Fetch all categories
    async function fetchCategories() {
        setLoading(true);
        setError('');
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    }

    // Helper: Prevent duplicates
    const isDuplicate = (name, excludeId = null) => {
        const normalized = name.trim().toLowerCase();
        return categories.some(c => c.id !== excludeId && c.name.toLowerCase() === normalized);
    };

    // API: Add Category
    async function handleAdd(e) {
        e.preventDefault();
        setError('');
        const name = newName.trim();
        const image = newImage.trim();

        if (!name || !image) return setError('Both Name and Image URL are required');
        if (isDuplicate(name)) return setError('Category already exists');

        setAdding(true);
        try {
            const created = await addCategory({ name, image });
            setCategories(prev => [created, ...prev]);
            setNewName('');
            setNewImage('');
        } catch (err) {
            setError(err.message || 'Failed to add category');
        } finally {
            setAdding(false);
        }
    }

    // Edit Logic
    const startEdit = (cat) => {
        setEditingId(cat.id);
        setEditingName(cat.name);
        setEditingImage(cat.image);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
        setEditingImage('');
    };

    async function saveEdit(id) {
        const name = editingName.trim();
        const image = editingImage.trim();

        if (!name || !image) return setError('Name and Image cannot be empty');
        if (isDuplicate(name, id)) return setError('Category name already exists');

        try {
            await updateCategory(id, { name, image });
            setCategories(prev => prev.map(c => (c.id === id ? { ...c, name, image } : c)));
            cancelEdit();
        } catch (err) {
            setError('Failed to update category');
        }
    }

    // API: Delete Category
    async function handleDelete(id) {
        if (!window.confirm("Delete this category?")) return;
        const backup = [...categories];
        setCategories(prev => prev.filter(c => c.id !== id));
        try {
            await deleteCategory(id);
        } catch (err) {
            setCategories(backup);
            setError('Delete failed');
        }
    }

    // Handle Hover Position
    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX + 20, y: e.clientY + 20 });
    };

    return (
        <div className="container mt-4 position-relative">
            <h4 className="fw-bold mb-4">Categories Dashboard</h4>

            {/* Add Section */}
            <div className="card shadow-sm border-0 mb-4 bg-light">
                <div className="card-body">
                    <form className="row g-3 align-items-end" onSubmit={handleAdd}>
                        <div className="col-md-5">
                            <label className="form-label fw-bold small">Category Name</label>
                            <input className="form-control" value={newName} onChange={e => setNewName(e.target.value)} required />
                        </div>
                        <div className="col-md-5">
                            <label className="form-label fw-bold small">Image URL</label>
                            <input className="form-control" value={newImage} onChange={e => setNewImage(e.target.value)} required />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-primary w-100" type="submit" disabled={adding}>
                                {adding ? '...' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            {/* Floating Image Preview */}
            {hoveredImg && (
                <div 
                    className="position-fixed shadow-lg border rounded bg-white p-1"
                    style={{ 
                        top: mousePos.y, 
                        left: mousePos.x, 
                        zIndex: 10000, 
                        pointerEvents: 'none',
                        width: '200px', 
                        height: '200px'
                    }}
                >
                    <img src={hoveredImg} alt="" className="w-100 h-100 rounded" style={{ objectFit: 'cover' }} />
                </div>
            )}

            {/* Table Section */}
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-center">
                        <thead className="table-light">
                            <tr>
                                <th style={{width: '100px'}}>Image</th>
                                <th>Name</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3">Loading...</td></tr>
                            ) : (
                                categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>
                                            <img 
                                                src={cat.image} 
                                                alt=""
                                                className="rounded border"
                                                style={{ width: '45px', height: '45px', objectFit: 'cover', cursor: 'pointer' }}
                                                onMouseEnter={() => setHoveredImg(cat.image)}
                                                onMouseMove={handleMouseMove}
                                                onMouseLeave={() => setHoveredImg(null)}
                                            />
                                        </td>
                                        <td className="text-start ps-4">
                                            {editingId === cat.id ? (
                                                <div className="d-flex flex-column gap-2">
                                                    <input className="form-control form-control-sm" value={editingName} onChange={e => setEditingName(e.target.value)} />
                                                    <input className="form-control form-control-sm" value={editingImage} onChange={e => setEditingImage(e.target.value)} />
                                                </div>
                                            ) : (
                                                <span className="fw-bold">{cat.name}</span>
                                            )}
                                        </td>
                                        <td className="text-end pe-3">
                                            {editingId === cat.id ? (
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-success" onClick={() => saveEdit(cat.id)}>Save</button>
                                                    <button className="btn btn-sm btn-light" onClick={cancelEdit}>Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(cat)}>Edit</button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>Delete</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Categories;