import { useState } from "react";
import TubeMapImageSmall from "../assets/tube-map-sm.png";
import TubeMapImageBig from "../assets/tube-map.png";
import CloseIcon from "../assets/ui/close-100.svg";

function Map() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal popup
  const openModal = () => setIsModalOpen(true);

  // Close modal popup
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex justify-center items-start w-full my-0 mx-auto px-[20px] sm:px-[30px] md:px-[150px] lg:px-[190px] bg-[#F5F5F5] h-[calc(100vh-80px)] overflow-auto pt-[67px] sm:pt-[37px] md:pt-[27px]">
      <div className="flex justify-center items-center md:py-[50px] lg:py-[20px]">
        {/* Open modal when the img is clicked */}
        <img
          className="min-w-[300px] sm:min-w-[700px] md:min-w-[900px] lg:min-w-[900px] cursor-pointer"
          src={TubeMapImageSmall}
          width={500}
          height={500}
          alt="Tube Map"
          onClick={openModal}
        />
      </div>

      {/* Modal popup */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex justify-center items-center z-[9999]">
          <div className="bg-white p-[20px] rounded-lg relative max-w-[90%] max-h-[90vh] overflow-auto">
            <div className="absolute top-0 right-0 p-2">
              <button onClick={closeModal}>
                <img
                  src={CloseIcon}
                  width={20}
                  height={20}
                  alt="Close Modal Popup"
                />
              </button>
            </div>
            <img
              className="max-w-full max-h-[75vh] object-contain"
              src={TubeMapImageBig}
              alt="Zoomed Tube Map"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
