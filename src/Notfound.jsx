import { useNavigate } from 'react-router-dom';
function Notfound() {
        const navigate = useNavigate();
        const handleback = () => {
        navigate("/");
    };
    return (<>
        <div>
            <h1>404 Not Found</h1>
        </div>
        <button className='counter' onClick={handleback}>Go Home</button>
        </>
    );
}
export default Notfound;