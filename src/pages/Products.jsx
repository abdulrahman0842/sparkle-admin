
import { useNavigate, Outlet } from "react-router-dom";

const Products = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Products</h4>
                    <button className="btn btn-secondary btn-sm" onClick={() => { navigate('add-products') }}>
                        + Add Product
                    </button>
                </div>
               

                <Outlet />
            </div>

        </>
    );
};

export default Products;
