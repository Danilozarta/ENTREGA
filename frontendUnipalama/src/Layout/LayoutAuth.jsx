import { Outlet } from "react-router-dom"

const LayoutAuth = () => {
    return (
        <div className="h-screen">
            <div className="h-screen">
                <Outlet />
            </div>
        </div>
    )
}
export default LayoutAuth