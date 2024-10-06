const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Order schema definition
const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    productDetails: [
        {
            itemName: { type: String, required: true },
            quantitySold: { type: Number, required: true },
            itemPrice: { type: Number, required: true },
            totalPrice: { type: Number, required: true }
        }
    ],
    saleDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    paymentType: { type: String, enum: ['cash', 'online'], required: true }
});

// Pre-save hook to send email when an order is created
orderSchema.pre('save', async function (next) {
    if (this.isNew) { // Check if it's a new order
        const emailContent = createOrderEmailContent(this);
        await sendOrderEmail(this.email, 'Order Processing', emailContent);
    }
    next();
});

// Function to create the HTML content for the order email
function createOrderEmailContent(order) {
    let itemsHtml = '';
    order.productDetails.forEach(item => {
        itemsHtml += `
            <tr>
                <td>${item.itemName}</td>
                <td>${item.quantitySold}</td>
                <td>${item.itemPrice}</td>
                <td>${item.totalPrice}</td>
            </tr>
        `;
    });

    return `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order, ${order.customerName}!</p>
        <p>Your order details:</p>
        <table border="1">
            <tr>
                <th>Item Name</th>
                <th>Quantity Sold</th>
                <th>Item Price</th>
                <th>Total Price</th>
            </tr>
            ${itemsHtml}
        </table>
        <p>Total Amount: ${order.productDetails.reduce((sum, item) => sum + item.totalPrice, 0)}</p>
        <p>We will notify you once your order is shipped.</p>
    `;
}

// Function to send the order email
async function sendOrderEmail(to, subject, htmlContent) {
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
            from: 'Govimithuru Store <sumithb919@gmail.com>',
            to: to,
            subject: subject,
            html: htmlContent,
        });

        console.log("Order email sent: " + info.messageId);
    } catch (error) {
        console.error("Error sending order email:", error);
    }
}

// Export the Order model
module.exports = mongoose.model('Order', orderSchema);
