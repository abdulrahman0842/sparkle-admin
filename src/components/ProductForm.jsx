import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { addProduct, getProductById, updateProduct } from "../services/productService";

// Add error management here
const ProductForm = () => {
    const { id } = useParams();
    const location = useLocation();


    let isEditing = id ? true : false;
    const product = location.state?.product;
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        thumbnailImage: "",
    });

    useEffect(() => {
        async function loadInitialData() {
            if (product) {
                setFormData(product)
            } else {
                try {
                    let data = await getProductById(id)
                    setFormData(data);

                } catch (error) {
                    alert(`Something went wrong!\n${error}`)
                }

            }
        }

        if (isEditing) {
            loadInitialData();
        }

    }, [isEditing, product, id])

    // Handle normal inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Submit
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
                category: "",
                thumbnailImage: "",
            });
        } catch (err) {
            alert("Failed to add product", err);
            console.log(err)
        }
    };

    return (
        <div>
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
                        {/* Name + Description */}
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
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    rows="2"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* price + Category */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Price</label>
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
                                    <option value="Earing">Earing</option>
                                </select>
                            </div>
                        </div>

                        {/* Image URLs */}
                        <div className="mb-4">
                            <label className="form-label">Thumbnail Image</label>
                            <div className="d-flex gap-2 mb-2">
                                <input
                                    type="text" name="thumbnailImage"
                                    className="form-control"
                                    placeholder="Image URL"
                                    onChange={handleChange}
                                    value={formData.thumbnailImage}

                                    required
                                />
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="reset"
                                className="btn btn-outline-secondary"
                            >
                                Reset
                            </button>

                            <button
                                type="submit"
                                className="btn btn-success"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductForm;