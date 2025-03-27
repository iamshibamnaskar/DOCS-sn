import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import logo from "../assets/doc.png";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            Cookies.remove("jwt");
            Cookies.remove("folder");
            Cookies.remove("token");
            Cookies.remove('refreshToken');
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <div className="w-full bg-white shadow-md">
            <nav className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2" onClick={()=>{navigate('/main')}}>
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                    <span className="text-2xl font-semibold text-gray-800">Docs-sn</span>
                </div>
                <div onClick={handleLogout} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-all">
                    <FaSignOutAlt className="h-6 w-6 text-gray-600" />
                    <p className='text-xs text-gray-400'>Log out</p>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
