import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import ApiService from "../api/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import logo from "../assets/doc.png";
import googleLogo from "../assets/google.png";

function LoginPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        provider.addScope("https://www.googleapis.com/auth/drive");
        provider.addScope("https://www.googleapis.com/auth/drive.file");

        try {
            // Sign In with Google Popup
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token0 = credential.accessToken; // Access Token
            const refreshToken = result.user.stsTokenManager.refreshToken; // Refresh Token
            const jwtToken = result.user.stsTokenManager.accessToken; // JWT Token from Firebase
            
            console.log("Access Token:", token0);
            console.log("Refresh Token:", refreshToken);

            // Store Tokens in Cookies
            Cookies.set("token", token0, { expires: 7 }); // Access Token (7 Days)
            Cookies.set("refreshToken", refreshToken, { expires: 14 }); // Refresh Token (14 Days)
            
            setUser(result.user);
            console.log("User Info:", result.user);

            // Send JWT to Backend for Verification
            const response = await ApiService.postGoogleAuth(jwtToken);
            console.log("Backend Response:", response);

            // Store JWT in Cookies
            Cookies.set("jwt", response.jwt, { expires: 7 });

            // Create Folder in Google Drive
            const folderinfo = await ApiService.createFolder(token0, response.jwt);
            console.log("Folder Info:", folderinfo);

            Cookies.set("folder", folderinfo.folderId, { expires: 7 });
            navigate("/main");
        } catch (error) {
            console.error("Login Failed:", error);
        }
    };

    // Verify JWT on Component Mount
    useEffect(() => {
        const verifyToken = async () => {
            const jwt = Cookies.get("jwt");
            if (jwt) {
                try {
                    const response = await ApiService.getAuthData(jwt);
                    console.log("Token Verified:", response);
                    navigate("/main");
                } catch (error) {
                    console.error("Invalid or Expired Token:", error);
                    Cookies.remove("jwt");
                }
            }
        };
        verifyToken();
    }, [navigate]);

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8" style={{ height: '100vh' }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-40 w-auto" src={logo} />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    <div>
                        <button
                            onClick={handleGoogleLogin}
                            className="flex w-full justify-center items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <img src={googleLogo} alt="Google Logo" className="h-5 w-5" />
                            <span>Continue with Google</span>
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    You need to sign in with your
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500"> Google Account</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
