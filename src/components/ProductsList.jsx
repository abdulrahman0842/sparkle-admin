import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
const ProductsList = () => {
    const [loading, setloading] = useState(false)
    const [products, setproducts] = useState([])
    const [error, seterror] = useState(null)
    const [deletingIds, setDeletingIds] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        async function loadProducts() {
            setloading(true)
            seterror(null)
            try {
                let data = await getProducts()
                setproducts(data)
                setloading(false)
            } catch (error) {
                seterror(error)
                setloading(false)
            }
        }
        loadProducts()
    }, [])
    return (
        <div className="row g-3">

            {/* Loading State */}
            {loading && <div className="m-6 d-flex justify-content-center">
                Loading...
            </div>}

            {/* Error State */}
            {error && <div className="text-danger mt-6 -flex align-items-center"></div>}


            {products.length > 0 && products.map((product) => (
                <div key={product.id} className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body d-flex align-items-center gap-3">

                            <div className="d-flex gap-2">
                                {product.images.slice(0, 3).map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt="product"
                                        className="rounded border"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="flex-grow-1">
                                <h6 className="mb-1">{product.name}</h6>
                                <small className="text-muted">
                                    {product.category}
                                </small>
                                <div className="fw-semibold mt-1">
                                    ₹{product.price}
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => navigate(`edit/${product.id}`, {
                                        state: {
                                            isEditing: true, product: product
                                        }
                                    })}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={async () => {
                                        const ok = window.confirm('Delete this product? This action cannot be undone.');
                                        if (!ok) return;
                                        seterror(null);
                                        const backup = products;
                                        // optimistic remove
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
                                    }}
                                    disabled={deletingIds.includes(product.id)}
                                >
                                    {deletingIds.includes(product.id) ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}


export default ProductsList;