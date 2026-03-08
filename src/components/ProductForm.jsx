import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { addProduct, getProductById, updateProduct } from "../services/productService";

const ProductForm = () => {
    const { id } = useParams();
    const location = useLocation();

    let isEditing = id ? true : false;
    const product = location.state?.product;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discount: 0, // Default to 0
        category: "",
    });

    useEffect(() => {
        async function loadInitialData() {
            if (product) {
                setFormData(product);
            } else if (id) {
                try {
                    let data = await getProductById(id);
                    setFormData(data);
                } catch (error) {
                    alert(`Something went wrong!\n${error}`);
                }
            }
        }

        if (isEditing) {
            loadInitialData();
        }
    }, [isEditing, product, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Logical check for discount range
        if (name === "discount") {
            const val = parseInt(value);
            if (val < 0 || val > 100) return; // Prevent typing outside 0-100
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                const updatedProduct = await updateProduct(formData);
                alert(`Updated Successfully!\n${updatedProduct.name}`);
            } else {
                const savedProduct = await addProduct(formData);
                alert(`Product added successfully!\n${savedProduct.name}`);
            }
            
            // Reset form
            setFormData({
                name: "",
                description: "",
                price: "",
                discount: 0,
                category: "",
            });
        } catch (err) {
            alert("Failed to save product");
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm me-3"
                            onClick={() => window.history.back()}
                        >
                            ← Back
                        </button>
                        <h4 className="mb-0">{isEditing ? "Edit Product" : "Add Product"}</h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name + Category */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Ring">Ring</option>
                                    <option value="Necklace">Necklace</option>
                                    <option value="Bracelet">Bracelet</option>
                                    <option value="Earring">Earring</option>
                                    <option value="Bangle">Bangle</option>
                                </select>
                            </div>
                        </div>

                        {/* Price + Discount */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Price (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Discount (%)</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="discount"
                                        min="0"
                                        max="100"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="input-group-text">%</span>
                                </div>
                                <small className="text-muted">Enter a value between 0 and 100</small>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="6"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Actions */}
                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => setFormData({ name: "", description: "", price: "", discount: 0, category: "" })}
                            >
                                Reset
                            </button>

                            <button type="submit" className="btn btn-success px-4">
                                {isEditing ? "Update Product" : "Save Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductForm;