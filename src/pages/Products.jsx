
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const Products = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Products</h4>
                    {location.pathname === '/products' && <button className="btn btn-secondary btn-sm" onClick={() => { navigate('add') }}>
                        + Add Product
                    </button>}
                </div>


                <Outlet />
            </div>

        </>
    );
};

export default Products;
