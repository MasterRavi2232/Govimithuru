import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/InventoryDashboard.css';
import logo from '../ui/img/logo.png';

function InventoryDashboard() {
    const [items, setItems] = useState([]); // Original item list
    const [filteredItems, setFilteredItems] = useState([]); // Filtered item list
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get("http://localhost:8000/availableitem/")
            .then((res) => {
                setItems(res.data);
                setFilteredItems(res.data); // Initialize filtered items
                checkForLowStock(res.data); // Check for low stock items
            })
            .catch((err) => {
                toast.error("Error fetching data: " + err.message);
            });
    };

    const handleSearch = (query) => {
        if (query.trim() === "") {
            setFilteredItems(items); // Reset to original items if search query is empty
        } else {
            const lowerCaseQuery = query.toLowerCase();
            const filtered = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(lowerCaseQuery) ||
                    item.category.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredItems(filtered);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/availableitem/${id}`);
            toast.success("Item deleted successfully");
            fetchItems(); // Refresh the item list
        } catch (err) {
            toast.error("Error deleting item: " + err.message);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        // Add logo
        doc.addImage(logo, 'PNG', 10, 10, 50, 20); // Adjust size and position as needed

        // Add company details
        doc.text("Govimithu Pvt Limited", 20, 35);
        doc.text("Anuradhapura Kahatagasdigiliya", 20, 40);
        doc.text("Phone Number: 0789840996", 20, 45);
        
        doc.text('Available Inventory Items', 20, 60);

        const columns = [
            { header: "Name", dataKey: "name" },
            { header: "Supplier Name", dataKey: "supName" },
            { header: "Description", dataKey: "description" },
            { header: "Category", dataKey: "category" },
            { header: "Unit", dataKey: "unit" },
            { header: "Available Item", dataKey: "availableItem" }
        ];

        const rows = filteredItems.map(item => ({
            name: item.name,
            supName: item.supName,
            description: item.description,
            category: item.category,
            unit: item.unit,
            availableItem: item.availableItem
        }));

        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: rows.map(row => columns.map(col => row[col.dataKey])),
            startY: 70, // Adjust start position after company details
        });

        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 10, pageHeight - 20);
        doc.text('Thank you for using our service!', 10, pageHeight - 15);

        doc.save('inventory_items.pdf');
    };

    const downloadItemPDF = (item) => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        
        // Add logo
        doc.addImage(logo, 'PNG', 10, 10, 50, 20); // Adjust size and position as needed

        // Add company details
        doc.text("Govimithu Pvt Limited", 20, 35);
        doc.text("Anuradhapura Kahatagasdigiliya", 20, 40);
        doc.text("Phone Number: 0789840996", 20, 45);

        doc.text('Item Details', 20, 60);
        doc.text(`Name: ${item.name}`, 20, 70);
        doc.text(`Supplier Name: ${item.supName}`, 20, 80);
        doc.text(`Description: ${item.description}`, 20, 90);
        doc.text(`Category: ${item.category}`, 20, 100);
        doc.text(`Unit: ${item.unit}`, 20, 110);
        doc.text(`Available Item: ${item.availableItem}`, 20, 120);

        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(10);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 10, pageHeight - 20);
        doc.text('Thank you for using our service!', 10, pageHeight - 15);
        
        doc.save(`${item.name}.pdf`); // Save with item name as file name
    };

    const checkForLowStock = (items) => {
        items.forEach(item => {
            if (item.availableItem <= 3) {
                createInventoryAlert(item._id, item.name);
            }
        });
    };

    const createInventoryAlert = (itemId, itemName) => {
        const message = `Low stock alert: ${itemName} is running low with only ${itemId} items left.`;
        axios.post("http://localhost:8000/inventoryalert", { itemId, message })
            .then((res) => {
                console.log("Alert created for:", itemName);
            })
            .catch((err) => {
                console.error("Error creating alert:", err.message);
            });
    };

    return (
        <div>
            <ToastContainer />
            <h2 className="inventory-list-title">Available Inventory Dashboard</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Name or Category"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value); // Call handleSearch on input change
                    }}
                />
            </div>
            <button className="download-btn" onClick={downloadPDF}>Download All Items as PDF</button>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Supplier Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Available Item</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.supName}</td>
                                <td>{item.description}</td>
                                <td>{item.category}</td>
                                <td>{item.unit}</td>
                                <td>{item.availableItem}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                                    <button className="download-btn" onClick={() => downloadItemPDF(item)}>Download PDF</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                No items found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryDashboard;
