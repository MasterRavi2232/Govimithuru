import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const SellSummaryFinance = () => {
    const [sellSummary, setSellSummary] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalSales, setTotalSales] = useState(0);
    const [totalOtherExpenses, setTotalOtherExpenses] = useState(0);
    const [totalPaychecks, setTotalPaychecks] = useState(0);
    const [totalSalaries, setTotalSalaries] = useState(0);
    const [totalGiveChecks, setTotalGiveChecks] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [paycheckRecords, setPaycheckRecords] = useState([]);
    const [error, setError] = useState('');

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const isInSelectedMonth = (date) => {
        const selectedYear = selectedMonth.split('-')[0];
        const selectedMonthNum = selectedMonth.split('-')[1];
        const [year, month] = date.split('-');
        return year === selectedYear && month === selectedMonthNum;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ordersResponse = await fetch('http://localhost:8000/orders');
                const orders = await ordersResponse.json();

                const summary = {};
                let totalSalesAmount = 0;

                // Filter and summarize sales for the selected month
                orders.filter(order => isInSelectedMonth(order.saleDate)).forEach(order => {
                    order.productDetails.forEach(product => {
                        if (summary[product.itemName]) {
                            summary[product.itemName].quantitySold += product.quantitySold;
                            summary[product.itemName].totalSales += product.totalPrice;
                        } else {
                            summary[product.itemName] = {
                                quantitySold: product.quantitySold,
                                totalSales: product.totalPrice,
                            };
                        }
                    });
                });

                totalSalesAmount = Object.values(summary).reduce((acc, item) => acc + item.totalSales, 0);
                setSellSummary(Object.entries(summary).map(([itemName, details]) => ({
                    itemName,
                    ...details,
                })));
                setTotalSales(totalSalesAmount);

                // Fetch expenses and filter by selected month
                const expensesResponse = await axios.get('http://localhost:8000/api/otherexpenses/');
                const filteredExpenses = expensesResponse.data.filter(expense => isInSelectedMonth(expense.date));
                const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);
                
                setExpenses(filteredExpenses);
                setTotalOtherExpenses(totalExpenses);

                // Fetch paychecks and filter by selected month
                const paychecksResponse = await fetch('http://localhost:8000/api/givechecks');
                const paychecks = await paychecksResponse.json();
                const filteredPaychecks = paychecks.filter(paycheck => isInSelectedMonth(paycheck.date));
                const totalPaychecksAmount = filteredPaychecks.reduce((acc, paycheck) => acc + (paycheck.totalAmount || 0), 0);
                
                setTotalPaychecks(totalPaychecksAmount);
                setPaycheckRecords(filteredPaychecks);

                // Fetch salaries and filter by selected month
                const salariesResponse = await fetch('http://localhost:8000/salary');
                const salariesData = await salariesResponse.json();
                const filteredSalaries = salariesData.filter(salary => isInSelectedMonth(salary.payday));
                const totalSalariesAmount = filteredSalaries.reduce((acc, salary) => acc + (salary.totalSalary || 0), 0);
                
                setSalaries(filteredSalaries);
                setTotalSalaries(totalSalariesAmount);

                // Calculate final total
                const totalGiveChecksAmount = totalGiveChecks || 0; // Ensure this is defined
                const final = totalSales - (totalOtherExpenses + totalPaychecks + totalSalaries + totalGiveChecksAmount);
                setFinalTotal(final);

            } catch (err) {
                setError('Error fetching data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth]);

    const handleDeleteExpense = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.delete(`http://localhost:8000/api/otherexpenses/${id}`);
                setExpenses(expenses.filter((expense) => expense._id !== id));
                alert('Expense deleted successfully');
            } catch (err) {
                setError('Error deleting expense: ' + err.message);
            }
        }
    };

    const handleDeleteSalary = async (id) => {
        if (window.confirm("Are you sure you want to delete this salary record?")) {
            try {
                await axios.delete(`http://localhost:8000/salary/delete/${id}`);
                setSalaries(salaries.filter(salary => salary._id !== id));
                alert('Salary record deleted successfully');
            } catch (err) {
                setError('Error deleting salary record: ' + err.message);
            }
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Other Expenses Report", 20, 30);
        doc.setFontSize(12);

        const headers = [["Expense Name", "Description", "Amount", "Date", "Category", "Payment Method"]];
        const data = expenses.map(expense => [
            expense.expenseName,
            expense.expenseDescription,
            `Rs:${expense.amount.toFixed(2)}`,
            new Date(expense.date).toLocaleDateString(),
            expense.category,
            expense.paymentMethod
        ]);

        doc.autoTable({
            head: headers,
            body: data,
            startY: 40,
        });

        doc.save("OtherExpensesReport.pdf");
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Monthly Sales Summary</h1>

            <label htmlFor="month">Select Month: </label>
            <input
                type="month"
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
            />

            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity Sold</th>
                        <th>Total Sales (Rs)</th>
                    </tr>
                </thead>
                <tbody>
                    {sellSummary.map(item => (
                        <tr key={item.itemName}>
                            <td>{item.itemName}</td>
                            <td>{item.quantitySold}</td>
                            <td>{item.totalSales.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Monthly Total Sales (Rs): {totalSales.toFixed(2)}</h2>

            <h1>Monthly Expenses Summary</h1>
            <button onClick={generatePDF} className="download-pdf-btn">Download PDF</button>
            <table>
                <thead>
                    <tr>
                        <th>Expense Type</th>
                        <th>Total (Rs)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Other Expenses</td>
                        <td>{totalOtherExpenses.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Paychecks</td>
                        <td>{totalPaychecks.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Salaries</td>
                        <td>{totalSalaries.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <h2>Monthly Final Total (Sales - Expenses): {finalTotal.toFixed(2)}</h2>

            <h1>Paychecks</h1>
            <table>
                <thead>
                    <tr>
                        <th>Receipt Number</th>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {paycheckRecords.map((paycheck) => (
                        <tr key={paycheck._id}>
                            <td>{paycheck.receiptNumber}</td>
                            <td>{paycheck.transactionId}</td>
                            <td>{new Date(paycheck.date).toLocaleDateString()}</td>
                            <td>{paycheck.customerName}</td>
                            <td>{paycheck.totalAmount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Total Paychecks (Rs): {totalPaychecks.toFixed(2)}</h2>

            <h1>Other Expenses Details</h1>
            <table>
                <thead>
                    <tr>
                        <th>Expense Name</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense._id}>
                            <td>{expense.expenseName}</td>
                            <td>{expense.expenseDescription}</td>
                            <td>Rs:{expense.amount.toFixed(2)}</td>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                            <td>{expense.category}</td>
                            <td>{expense.paymentMethod}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h1>Salary Details</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Basic Salary</th>
                        <th>Bonus</th>
                        <th>ETF</th>
                        <th>Total Salary</th>
                        <th>Payday</th>
                    </tr>
                </thead>
                <tbody>
                    {salaries.map(salary => (
                        <tr key={salary._id}>
                            <td>{salary.name}</td>
                            <td>{salary.position}</td>
                            <td>Rs:{salary.basicSalary.toFixed(2)}</td>
                            <td>Rs:{salary.bonus.toFixed(2)}</td>
                            <td>Rs:{salary.ETF.toFixed(2)}</td>
                            <td>Rs:{salary.totalSalary.toFixed(2)}</td>
                            <td>{new Date(salary.payday).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SellSummaryFinance;
