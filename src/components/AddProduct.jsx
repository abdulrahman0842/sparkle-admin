import { useState } from "react";
import { addProduct } from "../services/productService";
const AddProductForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [""],
    });

    // Handle normal inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle image input change
    const handleImageChange = (index, value) => {
        const updatedImages = [...formData.images];
        updatedImages[index] = value;
        setFormData({ ...formData, images: updatedImages });
    };

    // Add new image field
    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

    // Remove image field
    const removeImageField = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    // Submit

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const savedProduct = await addProduct(formData);
            console.log("Product added:", savedProduct);

            alert("Product added successfully!");

            // Reset form
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                images: [""],
            });
        } catch (err) {
            alert("Failed to add product", err);
        }
    };
    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h4 className="mb-3">Add Product</h4>

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-3">
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

                        {/* Description */}
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="d-flex gap-3     ">
                            {/* Price */}
                            <div className="mb-3 w-100">
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

                            {/* Category */}
                            <div className="mb-3 w-100">
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
                        <div className="mb-3">
                            <label className="form-label">Image URLs</label>

                            {formData.images.map((img, index) => (
                                <div key={index} className="d-flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Image URL"
                                        value={img}
                                        onChange={(e) =>
                                            handleImageChange(index, e.target.value)
                                        }
                                        required
                                    />

                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeImageField(index)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={addImageField}
                            >
                                + Add Image
                            </button>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn btn-success w-100">
                            Save Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductForm;
