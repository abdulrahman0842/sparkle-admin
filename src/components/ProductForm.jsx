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
        discount: 0,
        category: "",
        thumbnailImage: "", // Added field
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
        if (isEditing) loadInitialData();
    }, [isEditing, product, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "discount") {
            const val = parseInt(value);
            if (val < 0 || val > 100) return;
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
            setFormData({
                name: "",
                description: "",
                price: "",
                discount: 0,
                category: "",
                thumbnailImage: "",
            });
        } catch (err) {
            alert("Failed to save product");
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm me-3"
                            onClick={() => window.history.back()}
                        >
                            ← Back
                        </button>
                        <h4 className="mb-0 fw-bold text-dark">
                            {isEditing ? "Edit Product" : "Add New Product"}
                        </h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Thumbnail Section */}
                            <div className="col-md-4 mb-4">
                                <label className="form-label fw-semibold">Thumbnail Image</label>
                                <div 
                                    className="border rounded d-flex align-items-center justify-content-center bg-light mb-2"
                                    style={{ height: "200px", overflow: "hidden" }}
                                >
                                    {formData.thumbnailImage ? (
                                        <img 
                                            src={formData.thumbnailImage} 
                                            alt="Preview" 
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                        />
                                    ) : (
                                        <span className="text-muted small">No Image Provided</span>
                                    )}
                                </div>
                                <input
                                    type="url"
                                    className="form-control form-control-sm"
                                    name="thumbnailImage"
                                    placeholder="Paste Image URL here..."
                                    value={formData.thumbnailImage}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Main Details Section */}
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Product Name</label>
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
                                        <label className="form-label fw-semibold">Category</label>
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

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Base Price (₹)</label>
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
                                        <label className="form-label fw-semibold">Discount (%)</label>
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
                                    </div>

                                    {/* Calculated Final Price Display */}
                                    {formData.price > 0 && (
                                        <div className="col-12 mb-3">
                                            <div className="alert alert-secondary py-2 mb-0 border-0">
                                                <small className="text-muted">Customer will pay: </small>
                                                <strong className="text-success ms-2">
                                                    ₹{Math.round(formData.price - (formData.price * formData.discount / 100))}
                                                </strong>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-4 mt-2">
                            <label className="form-label fw-semibold">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="6"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        

                        {/* Actions */}
                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => setFormData({ name: "", description: "", price: "", discount: 0, category: "", thumbnailImage: "" })}
                            >
                                Reset Form
                            </button>
                            <button type="submit" className="btn btn-success px-5 fw-bold">
                                {isEditing ? "Update Product" : "Save Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;