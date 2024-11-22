import Cookies from 'js-cookie'
import { Link, withRouter } from 'react-router-dom/cjs/react-router-dom.min'

import './index.css'

const Navbar = props => {
    const {history} = props
    const onClickLogout = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('uid')
        Cookies.remove('jwt_token')
        history.replace('/login')
    }
    
    return(
        <nav className='nav-container'>
            <Link to="/" className="logo-link-item"> <h1 className="app-name"> Online Bank </h1> </Link>
            
            <div className='logout-profile-btn-container'>
                <Link to="/profile" className="profile-btn-link-item">
                    <button type="button" className="profile-btn"> Profile </button>
                </Link>
                <button type="button" className="logout-btn" onClick={onClickLogout}> Logout </button>
            </div>
        </nav>
)}

export default withRouter(Navbar)