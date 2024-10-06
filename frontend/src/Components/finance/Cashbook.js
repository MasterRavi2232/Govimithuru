import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../ui/img/logo.png'; // Adjust the path as needed

const Cashbook = () => {
    const [sellSummary, setSellSummary] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalSales, setTotalSales] = useState(0);
    const [totalOtherExpenses, setTotalOtherExpenses] = useState(0);
    const [totalPaychecks, setTotalPaychecks] = useState(0);
    const [totalSalaries, setTotalSalaries] = useState(0);
    const [totalGiveChecks, setTotalGiveChecks] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [paycheckRecords, setPaycheckRecords] = useState([]);
    const [error, setError] = useState('');

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const isInSelectedMonth = (date) => {
        const [year, month] = date.split('-');
        return `${year}-${month}` === selectedMonth;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ordersResponse = await fetch('http://localhost:8000/orders');
                const orders = await ordersResponse.json();

                const salesData = [];
                let totalSalesAmount = 0;

                orders
                    .filter(order => isInSelectedMonth(order.saleDate))
                    .forEach(order => {
                        order.productDetails.forEach(product => {
                            salesData.push({
                                date: order.saleDate,
                                itemName: product.itemName,
                                quantitySold: product.quantitySold,
                                totalSales: product.totalPrice,
                            });
                        });
                    });

                totalSalesAmount = salesData.reduce((acc, item) => acc + item.totalSales, 0);
                setSellSummary(salesData);
                setTotalSales(totalSalesAmount);

                const expensesResponse = await axios.get('http://localhost:8000/api/otherexpenses/');
                const filteredExpenses = expensesResponse.data.filter(expense => isInSelectedMonth(expense.date));
                const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + (expense.amount || 0), 0);
                
                setExpenses(filteredExpenses);
                setTotalOtherExpenses(totalExpenses);

                const paychecksResponse = await fetch('http://localhost:8000/api/givechecks');
                const paychecks = await paychecksResponse.json();
                const filteredPaychecks = paychecks.filter(paycheck => isInSelectedMonth(paycheck.date));
                const totalPaychecksAmount = filteredPaychecks.reduce((acc, paycheck) => acc + (paycheck.totalAmount || 0), 0);
                
                setTotalPaychecks(totalPaychecksAmount);
                setPaycheckRecords(filteredPaychecks);

                const salariesResponse = await fetch('http://localhost:8000/salary');
                const salariesData = await salariesResponse.json();
                const filteredSalaries = salariesData.filter(salary => isInSelectedMonth(salary.payday));
                const totalSalariesAmount = filteredSalaries.reduce((acc, salary) => acc + (salary.totalSalary || 0), 0);
                
                setSalaries(filteredSalaries);
                setTotalSalaries(totalSalariesAmount);

                const giveChecksResponse = await fetch('http://localhost:8000/api/givechecks');
                const giveChecks = await giveChecksResponse.json();
                const totalGiveChecksAmount = giveChecks.filter(check => isInSelectedMonth(check.date)).reduce((acc, check) => acc + (check.amount || 0), 0);
                setTotalGiveChecks(totalGiveChecksAmount);

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
        
        // Add Logo
        doc.addImage(logo, 'PNG', 14, 10, 50, 20); // Adjust size and position as needed

        // Company Details
        doc.setFontSize(14);
        doc.text("Govimithu Pvt Limited", 14, 40);
        doc.text("Anuradhapura Kahatagasdigiliya", 14, 45);
        doc.text("Phone Number: 0789840996", 14, 50);
        
        doc.setFontSize(20);
        doc.text("Cash Book", 14, 70); // Add title for cash book section

        const headers = [["Date", "Description", "Type", "Amount (Rs)", "Balance (Rs)"]];
        const data = [];
        let currentBalance = 0;

        // Sales Entries
        sellSummary.forEach(item => {
            currentBalance += item.totalSales;
            data.push([new Date(item.date).toLocaleDateString(), item.itemName, 'Sales', item.totalSales.toFixed(2), currentBalance.toFixed(2)]);
        });

        // Expense Entries
        expenses.forEach(expense => {
            currentBalance -= expense.amount;
            data.push([new Date(expense.date).toLocaleDateString(), expense.expenseName, 'Expense', (-expense.amount).toFixed(2), currentBalance.toFixed(2)]);
        });

        // Salary Entries
        salaries.forEach(salary => {
            currentBalance -= salary.totalSalary;
            data.push([new Date(salary.payday).toLocaleDateString(), `${salary.name} Salary`, 'Salary', (-salary.totalSalary).toFixed(2), currentBalance.toFixed(2)]);
        });

        // Paychecks Entries
        paycheckRecords.forEach(paycheck => {
            currentBalance -= paycheck.totalAmount;
            data.push([new Date(paycheck.date).toLocaleDateString(), `${paycheck.customerName} Paycheck`, 'Paycheck', (-paycheck.totalAmount).toFixed(2), currentBalance.toFixed(2)]);
        });

        // Add the autoTable with cash book entries
        doc.autoTable({
            head: headers,
            body: data,
            startY: 80, // Adjust starting Y position based on your needs
        });

        // Cash Book Total
        doc.setFontSize(16);
        doc.text(`Final Balance: Rs ${currentBalance.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10); // Positioning below the table

        // Save the PDF
        doc.save("CashBook.pdf");
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }

    // Calculate Table Total
    const tableTotal = totalSales - (totalOtherExpenses + totalPaychecks + totalSalaries + totalGiveChecks);

    return (
        <div>
            <label htmlFor="month">Select Month: </label>
            <input
                type="month"
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
            />

            <h1>Cash Book</h1>
            <button onClick={generatePDF} className="download-pdf-button">Download PDF</button>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount (Rs)</th>
                        <th>Balance (Rs)</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Individual Sales Entries */}
                    {sellSummary.concat(expenses, salaries, paycheckRecords).reduce((acc, item) => {
                        const type = item.itemName ? 'Sales' : item.expenseName ? 'Expense' : item.name ? 'Salary' : 'Paycheck';
                        const amount = item.totalSales || -item.amount || -item.totalSalary || -item.totalAmount;
                        const newRow = {
                            ...item,
                            type,
                            amount
                        };
                        acc.push(newRow);
                        return acc;
                    }, []).reduce((acc, row) => {
                        const balance = (acc.length ? acc[acc.length - 1].balance : 0) + row.amount;
                        acc.push({ ...row, balance });
                        return acc;
                    }, []).map((row, index) => (
                        <tr key={index}>
                            <td>{new Date(row.date || row.payday || row.saleDate).toLocaleDateString()}</td>
                            <td>{row.itemName || row.expenseName || `${row.name} Salary` || `${row.customerName} Paycheck`}</td>
                            <td>{row.type}</td>
                            <td>{row.amount.toFixed(2)}</td>
                            <td>{row.balance.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Monthly Income: Rs {tableTotal.toFixed(2)}</h2>
        </div>
    );
};

export default Cashbook;
