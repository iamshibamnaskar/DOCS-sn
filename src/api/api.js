
class ApiService {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async getAuthData(token) {
        try {
            const response = await fetch(`${this.baseURL}/api/verifyauth`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching auth data:', error);
            throw error;
        }
    }

    async postGoogleAuth(refreshToken) {
        console.log("Post Google auth")
        try {
            const response = await fetch(`${this.baseURL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: refreshToken }),
            });
            // console.log(await response.json())
            return await response.json();
        } catch (error) {
            console.error('Error posting Google auth:', error);
            throw error;
        }
    }

    async createFolder(token, jwt) {
        try {
            const response = await fetch(`${this.baseURL}/drive/create-folder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwt}`,
                },
                body: JSON.stringify({ token: token }),
            });
            // console.log(await response.json())
            return await response.json();
        } catch (error) {
            console.error('Error Creating Folder:', error);
            throw error;
        }
    }

    async getFiles(token, jwt) {
        try {
            const response = await fetch(`${this.baseURL}/drive/list-files`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwt}`,
                },
                body: JSON.stringify({ token: token }),
            });
            // console.log(await response.json())
            return await response.json();
        } catch (error) {
            console.error('Error getting files in Folder:', error);
            throw error;
        }
    }

    async insertFile(token, html, name, jwt) {
        try {
            const response = await fetch(`${this.baseURL}/drive/upload-doc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwt}`,
                },
                body: JSON.stringify({ token: token, htmlContent: html, fileName: name }),
            });
            // console.log(await response.json())
            return await response.json();
        } catch (error) {
            console.log(error)
            console.error('Error getting files in Folder:', error);
            throw error;
        }
    }

    
}

const apiService = new ApiService('https://docs-sn-backend.vercel.app');
export default apiService;
