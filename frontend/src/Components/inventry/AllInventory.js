import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import './css/inventryAll.css';
import logo from '../ui/img/logo.png';

const nameOptions = [
    // Growth Promoters
 "Seaweed extract", "Humic acid", "Amino acid solutions", "Mycorrhizal fungi",
 "Plant hormones (e.g., auxins, gibberellins)", "Rooting powders", "Foliar sprays",
 "Organic compost teas", "Bio-stimulants", "Trichoderma products", "Liquid kelp",
 "Super phosphates", "Worm castings", "Bacterial inoculants", "Organic mulch",
 "Nutrient-dense fertilizers", "Microbial inoculants", "Fish emulsion", 
 "Vitamin B12 supplements", "Organic growth enhancers", "Fermented plant extracts",
 "Plant extracts (e.g., neem oil)", "Aloe vera gel", "Cacao shell mulch",
 "Phosphorus solubilizers", "Biochar", "Compost", "Bone meal", "Nettle tea",
 "Plant probiotics", "Chitosan", "Calcium carbonate", "Magnesium sulfate",
 "Organic insecticides", "Plant sugars", "Silicon supplements", "Cold-pressed oils",
 "Green manures", "Lactobacillus cultures", "Saponins", "Citrus extracts",
 "Garlic extract", "Vinegar-based solutions", "Molasses", "Charcoal", "Herbal teas",
 "Yeast extracts", "Plant protein hydrolysates", "Protein-rich fertilizers",
 "Nutritional enzymes",

 // Remedies
 "Neem oil", "Diatomaceous earth", "Insecticidal soap", "Baking soda fungicide",
 "Garlic spray", "Chili pepper spray", "Epsom salts", "Rubbing alcohol for pests",
 "Boric acid traps", "Copper fungicide", "Hydrogen peroxide", "Citrus oil spray",
 "Vinegar for weeds", "Corn gluten meal", "Essential oils (e.g., peppermint)",
 "Castile soap", "Organic herbicides", "Tea tree oil", "Pyrethrin sprays",
 "Fish oil repellents", "Compost tea for disease control", "Molasses for soil health",
 "Wood ash as fertilizer", "Plant-based repellents", "Soapnut solutions",
 "Essential oil diffusers", "Companion planting strategies", "Pest-resistant plants",
 "Homemade traps", "Fermented plant juices", "Spinosad", "Beneficial nematodes",
 "Lavender oil", "Clove oil", "Bio-pesticides", "Foliar nutrient sprays",
 "Kelp meal for growth", "Citrus peel barriers", "Chopped garlic in soil",
 "Cider vinegar traps", "Baking soda for powdery mildew", "Natural fungicides",
 "Anti-fungal teas", "Herbicidal soap", "Soap nut wash for fruits", 
 "Molasses soil amendments", "Fermented whey", "Aloe vera as a pest repellent",
 "Comfrey leaf extract", "Potato peels for pest control",

 // Organic Farming
 "Organic seeds", "Green manures", "Crop rotation systems", "Cover crops", 
 "Organic mulch", "Companion planting guides", "Organic pest control products", 
 "Permaculture techniques", "Organic soil amendments", "Eco-friendly weed control", 
 "Sustainable irrigation systems", "Biodynamic farming inputs", "Organic compost", 
 "Natural fertilizers", "Seed saving kits", "Organic certification resources", 
 "Native plant seeds", "Wildlife habitats", "Organic herbicides", 
 "Renewable energy sources (e.g., solar)", "Rainwater harvesting systems", 
 "Vertical farming setups", "Organic insect attractants", "Hand tools for organic gardening", 
 "Organic crop insurance", "Community-supported agriculture (CSA)", 
 "Eco-friendly packaging", "Organic gardening workshops", "Soil health testing kits", 
 "Organic food preservation supplies", "Heirloom seeds", "Organic bee supplies", 
 "Organic greenhouse materials", "Cold frames", "Organic hydroponic systems", 
 "Aquaponic supplies", "Organic fertilizers (e.g., fish emulsion)", 
 "Soil testing kits", "Integrated pest management (IPM) guides", 
 "Organic landscaping materials", "Natural planting guides", "Organic livestock feed", 
 "Organic fruit tree care supplies", "Natural dyes from plants", 
 "Organic vegetable growing kits", "Pollinator-friendly plants", 
 "Organic soil testing services", "Educational resources for organic farming", 
 "Organic pest traps", "Organic gardening blogs or magazines",

 // Equipment
 "Hand trowels", "Pruning shears", "Garden forks", "Hoes", "Rakes", "Shovels",
 "Soil testers", "Compost bins", "Seed starting trays", "Sprayers (handheld and backpack)",
 "Drip irrigation kits", "Garden gloves", "Watering cans", "Wheelbarrows", "Cultivators",
 "Greenhouses", "Cold frames", "Garden hoses", "Mulching tools", "Rototillers", 
 "Sickle or scythe", "Plant supports (stakes, cages)", "Soil augers", 
 "Electric or gas-powered tillers", "Pest traps", "Planting guides and templates", 
 "Raised bed kits", "Harvesting baskets", "Grafting tools", "Seeders and planters", 
 "Weeders", "Fertilizer spreaders", "Soil moisture meters", "Shade cloth", 
 "Row covers", "Lawn mowers (manual and electric)", "Insect netting", 
 "Hydroponic systems", "Aquaponic equipment", "Organic pest control sprayers", 
 "Outdoor storage sheds", "Garden carts", "Portable greenhouse kits", 
 "Trimmers (hedge and grass)", "Harvesting knives", "Tarp for collecting leaves", 
 "Protective netting", "Soil sieve", "Water timers", "Compost aerators",

 // Fertilizers
 "Compost", "Manure (e.g., cow, chicken)", "Fish emulsion", "Bone meal", 
 "Blood meal", "Kelp meal", "Worm castings", "Rock phosphate", "Greensand", 
 "Epsom salts", "Alfalfa meal", "Cottonseed meal", "Molasses", "Seaweed extract", 
 "Organic granular fertilizers", "Liquid organic fertilizers", "Organic NPK fertilizers", 
 "Humic acid products", "Micronutrient mixes", "Slow-release organic fertilizers", 
 "Fermented plant juices", "Green manure crops", "Cover crop mixes", 
 "Compost tea", "Organic liquid fertilizers", "Guano (bat or seabird)", 
 "Sulfate of potash", "Organic sulfate fertilizers", "Rock dust", 
 "Organic fish powders", "Diatomaceous earth", "Organic citrus fertilizer", 
 "Organic bloom boosters", "Vegetable garden fertilizers", "Organic fruit tree fertilizers", 
 "Organic nitrogen boosters", "Organic soil amendments", "Foliar feed options", 
 "Organic fertilizers for lawns", "Bone char", "Organic phosphate fertilizers", 
 "Liquid kelp fertilizers", "Microbial fertilizers", "Organic calcium sources", 
 "Organic fertilizers for container plants", "Fertilizer spikes", 
 "Organic fertilizers for hydroponics", "Pelletized organic fertilizers", 
 "Organic sweeteners for soil", "Natural compost additives",

 // Irrigation
 "Drip irrigation kits", "Soaker hoses", "Sprinkler systems", "Garden hoses", 
 "Water timers", "Rain barrels", "Irrigation controllers", "Sprayer attachments", 
 "PVC piping for irrigation", "Hose reels", "Micro-sprinklers", "Automatic drip emitters", 
 "Hose connectors", "Watering cans", "Irrigation stakes", "Pressure regulators", 
 "Surface irrigation systems", "Siphon irrigation setups", "Fogging systems", 
 "Aquaponic water systems", "Hydroponic water pumps", "Landscape irrigation supplies", 
 "Water filters for irrigation", "Garden misting systems", "Floating irrigation systems", 
 "Watering wands", "Irrigation hoses", "Subsurface irrigation systems", 
 "Mulched irrigation setups", "Rain gauges", "Moisture meters", 
 "Water collection barrels", "Landscape fabric for irrigation", "Watering globes", 
 "Irrigation design software", "Leak detection systems", "Bulk water storage tanks", 
 "Drip tape", "Water conservation tools", "Solar-powered irrigation pumps", 
 "Aqueducts for large farms", "Portable irrigation systems", "Irrigation scheduling tools", 
 "Landscape irrigation design services", "Hydroponic nutrient solutions", 
 "Underground irrigation systems", "Water softeners", "Garden spigots", 
 "Gravity-fed irrigation systems", "Timer-controlled sprinkler heads",
];


function AllInventory() {
    const [items, setItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch inventory items
        axios.get("http://localhost:8000/inventoryitem/")
            .then((res) => {
                setItems(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    const handleView = (id) => {
        navigate(`/supplyupdate/${id}`);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/inventoryitem/delete/${id}`)
            .then((res) => {
                alert(res.data.status);
                setItems((prevItems) => prevItems.filter(item => item._id !== id));
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleAggregate = () => {
        axios.post("http://localhost:8000/availableitem/aggregate")
            .then((res) => {
                alert(res.data.message);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleUpdate = (item) => {
        axios.put(`http://localhost:8000/inventoryitem/update/${item._id}`, item)
            .then((res) => {
                alert(res.data.status);
                setItems((prevItems) => prevItems.map(i => (i._id === item._id ? item : i)));
                setEditingItemId(null);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.addImage(logo, 'PNG', 10, 10, 50, 20);
        doc.text("Govimithu Pvt Limited", 20, 35);
        doc.text("Anuradhapura Kahatagasdigiliya", 20, 40);
        doc.text("Phone Number: 0789840996", 20, 45);
        doc.text('Inventory List', 20, 60);

        const columns = [
            { header: "ID", dataKey: "id" },
            { header: "Name", dataKey: "name" },
            { header: "Supplier Name", dataKey: "supName" },
            { header: "Description", dataKey: "description" },
            { header: "Category", dataKey: "category" },
            { header: "Unit", dataKey: "unit" },
            { header: "Quantity Available", dataKey: "quantityAvailable" },
            { header: "Supply Date", dataKey: "supplyDate" }
        ];
        
        const rows = items.map((item, index) => ({
            id: index + 1,
            name: item.name,
            supName: item.supName,
            description: item.description,
            category: item.category,
            unit: item.unit,
            quantityAvailable: item.quantityAvailable,
            supplyDate: item.supplyDate
        }));

        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: rows.map(row => columns.map(col => row[col.dataKey])),
            startY: 70,
            theme: 'striped'
        });

        doc.save('inventory_list.pdf');
    };

    // Filter items based on the search term
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.quantityAvailable.toString().includes(searchTerm) ||
        item.supplyDate.includes(searchTerm)
    );

    return (
        <div>
            <h2 className="inventory-list-title">Inventory List</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search ID, User, and Contact"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">Search</button>
            </div>
            <button className="aggregate-btn" onClick={handleAggregate}>Aggregate Items</button>
            <p></p>
            <button className="download-btn" onClick={downloadPDF}>Download Full Inventory PDF</button>
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Supplier Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th>Quantity Available</th>
                        <th>Mfd Date</th>
                        <th>Exp Date</th>
                        <th>Supply Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.map((item, index) => (
                        <React.Fragment key={item._id}>
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.supName}</td>
                                <td>{item.description}</td>
                                <td>{item.category}</td>
                                <td>{item.unit}</td>
                                <td>{item.quantityAvailable}</td>
                                <th>{item.mfdDate}</th>
                                <th>{item.expireDate}</th>
                                <td>{item.supplyDate}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                                    <button className="update-btn" onClick={() => setEditingItemId(item._id)}>Update</button>
                                </td>
                            </tr>
                            {editingItemId === item._id && (
                                <tr>
                                    <td colSpan="9">
                                        <div className="edit-row">
                                        <select
                                                value={item.name}
                                                onChange={(e) => {
                                                    const updatedItem = { ...item, name: e.target.value }; // Avoid direct mutation
                                                    setItems(prevItems => prevItems.map(i => (i._id === item._id ? updatedItem : i)));
                                                }}
                                            >
                                                {nameOptions.map((nameOption, idx) => (
                                                    <option key={idx} value={nameOption}>{nameOption}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                defaultValue={item.supName}
                                                onChange={(e) => item.supName = e.target.value}
                                            />
                                            <input
                                                type="text"
                                                defaultValue={item.description}
                                                onChange={(e) => item.description = e.target.value}
                                            />
                                            <input
                                                type="text"
                                                defaultValue={item.category}
                                                onChange={(e) => item.category = e.target.value}
                                            />
                                            <input
                                                type="text"
                                                defaultValue={item.unit}
                                                onChange={(e) => item.unit = e.target.value}
                                            />
                                            <input
                                                type="number"
                                                defaultValue={item.quantityAvailable}
                                                onChange={(e) => item.quantityAvailable = Number(e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                defaultValue={item.supplyDate.split('T')[0]}
                                                onChange={(e) => item.supplyDate = e.target.value}
                                            />
                                            <button onClick={() => handleUpdate(item)}>Save</button>
                                            <p></p>
                                            <button onClick={() => setEditingItemId(null)}>Cancel</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllInventory;
