import { useEffect, useState } from 'react';
import docImage from '../assets/doc.png';
import draftImage from '../assets/draft.png';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/api';
import { v4 as uuidv4 } from 'uuid';
import PulseLoadingAnimation from '../components/pulseLoading';

function MainPage() {
  const navigate = useNavigate();
  const [files, Setfiles] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, Setloading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      const jwt = Cookies.get("jwt");
      if (jwt) {
        try {
          const response = await apiService.getAuthData(jwt);
          console.log("Token Verified:", response);
        } catch (error) {
          console.error("Invalid or Expired Token:", error);
          Cookies.remove("jwt");
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    const getFiles = async () => {
      const token = Cookies.get("token");
      const jwt = Cookies.get("jwt");
      if (token) {
        try {
          const response = await apiService.getFiles(token,jwt);
          console.log("files:", response);
          Setfiles(response.files);
        } catch (error) {
          console.error("Invalid or Expired Token:", error);
        } finally {
          Setloading(false)
        }
      } else {
        navigate("/");
      }
    };

    const getDrafts = () => {
      const savedDrafts = JSON.parse(localStorage.getItem("editorDrafts")) || [];
      const sortedDrafts = savedDrafts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      console.log("Sorted Drafts:", sortedDrafts);
      setDrafts(sortedDrafts);
    };


    verifyToken();
    getFiles();
    getDrafts();
  }, [navigate]);

  const newDoc = () => {
    const uniqueId = uuidv4();
    navigate(`/editor/${uniqueId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">All Documents</h2>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg" onClick={newDoc}>
            <span className="text-2xl">+</span>
            <span>New Doc</span>
          </button>
        </div>

        {drafts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Drafts</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  onClick={() => navigate(`/editor/${draft.id}`)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer snap-start flex-shrink-0"
                  style={{ width: '10rem' }}
                >
                  <div className="aspect-[3/2] w-full overflow-hidden">
                    <img
                      src={draftImage}
                      alt="Draft document"
                      className="object-cover hover:scale-105 transition-transform duration-200 w-full"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-base font-semibold text-gray-600 mb-1">{draft.title || 'Untitled Document'}</h3>
                    <p className="text-xs text-blue-400">
                      Last edited: {new Date(draft.timestamp).toLocaleDateString()}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {new Date(draft.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Saved Files</h3>
          {loading ? (
            <PulseLoadingAnimation />

          ) : (
            <div>
              {files.length == 0 ? (
                <h3 className="text-base font-semibold text-gray-600 mb-1">No Files are saved to Google Drive</h3>
              ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {files.map((product) => (
                    <a href={product.webViewLink} target="_blank" rel="noopener noreferrer" key={product.id}>
                      <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <div className="aspect-square w-full overflow-hidden">
                          <img
                            src={docImage}
                            alt={product.name}
                            className=" object-cover group-hover:scale-105 transition-transform duration-200"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                          />
                        </div>
                        <div className="p-4 overflow-hidden text-ellipsis">
                          <h3 className="text-lg font-semibold text-gray-600 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</h3>
                          <p className="text-xs text-blue-400">
                            Saved on: {new Date(product.createdTime).toLocaleDateString()}
                          </p>
                          <p className='text-xs text-gray-400'>
                            {new Date(product.createdTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </p>

                        </div>
                      </div>
                    </a>
                  ))}

                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
