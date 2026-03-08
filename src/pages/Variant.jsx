import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VariantModal from "../components/VariantModal";
import { addVariant, updateVariant, deleteVariant, getVariantsByProductId } from "../services/variantService";
import { getProductById } from "../services/productService";
import ImageWithPreview from "../components/ImageWithPreview";

const Variant = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);

    useEffect(() => {
        async function loadInitialData() {
            setLoading(true);
            setError("");
            try {
                // Fetch Product Details and Variants in parallel
                const [productData, variantsData] = await Promise.all([
                    getProductById(productId),
                    getVariantsByProductId(productId)
                ]);
                setProduct(productData);
                setVariants(variantsData);
            } catch (err) {
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        }
        loadInitialData();
    }, [productId]);

    const openAddModal = () => { setEditingVariant(null); setShowModal(true); };
    const openEditModal = (variant) => { setEditingVariant(variant); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditingVariant(null); };

    async function handleSaveVariant(variantData) {
        setError("");
        try {
            if (editingVariant?.id) {
                const updated = { ...editingVariant, ...variantData };
                await updateVariant(updated);
                setVariants(prev => prev.map(v => (v.id === editingVariant.id ? updated : v)));
            } else {
                const savedVariant = await addVariant({ product_id: productId, ...variantData });
                setVariants(prev => [savedVariant, ...prev]);
            }
            closeModal();
        } catch (err) {
            setError(err.message || "Failed to save variant");
        }
    }

    async function handleDeleteVariant(variantId) {
        if (!window.confirm("Delete this variant?")) return;
        const backup = variants;
        setVariants(prev => prev.filter(v => v.id !== variantId));
        try {
            await deleteVariant(variantId);
        } catch (err) {
            setVariants(backup);
            setError(err.message || "Failed to delete variant");
        }
    }

    return (
        <div className="container mt-4">
            {/* 1. Product Header Section */}
            {product && (
                <div className="card border-0 shadow-sm mb-4 bg-light">
                    <div className="card-body d-flex align-items-center gap-3">
                        <img
                            src={product.thumbnailImage}
                            alt={product.name}
                            className="rounded border"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                        />
                        <div>
                            <h4 className="mb-1 fw-bold">{product.name}</h4>
                            <div className="text-muted small">
                                <span className="badge bg-secondary me-2">{product.category}</span>
                                <span className="fw-semibold text-primary">Base Price: ₹{product.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Page Actions */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
                    ← Back to Products
                </button>
                <button className="btn btn-primary btn-sm px-3" onClick={openAddModal}>
                    + Add New Variant
                </button>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {/* 3. Variants Table */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <div className="mt-2 text-muted">Loading variants...</div>
                </div>
            ) : variants.length === 0 ? (
                <div className="alert alert-info border-0 shadow-sm">
                    No variants found for this product.
                </div>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-3">Image</th>
                                    <th>Color Detail</th>
                                    <th className="text-end pe-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map(variant => (
                                    <tr key={variant.id}>
                                        <td className="ps-3">
                                            <ImageWithPreview
                                                src={variant.images?.[0] || 'https://via.placeholder.com/50'}
                                                alt="variant"
                                                size="50px"
                                            />
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    style={{
                                                        width: "18px",
                                                        height: "18px",
                                                        backgroundColor: variant.color,
                                                        border: "1px solid #ddd",
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                                <span className="text-uppercase small fw-bold">{variant.color}</span>
                                            </div>
                                            <small className="text-muted">{variant.images?.length || 0} total images</small>
                                        </td>
                                        <td className="text-end pe-3">
                                            <button
                                                className="btn btn-sm btn-light me-2"
                                                onClick={() => openEditModal(variant)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-light text-danger"
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