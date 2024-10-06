// Import packages and assign variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection successful!");
});
const attendancesRoutes = require('./routes/attendances');
const InventoryItemRouter = require("./routes/InventoryItems.js");
const ShowcaseRouter = require("./routes/Showcase.js");
const CartRouter = require("./routes/Cards.js");
const AvailableItemRouter = require("./routes/AvailableItems");
const financemanage = require("./routes/finances.js");
const DeliverRouter = require("./routes/Deliveries.js");
const UserRoute = require("./routes/userDashboard.js");
const EmployeeRoute = require("./routes/employeeItem");
const ReviewRouter = require("./routes/reviews.js");
const salaryRoutes = require('./routes/salary');
const driverRoutes = require('./routes/driverRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRouter = require("./routes/auth");
const giveChecksRoutes = require("./routes/giveChecksRoutes");
const inventoryAlertRoutes = require("./routes/InventoryAlertRoutes.js");
app.use("/inventoryalert", inventoryAlertRoutes);

app.use("/auth", authRouter);


app.use('/api/attendances', attendancesRoutes);
const OfferRouter = require("./routes/Offer");
app.use("/offers", OfferRouter);
app.use("/api/givechecks", giveChecksRoutes);
const cropSolution = require("./routes/cropSolutions.js");
app.use("/cropSolutions",cropSolution);
const bestSellingRouter = require('./routes/bestSelling');

app.use('/bestSelling', bestSellingRouter);
const otherExpensesRoutes = require("./routes/otherExpensesRoutes");
app.use("/api/otherexpenses", otherExpensesRoutes);


app.use("/inventoryitem",InventoryItemRouter)
app.use("/showcase", ShowcaseRouter);
app.use("/card", CartRouter);
app.use("/availableitem", AvailableItemRouter);
const OrderRouter = require("./routes/Orders.js");
app.use("/orders",OrderRouter);
app.use("/finance", financemanage);
app.use("/delivery",DeliverRouter);
app.use("/user",UserRoute);
app.use("/reviews", ReviewRouter);
app.use("/employee",EmployeeRoute);
app.use('/salary', salaryRoutes);
app.use('/drivers', driverRoutes);
app.use('/payments', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Server is up and running on port no ${PORT}`);
});