import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import './index.css'

const UserTransactions = props => {
    const {transactions} = props

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "status-pending";
            case "completed":
                return "status-completed";
            case "failed":
                return "status-failed";
            default:
                return ""; 
        }
    };

    const getTransactionTypeClass = (type) => {
        switch (type.toLowerCase()) {
            case "deposit":
                return "type-deposit";
            case "withdrawal":
                return "type-withdraw";
            default:
                return "";
        }
    };

    return (
            <div className="users-data-container"> 
                <table style={{ width: "100%", borderCollapse: "collapse" }} border="1">
                    <thead>
                        <tr>
                            <th className="table-transaction-id">ID</th>
                            <th className="table-amount">Amount</th>
                            <th className="table-amount">Transaction Type</th>
                            <th className="table-status">Status</th>
                            <th className="table-transaction-time"> Transaction Time</th>
                            <th className="table-actions"> View </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((user) => (
                            <tr key={user.userId}>
                                <td className="table-transaction-id-data">{user.transaction_id}</td>
                                <td className="table-amount-data">{user.amount}</td>
                                <td className={`table-amount-data ${getTransactionTypeClass(user.transaction_type)}`}>{user.transaction_type}</td>
                                <td className={`table-status-data ${getStatusClass(user.status)}`}>{user.status}</td>
                                <td className="table-transaction-time-data">{user.timestamp}</td>
                                <td>
                                    <Link to={`/transaction-details/${user.transaction_id}`} > 
                                        <div className="view-transaction-btn-container"> 
                                            <button type="button" className="view-transaction-details-btn"> 
                                                <FaArrowUpRightFromSquare /> 
                                            </button> 
                                        </div>
                                    </Link> 
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>        
            </div>
    )
}

export default UserTransactions