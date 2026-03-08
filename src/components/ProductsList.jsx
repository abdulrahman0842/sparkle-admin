import { useEffect, useState, useMemo } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";

const ProductsList = () => {
    const [loading, setloading] = useState(false);
    const [products, setproducts] = useState([]);
    const [error, seterror] = useState(null);
    const [deletingIds, setDeletingIds] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({}); // Track collapse state
    const navigate = useNavigate();

    // 1. Group products by category whenever the products list changes
    const groupedProducts = useMemo(() => {
        return products.reduce((acc, product) => {
            const cat = product.category || "Uncategorized";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(product);
            return acc;
        }, {});
    }, [products]);

    // 2. Toggle collapse
    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleDelete = async (product) => {
        const ok = window.confirm('Delete this product? This action cannot be undone.');
        if (!ok) return;
        
        const backup = products;
        setproducts(prev => prev.filter(p => p.id !== product.id));
        setDeletingIds(prev => [...prev, product.id]);
        
        try {
            await deleteProduct(product.id);
        } catch (err) {
            setproducts(backup);
            seterror(err.message || 'Failed to delete product');
        } finally {
            setDeletingIds(prev => prev.filter(id => id !== product.id));
        }
    };

    useEffect(() => {
        async function loadProducts() {
            setloading(true);
            try {
                let data = await getProducts();
                setproducts(data);
                // Initialize all categories as expanded by default
                const initialToggle = {};
                data.forEach(p => initialToggle[p.category] = true);
                setExpandedCategories(initialToggle);
            } catch (err) {
                seterror(err.message || "Failed to fetch products");
            } finally {
                setloading(false);
            }
        }
        loadProducts();
    }, []);

    return (
        <div className="container mt-4">
            {loading && <div className="text-center p-5">Loading Products...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {Object.keys(groupedProducts).map((category) => (
                <div key={category} className="mb-4">
                    {/* Category Header */}
                    <div 
                        className="d-flex justify-content-between align-items-center p-3 bg-light border rounded cursor-pointer" 
                        onClick={() => toggleCategory(category)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h5 className="mb-0 text-uppercase fw-bold">{category} ({groupedProducts[category].length})</h5>
                        <span>{expandedCategories[category] ? '▲' : '▼'}</span>
                    </div>

                    {/* Collapsible Content */}
                    {expandedCategories[category] && (
                        <div className="row g-3 mt-1">
                            {groupedProducts[category].map((product) => (
                                <div key={product.id} className="col-12 col-md-6">
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body d-flex align-items-center gap-3">
                                            <img
                                                src={product.thumbnailImage}
                                                alt={product.name}
                                                className="rounded border"
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{product.name}</h6>
                                                <div className="fw-semibold text-primary">₹{product.price}</div>
                                            </div>
                                            <div className="d-flex flex-column gap-1">
                                                <button 
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => navigate(`edit/${product.id}`, { state: { isEditing: true, product } })}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(product)}
                                                    disabled={deletingIds.includes(product.id)}
                                                >
                                                    {deletingIds.includes(product.id) ? '...' : 'Delete'}
                                                </button>
                                                <button 
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => navigate(`variant/${product.id}`)}
                                                >
                                                    Variants
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