import { useState, useEffect } from "react";

const VariantModal = ({ variant, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        color: "",
        images: [""],
    });

    useEffect(() => {
        if (variant) {
            setFormData({
                color: variant.color || "",
                images: variant.images && variant.images.length > 0 ? variant.images : [""],
            });
        }
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

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
    };

    const removeImageField = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev, 
            images: updatedImages.length === 0 ? [""] : updatedImages 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedImages = formData.images.filter(img => img.trim() !== "");
        
        if (!formData.color.trim()) return alert("Color name/code is required");
        if (cleanedImages.length === 0) return alert("At least one image URL is required");

        onSave({ ...formData, images: cleanedImages });
    };

    return (
        <div 
            className="modal d-block shadow" 
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title fw-bold">
                            {variant ? "📝 Edit Variant" : "✨ Add New Variant"}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Color Selection Section */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Variant Color</label>
                                <div className="d-flex gap-3 align-items-center">
                                    <div className="flex-grow-1">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="color"
                                            placeholder="Color Name or Hex (e.g. Rose Gold)"
                                            value={formData.color}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex flex-column align-items-center">
                                        <input
                                            type="color"
                                            className="form-control form-control-color border-0"
                                            title="Choose color"
                                            value={formData.color.startsWith("#") ? formData.color : "#000000"}
                                            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                        />
                                        <small className="text-muted" style={{fontSize: '10px'}}>Picker</small>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            {/* Images Section */}
                            <div className="mb-3">
                                <label className="form-label fw-bold d-flex justify-content-between">
                                    Product Images
                                    <span className="badge bg-primary-subtle text-primary">{formData.images.length} Slot(s)</span>
                                </label>
                                
                                <div className="row g-3">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="col-12 col-md-6">
                                            <div className="card bg-light border-0">
                                                <div className="card-body p-2">
                                                    {/* Preview Box */}
                                                    <div 
                                                        className="mb-2 rounded border d-flex align-items-center justify-content-center bg-white"
                                                        style={{ height: "120px", overflow: "hidden" }}
                                                    >
                                                        {img.trim() ? (
                                                            <img src={img} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                                        ) : (
                                                            <small className="text-muted">Image Preview</small>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="input-group input-group-sm">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Paste URL..."
                                                            value={img}
                                                            onChange={(e) => handleImageChange(index, e.target.value)}
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
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm mt-3 w-100 py-2 border-dashed"
                                    onClick={addImageField}
                                >
                                    + Add Another Image Slot
                                </button>
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0">
                            <button type="button" className="btn btn-link text-muted text-decoration-none" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary px-4 shadow-sm">
                                {variant ? "Update Variant" : "Create Variant"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VariantModal;    