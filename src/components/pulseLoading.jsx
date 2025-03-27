function PulseLoadingAnimation() {
    return ( 
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square w-full bg-gray-200" />
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
     );
}

export default PulseLoadingAnimation;