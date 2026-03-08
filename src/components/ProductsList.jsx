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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Inventory Management</h4>
                <button className="btn btn-primary btn-sm px-3" onClick={() => navigate('/products/add')}>
                    + Add Product
                </button>
            </div>

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
                                    <div className="card border-0 shadow-sm bg-white">
                                        <div className="card-body d-flex justify-content-between align-items-center py-2">
                                            <div className="flex-grow-1">
                                                {/* Product Name */}
                                                <div className="fw-bold text-dark mb-2">{product.name}</div>

                                                {/* Pricing Information */}
                                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                                    {/* Final Price (Discounted) */}
                                                    <span className="text-primary fw-bold">
                                                        ₹{Math.round(product.price - (product.price * product.discount / 100))}
                                                    </span>

                                                    {product.discount > 0 && (
                                                        <>
                                                            {/* Original Price */}
                                                            <span className="text-muted text-decoration-line-through ">
                                                                ₹{product.price}
                                                            </span>

                                                            {/* Discount Percent */}
                                                            <span className="badge bg-success-subtle text-success border border-success-subtle py-1" style={{ fontSize: '0.7rem' }}>
                                                                {product.discount}% OFF
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`edit/${product.id}`, { state: { product } });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-warning text-dark"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`variant/${product.id}`);
                                                    }}
                                                >
                                                    Variants
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
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