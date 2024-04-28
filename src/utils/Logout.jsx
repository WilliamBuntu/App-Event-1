import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/'); 
  };

  return (
   <div>
     <h3
        className="text-white cursor-pointer hover:bg-green-900 border border-green-900 px-2 py-2 rounded-lg"
        onClick={handleLogout}
    >
        <FontAwesomeIcon
        icon={faArrowRightFromBracket}
        className="mr-2 ml-2"
        style={{ color: "#f7f7f8" }}
        />
        Logout
    </h3>
   </div>
  );
};

export default LogoutButton;
