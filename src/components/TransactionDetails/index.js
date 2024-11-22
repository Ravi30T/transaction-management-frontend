import { useState, useEffect } from 'react'
import { Hourglass } from 'react-loader-spinner'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import Navbar from "../Navbar"

import './index.css'

const TransactionDetails = props => {
    const {match} = props
    const {params} = match
    const {id} = params

    const [showLoader, setLoaderStatus] = useState(true)
    const [errorMsgStatus, setErrMsgStatus] = useState(false)
    const [errorMsg, setErrMsg] = useState('')
    const [transactionDetails, setTransactionDetails] = useState([])

    const getTransactionDetails = async () => {
        setErrMsgStatus(false)
        setErrMsg('')

        const token = Cookies.get('jwt_token')

        const API_URL = `https://transaction-management-app.onrender.com/api/transactions/${id}/`
        const options = {
            method: "GET",
            headers: {
                "authorization": `Bearer ${token}`, 
            }
        }

        const response = await fetch(API_URL, options)
        const data = await response.json()


        if(response.ok === true){
            setLoaderStatus(false)
            setTransactionDetails(data[0])
        }
        else{
            setLoaderStatus(false)
            setErrMsg(data.message)
        }
    }

    useEffect(() => {
        getTransactionDetails()
    }, [])

    let statusColor
    let typeColor

    if(transactionDetails.length !== 0){
        switch (transactionDetails.status.toLowerCase()) {
            case "pending":
                statusColor = "status-pending";
                break
            case "completed":
                statusColor = "status-completed";
                break
            case "failed":
                statusColor = "status-failed";
                break
            default:
                return "";
                break 
        }

        
        switch (transactionDetails.transaction_type.toLowerCase()) {
            case "deposit":
                typeColor = "type-deposit";
                break;
            case "withdrawal":
                typeColor = "type-withdraw";
                break;
            default:
                return "";
                break;
        }   
        
    }

    return(
        <>
            <Navbar />
            <div className='transaction-details-main-container'>
                {
                    showLoader ? (
                        <div className="loader-container">
                            <span className="loader"> <Hourglass /> </span>
                        </div>
                    ):(
                        errorMsgStatus ?
                            <div> 
                                <p className='transaction-details-err-msg'> {errorMsg} </p>
                                <div className='back-btn-container'>
                                    <Link to="/dashboard">
                                        <button className='back-to-dashboard-btn'> Back </button>
                                    </Link>
                                </div>
                            </div>
                            : 
                            <>  
                                <div className="transaction-details-container">
                                    <h1>Transaction Details</h1>
                                    <p><strong>ID:</strong> {transactionDetails.transaction_id}</p>
                                    <p><strong>Amount:</strong> {transactionDetails.amount}</p>
                                    <p><strong>Transaction Type:</strong> <span className={`type ${typeColor}`}> {transactionDetails.transaction_type} </span> </p>
                                    <p><strong>Status:</strong> <span className={`status ${statusColor}` }> {transactionDetails.status} </span> </p>
                                    <p><strong>Transaction Time:</strong> {transactionDetails.timestamp}</p>
                                </div>

                                <div className='back-btn-container'>
                                    <Link to="/">
                                        <button className='back-to-dashboard-btn'> Back </button>
                                    </Link>
                                </div>
                            </>
                    )
                }
                
            </div>
        </>
    )
}

export default TransactionDetails