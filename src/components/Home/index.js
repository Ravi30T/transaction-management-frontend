import { useState, useEffect } from "react"
import Popup from 'reactjs-popup'
import Cookies from 'js-cookie'
import { Hourglass } from 'react-loader-spinner'
import { IoMdCloseCircle } from "react-icons/io";
import Navbar from "../Navbar"
import UserTransactions from "../UserTransactions";
import './index.css'

const Home = () => {
    const [userBal, setUserBal] = useState(0)
    const loggedinUsername = localStorage.getItem('username')
    const loggedinUserId = localStorage.getItem('uid')
    const username = loggedinUsername.charAt(0).toUpperCase() + loggedinUsername.slice(1);
    const [newTransactionAmount, setNewTransactionAmount] = useState(0)
    const [newTransactionType, setNewTransactionType] = useState('DEPOSIT')

    const [showLoader, setLoaderStatus] = useState(false)
    const [showNoTransactions, setNoTransactionsStatus] = useState(false)
    const [noTransactionsMsg, setNoTransactionsMsg] = useState('')

    const [userTransactions, setUserTransactions] = useState([])

    const [showMinAmountError, setMinAmountErrStatus] = useState(false)

    const getUserTransactions = async () => {
        setLoaderStatus(true)
        setNoTransactionsStatus(false)
        setNoTransactionsMsg('')

        const token = Cookies.get('jwt_token')

        const API_URL = 'https://transaction-management-app.onrender.com/api/transactions/'
        const options = {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`, 
            }
        }

        const response = await fetch(API_URL, options)
        const data = await response.json()
        
        if(response.ok === true){
            setLoaderStatus(false)
            setUserTransactions(data.transactions)
            userBal !== data.balance && setUserBal(data.balance)
        }
        else{
            setLoaderStatus(false)
            setNoTransactionsStatus(true)
            setNoTransactionsMsg(data.message)
            setUserBal(data.balance)
        }
    }

    useEffect(() => {
        getUserTransactions()
    },[])

    const onUpdateTransactionDetails = async (id, status) => {
        const jwtToken = Cookies.get('jwt_token')
        const API_URL = `https://transaction-management-app.onrender.com/api/transactions/${id}/`

        const updatingData = {
            status: status
        }
        
        const options = {
            method: "PUT",
            headers: {
                "authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatingData)
        }

        const response = await fetch(API_URL, options)
        const data = await response.json()

        if(response.ok === true){
            alert(data.message)
            getUserTransactions()
        }else{
          alert(data.message)  
        }

    }

    const onSubmitForm = async (e, close) => {
        e.preventDefault()

        setMinAmountErrStatus(false)
        if(newTransactionAmount !== '' && newTransactionType !== ""){
            if(!isNaN(newTransactionAmount) && parseFloat(newTransactionAmount) !== 0){
                const user = localStorage.getItem('uid')
                const token = Cookies.get('jwt_token')
                
                const newTransaction = {
                    user: user,
                    amount: newTransactionAmount,
                    transactionType: newTransactionType
                }

                const API_URL = "https://transaction-management-app.onrender.com/api/transactions/"
                const options = {
                    method: "POST",
                    headers: {
                        "authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newTransaction)
                }

                const response = await fetch(API_URL, options)
                const data = await response.json()

                if(response.ok === true){
                    setMinAmountErrStatus(false)
                    setNewTransactionAmount(0)
                    setNewTransactionType('DEPOSIT')
                    close()
                    setMinAmountErrStatus(false)
                    alert(data.message)
                    getUserTransactions()

                    onUpdateTransactionDetails(data.transactionId, 'COMPLETED') // To Update the transaction status as completed
                }
                else{
                    setMinAmountErrStatus(false)
                    setNewTransactionAmount(0)
                    setNewTransactionType('DEPOSIT')
                    alert(data.message)
                    close()
                    setMinAmountErrStatus(false)
                    getUserTransactions()

                    onUpdateTransactionDetails(data.transactionId, 'FAILED') // To Update the transaction status as failed 
                }
            }
            else{
                setMinAmountErrStatus(true)
            }
        }
    }

    return (
        <div>
            <Navbar />
            <div className="dashboard-main-container">
                <h1 className="welcome-msg"> Welcome Back, {username} </h1>    
                <h2 className="user-dashboard-heading"> Dashboard </h2>
                <div className="available-bal-new-transaction-btn-container"> 
                    
                    <Popup
                        modal
                        trigger={
                        <button type="button" className="new-transaction-btn">
                            New Transaction
                        </button>
                        }
                    >
                        {close => (
                            <>
                                <form className="form-main-container" onSubmit={(e) => onSubmitForm(e, close)}>
                                <div className="heading-cancel-button-container">
                                    <div className="new-transaction-form-close-btn-container">
                                        <button type="button" onClick={() => close()} className="new-transaction-form-close-btn"> <IoMdCloseCircle /> </button>
                                    </div>
                                    <h1 className="add-new-transaction-heading"> New Transaction </h1>
                                </div>
                                    <div className="new-transaction-inputs-container">

                                        <div className="transaction-amount-type-input-container">
                                            <label className="new-transaction-labels" htmlFor="user-id"> User Id </label>
                                            <input type="text" id="user-id" className="new-transaction-input-box" value={loggedinUserId} />
                                        </div>

                                        <div className="transaction-amount-type-input-container">
                                            <label className="new-transaction-labels" htmlFor="transaction-amount"> Transaction Amount </label>
                                            <input type="number" id="transaction-amount" step="any" className="new-transaction-input-box" onChange={(e) => setNewTransactionAmount(e.target.value)} placeholder="Enter Amount"/>
                                        </div>

                                        <div className="transaction-amount-type-input-container">
                                            <label className="new-transaction-labels" htmlFor="transaction-type"> Transaction Type </label>
                                            <select className="new-transaction-type-input-box" value={newTransactionType} onChange={(e) => setNewTransactionType(e.target.value)} >
                                                <option id="deposit"> DEPOSIT </option>
                                                <option id="withdrawal"> WITHDRAWAL </option>
                                            </select>
                                        </div>

                                        <div className="user-confirmation-message-confirm-btn-container">
                                            <div className="user-confirmation-checkbox-container">
                                                <div className="user-confimation-msg-container">
                                                    <input type="checkbox" id="confirmation-msg" className="user-check-box" required /> 
                                                    <label className="user-confirmation-label" htmlFor="confirmation-msg"> I accept all the provided details are correct. </label>
                                                </div>
                                            </div>

                                            {showMinAmountError && <p className="error-message"> Enter Amount Greater Than 0 </p>}
                                        </div>

                                        <button type="submit" className="confirm-btn"> Confirm </button>
                                    </div>
                                </form>
                            </>
                        )}
                  </Popup>
                </div>
                
                {
                    showLoader ? (
                        <div className="loader-container">
                            <span className="loader"> <Hourglass /> </span>
                        </div>
                    ) : (
                            showNoTransactions ? <p className="no-transactions-msg"> {noTransactionsMsg} </p> : <div> <h2 className="transactions-heading"> Transactions </h2> <UserTransactions transactions={userTransactions} /> </div>
                        )
                }

            </div>
        </div>
    )
}

export default Home