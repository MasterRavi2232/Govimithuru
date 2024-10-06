const mongoose = require("mongoose");
const InventoryAlert = require("./InventoryAlert"); // Import InventoryAlert model
const nodemailer = require('nodemailer');

// Schema for available items
const AvailableItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure each name is unique
    },
    supName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    availableItem: {
        type: Number,
        required: true,
    },
}, { toJSON: { getters: true }, toObject: { getters: true } });

// Pre-save hook to check availableItem count and create an alert if necessary
AvailableItemSchema.pre('save', async function (next) {
    if (this.isModified('availableItem') && this.availableItem <= 3) {
        // Generate an alert if available item is <= 3
        const existingAlert = await InventoryAlert.findOne({ itemId: this._id });
        if (!existingAlert) {
            const alertMessage = `Low stock alert: Item "${this.name}" has only ${this.availableItem} left in stock.`;
            
            // Create and save a new inventory alert
            const newAlert = new InventoryAlert({
                itemId: this._id,
                message: alertMessage
            });
            await newAlert.save();

            // Now send the email notification
            const emailMessage = `
                <h1>Low Stock Alert</h1>
                <p>Item "<strong>${this.name}</strong>" has only ${this.availableItem} units left in stock.</p>
            `;

            await sendLowStockEmail('ravindusubasinha082@gmail.com', 'ravindu2232@gmail.com', 'Low Stock Alert', emailMessage);
        }
    }
    next();
});

// Function to send email when stock is low
async function sendLowStockEmail(from, to, subject, htmlContent) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Correct host for Gmail
            port: 465,              // Correct SSL port for Gmail
            secure: true,           // Use SSL
            logger: true,
            debug: true,
            auth: {
                user: "bandarasumith326@gmail.com", // Your sender email address
                pass: 'enag cmin nzoy wpuk', // Your new app password here
            },
            tls: {
                rejectUnauthorized: false // Set to true in production
            }
        });

        const info = await transporter.sendMail({
            from: `Stock Alert <${from}>`,
            to: to, // Receiver's email address
            subject: subject,
            html: htmlContent, // HTML body of the email
        });

        console.log("Email sent: " + info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// Create and export the model
const AvailableItem = mongoose.model("AvailableItem", AvailableItemSchema);
module.exports = AvailableItem;
