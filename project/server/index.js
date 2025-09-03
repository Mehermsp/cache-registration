const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const EXCEL_FILE_PATH = path.join(dataDir, 'registrations.xlsx');

// Initialize Excel file if it doesn't exist
const initializeExcelFile = () => {
  if (!fs.existsSync(EXCEL_FILE_PATH)) {
    const workbook = XLSX.utils.book_new();
    const headers = [
      'Registration ID', 'Event ID', 'Event Name', 'Participant Name', 
      'Email', 'Phone', 'College', 'Total Amount', 'Payment Status', 
      'Payment ID', 'Registration Date', 'Team Members', 'Game IDs'
    ];
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
  }
};

// Save registration to Excel
const saveRegistrationToExcel = (registration) => {
  try {
    initializeExcelFile();
    
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const worksheet = workbook.Sheets['Registrations'];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Flatten the registration data for Excel
    const flattenedData = {
      'Registration ID': registration.registrationId,
      'Event ID': registration.eventId,
      'Event Name': registration.eventName,
      'Participant Name': registration.participantName,
      'Email': registration.email,
      'Phone': registration.phone,
      'College': registration.college || '',
      'Total Amount': registration.totalAmount,
      'Payment Status': registration.paymentStatus,
      'Payment ID': registration.paymentId || '',
      'Registration Date': registration.registrationDate,
      'Team Members': registration.teamMembers ? JSON.stringify(registration.teamMembers) : '',
      'Game IDs': registration.gameIds ? JSON.stringify(registration.gameIds) : ''
    };
    
    data.push(flattenedData);
    
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets['Registrations'] = newWorksheet;
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
    
    return true;
  } catch (error) {
    console.error('Error saving to Excel:', error);
    return false;
  }
};

// Get all registrations from Excel
const getRegistrationsFromExcel = () => {
  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      return [];
    }
    
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const worksheet = workbook.Sheets['Registrations'];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Parse JSON fields back and normalize keys
    return data.map(row => ({
      registrationId: row['Registration ID'],
      eventId: row['Event ID'],
      eventName: row['Event Name'],
      participantName: row['Participant Name'],
      email: row['Email'],
      phone: row['Phone'],
      college: row['College'],
      totalAmount: row['Total Amount'],
      paymentStatus: row['Payment Status'],
      paymentId: row['Payment ID'],
      registrationDate: row['Registration Date'],
      teamMembers: row['Team Members'] ? JSON.parse(row['Team Members']) : null,
      gameIds: row['Game IDs'] ? JSON.parse(row['Game IDs']) : null
    }));
  } catch (error) {
    console.error('Error reading from Excel:', error);
    return [];
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    
    // In production, you would create actual Razorpay order here
    const order = {
      id: `order_${uuidv4()}`,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: receipt,
      status: 'created'
    };
    
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Save registration
app.post('/api/register', async (req, res) => {
  try {
    const registrationData = req.body;
    
    const registration = {
      registrationId: `CACHE2K25_${uuidv4().substring(0, 8).toUpperCase()}`,
      ...registrationData,
      registrationDate: new Date().toISOString(),
      paymentStatus: 'completed'
    };
    
    const saved = saveRegistrationToExcel(registration);
    
    if (saved) {
      res.json({ 
        success: true, 
        registrationId: registration.registrationId,
        message: 'Registration saved successfully' 
      });
    } else {
      res.status(500).json({ error: 'Failed to save registration' });
    }
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Failed to process registration' });
  }
});

// Get all registrations (admin endpoint)
app.get('/api/registrations', (req, res) => {
  try {
    const registrations = getRegistrationsFromExcel();
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Get registrations by event
app.get('/api/registrations/:eventId', (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = getRegistrationsFromExcel();
    const eventRegistrations = registrations.filter(reg => reg.eventId === eventId);
    res.json(eventRegistrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({ error: 'Failed to fetch event registrations' });
  }
});

// Download Excel file (admin endpoint)
app.get('/api/download-excel', (req, res) => {
  try {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
      return res.status(404).json({ error: 'No registrations found' });
    }
    
    res.download(EXCEL_FILE_PATH, 'cache2k25_registrations.xlsx');
  } catch (error) {
    console.error('Error downloading Excel:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Verify payment (webhook endpoint)
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    // In production, verify the signature using Razorpay's crypto verification
    // For demo, we'll assume verification is successful
    
    res.json({ 
      success: true, 
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id 
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Initialize Excel file on startup
initializeExcelFile();

app.listen(PORT, () => {
  console.log(`🚀 Cache2K25 Backend Server running on port ${PORT}`);
  console.log(`📊 Excel file will be saved at: ${EXCEL_FILE_PATH}`);
  console.log(`🌐 Frontend should be running on: http://localhost:5173`);
});