import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VariantModal from "../components/VariantModal";
import { addVariant, updateVariant, deleteVariant, getVariantsByProductId } from "../services/variantService";

const Variant = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    useEffect(() => {
        async function fetchVariants() {
            setLoading(true);
            setError("");
            try {
                let data = await getVariantsByProductId(productId);
                setVariants(data);
            } catch (err) {
                setError(err.message || "Failed to load variants");
            } finally {
                setLoading(false);
            }
        }
        fetchVariants();
    }, [productId]);



    function openAddModal() {
        setEditingVariant(null);
        setShowModal(true);
    }

    function openEditModal(variant) {
        setEditingVariant(variant);
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingVariant(null);
    }

    async function handleSaveVariant(variantData) {
        setError("");
        try {
            if (editingVariant?.id) {
                // Edit mode
                // TODO: Replace with actual Supabase update

                const updated = { ...editingVariant, ...variantData };
                await updateVariant(updated);
                setVariants(prev =>
                    prev.map(v => (v.id === editingVariant.id ? updated : v))
                );
            } else {
                // Add mode
                // TODO: Replace with actual Supabase insert
                const newVariant = {
                    id: `temp-${Date.now()}`,
                    product_id: productId,
                    ...variantData,
                };
                await addVariant({ product_id: productId, ...variantData })
                setVariants(prev => [newVariant, ...prev]);
            }
            closeModal();
        } catch (err) {
            setError(err.message || "Failed to save variant");
        }
    }

    async function handleDeleteVariant(variantId) {
        if (!window.confirm("Delete this variant? This action cannot be undone.")) return;

        setError("");
        const backup = variants;
        // Optimistic delete
        setVariants(prev => prev.filter(v => v.id !== variantId));
        try {
            await deleteVariant(variantId)
            alert('Successful deletion')
        } catch (err) {
            setVariants(backup);
            setError(err.message || "Failed to delete variant");
        }
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex justify-content-center align-items-center">
                    <button
                        className="btn btn-outline-secondary btn-sm me-3"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                    <h4 className="d-inline">Product Variants</h4>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={openAddModal}
                >
                    + Add Variant
                </button>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {loading ? (
                <div className="text-center py-5">Loading variants...</div>
            ) : variants.length === 0 ? (
                <div className="alert alert-info">No variants yet. Click "+ Add Variant" to create one.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Color</th>
                                <th>Price</th>
                                <th>Images</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.map(variant => (
                                <tr key={variant.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div
                                                style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    backgroundColor: variant.color,
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                }}
                                            />
                                            {variant.color}
                                        </div>
                                    </td>
                                    <td>₹{variant.price || "—"}</td>
                                    <td>{variant.images?.length || 0} image(s)</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => openEditModal(variant)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteVariant(variant.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <VariantModal
                    variant={editingVariant}
                    onSave={handleSaveVariant}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Variant;