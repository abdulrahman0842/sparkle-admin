import { useEffect, useState } from "react";
import { deleteProduct, getProductsByCategory } from "../services/productService";
import { getCategories } from '../services/CategoryService';
import { useNavigate } from "react-router-dom";

const ProductsList = () => {
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loadingCats, setLoadingCats] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const [deletingIds, setDeletingIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadInitialData() {
            setLoadingCats(true);
            try {
                const catData = await getCategories();
                setCategories(catData);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setLoadingCats(false);
            }
        }
        loadInitialData();
    }, []);

    const toggleCategory = async (categoryName) => {
        const isNowExpanded = !expandedCategories[categoryName];
        setExpandedCategories(prev => ({ ...prev, [categoryName]: isNowExpanded }));

        if (isNowExpanded && !productsByCategory[categoryName]) {
            setLoadingProducts(prev => ({ ...prev, [categoryName]: true }));
            try {
                const data = await getProductsByCategory(categoryName);
                setProductsByCategory(prev => ({ ...prev, [categoryName]: data }));
            } catch (err) {
                console.error(`Error loading ${categoryName}:`, err);
            } finally {
                setLoadingProducts(prev => ({ ...prev, [categoryName]: false }));
            }
        }
    };

    const handleDelete = async (product) => {
        const ok = window.confirm(`Delete "${product.name}"?`);
        if (!ok) return;

        const categoryName = product.category;
        const originalList = productsByCategory[categoryName];

        setProductsByCategory(prev => ({
            ...prev,
            [categoryName]: prev[categoryName].filter(p => p.id !== product.id)
        }));
        setDeletingIds(prev => [...prev, product.id]);

        try {
            await deleteProduct(product.id);
        } catch (err) {
            alert("Delete failed. Restoring item...");
            setProductsByCategory(prev => ({ ...prev, [categoryName]: originalList }));
        } finally {
            setDeletingIds(prev => prev.filter(id => id !== product.id));
        }
    };

    return (
        <div className="container mt-4 pb-5">
            
            {loadingCats && <div className="text-center py-5">Loading Categories...</div>}

            {categories.map((cat) => (
                <div key={cat.id} className="mb-3">
                    <div
                        className="d-flex justify-content-between align-items-center p-2 bg-white border rounded shadow-sm"
                        onClick={() => toggleCategory(cat.name)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="rounded border"
                                style={{ width: "45px", height: "45px", objectFit: "cover" }}
                            />
                            <h6 className="mb-0 text-uppercase fw-bold text-dark">{cat.name}</h6>
                        </div>

                        <div className="d-flex align-items-center gap-3 me-2">
                            {loadingProducts[cat.name] && (
                                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                            )}
                            <span className="text-muted small">
                                {expandedCategories[cat.name] ? '▲' : '▼'}
                            </span>
                        </div>
                    </div>

                    {expandedCategories[cat.name] && (
                        <div className="row g-3 mt-1 ms-2 ms-md-4">
                            {productsByCategory[cat.name]?.map((product) => (
                                <div key={product.id} className="col-12 col-xl-6">
                                    <div className="card border-0 shadow-sm bg-white h-100">
                                        <div className="card-body d-flex align-items-center py-2 px-3">

                                            {/* 1. Thumbnail Image */}
                                            <div className="me-3">
                                                <img
                                                    src={product.thumbnailImage}
                                                    alt={product.name}
                                                    className="rounded border"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "cover",
                                                        backgroundColor: "#f8f9fa"
                                                    }}
                                                />
                                            </div>

                                            {/* 2. Product Info */}
                                            <div className="flex-grow-1">
                                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>
                                                    {product.name}
                                                </div>

                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                    {/* Final Price */}
                                                    <span className="text-primary fw-bold">
                                                        ₹{Math.round(product.price - (product.price * product.discount / 100))}
                                                    </span>

                                                    {product.discount > 0 && (
                                                        <>
                                                            <span className="text-muted text-decoration-line-through small">
                                                                ₹{product.price}
                                                            </span>
                                                            <span className="badge bg-success-subtle text-success border border-success-subtle py-1" style={{ fontSize: '0.65rem' }}>
                                                                {product.discount}% OFF
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 3. Action Buttons */}
                                            <div className="d-flex gap-1 ms-2">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary border-0"
                                                    title="Edit"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`edit/${product.id}`, { state: { product } });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-warning text-dark border-0"
                                                    title="Variants"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`variant/${product.id}`);
                                                    }}
                                                >
                                                    Variants
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger border-0"
                                                    title="Delete"
                                                    disabled={deletingIds.includes(product.id)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(product);
                                                    }}
                                                >
                                                    {deletingIds.includes(product.id) ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProductsList;