import { useState, useEffect } from "react";

const VariantModal = ({ variant, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        color: "",
        images: [""],
    });

    useEffect(() => {
        function loadVariant() {
            if (variant) {
                setFormData({
                    color: variant.color || "",
                    images: variant.images || [""],
                });
            } else {
                setFormData({
                    color: "",
                    images: [""],
                });
            }
        }

        loadVariant()
    }, [variant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...formData.images];
        updatedImages[index] = value;
        setFormData(prev => ({ ...prev, images: updatedImages }));
    };

    const addImage = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ""],
        }));
    };

    const removeImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            images: updatedImages.length === 0 ? [""] : updatedImages,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.color.trim()) {
            alert("Color is required");
            return;
        }
        // Filter out empty images
        const cleanedImages = formData.images.filter(img => img.trim());
        onSave({
            ...formData,
            images: cleanedImages.length === 0 ? [""] : cleanedImages,
        });
    };

    return (
        <div
            className="modal d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={onClose}
        >
            <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {variant ? "Edit Variant" : "Add Variant"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Color Field */}
                            <div className="mb-3">
                                <label className="form-label">Color *</label>
                                <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="color"
                                        placeholder="e.g., Red, Blue, Gold"
                                        value={formData.color}
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        type="color"
                                        className="form-control"
                                        style={{ width: "60px" }}
                                        value={
                                            formData.color.startsWith("#")
                                                ? formData.color
                                                : "#000000"
                                        }
                                        onChange={(e) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                color: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Images */}
                            <div className="mb-3">
                                <label className="form-label">Images</label>
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
                                        />
                                        {formData.images.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeImage(index)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={addImage}
                                >
                                    + Add Image
                                </button>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save Variant
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VariantModal;
